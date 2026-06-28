import { getItem } from '@/constants/const';
import React, { createContext, useContext, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updatePublic } from '../features/PublicSlice';

// Cấu hình các URL hệ thống của bạn
const BASE_WS_URL = 'ws://192.168.31.81:6001'; // URL Socket server local (dùng ws, không dùng wss)
const API_URL_NOTIFY = 'http://192.168.31.81:8000'; // URL Backend API Laravel

interface WebSocketContextType {
  connect: (channelId: string | number) => Promise<void>;
  disconnect: (channelId: string | number) => void;
  sendMessage: (message: any) => void;
  isConnected: boolean;
  currentChannel: string | number | null;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export default function WebSocketProvider({ children }: { children: React.ReactNode }) {
// const player = useAudioPlayer(require('../../../assets/audio/notifi.mp3'));
  const ws = useRef<WebSocket | null>(null);
  const {total_notification} = useSelector((state: any) => state.public)
  const heartbeatTimer = useRef<any>(null); // Bộ đếm thời gian gửi Ping giữ kết nối
  const [isConnected, setIsConnected] = useState(false);
  const [currentChannel, setCurrentChannel] = useState<string | number | null>(null);
  const dispatch = useDispatch();
  // Hàm kết nối: Nhận vào channelId
  const connect = async (channelId: string | number) => {
    if (ws.current) {
      console.log('⚠️ Đang có kết nối tồn tại.');
      return;
    }

    // Tên channel theo chuẩn Private của Laravel (Ví dụ: private-notify.5256740001846)
    const channelName = `private-notify.${channelId}`;
    const PUSHER_APP_KEY = 'foodkey'; // Key của Pusher/Laravel WebSockets cấu hình ở .env backend
    const fullUrl = `${BASE_WS_URL}/app/${PUSHER_APP_KEY}?protocol=7&client=js&flash=false`;

    console.log('📡 Giai đoạn 1: Khởi tạo kết nối WebSocket trước...');
    ws.current = new WebSocket(fullUrl);

    // Kích hoạt khi mở cổng kết nối thành công với Server Socket
    ws.current.onopen = () => {
      console.log('🟢 WebSocket đã mở cổng kết nối thành công!');

      // 🔥 BẮT ĐẦU CƠ CHẾ HEARTBEAT (GIỮ SỐNG KẾT NỐI KHÔNG BỊ ĐÓNG NHANH)
      if (heartbeatTimer.current) clearInterval(heartbeatTimer.current);
      
      heartbeatTimer.current = setInterval(() => {
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
          console.log(`💓 Gửi PING giữ sống kết nối (${channelId})...`);
          ws.current.send(JSON.stringify({ event: 'pusher:ping' }));
        }
      }, 10000); // Đều đặn gửi Ping mỗi 10 giây một lần
    };

    // Trung tâm xử lý và phân tầng tất cả các luồng dữ liệu đổ về từ Server
    ws.current.onmessage = async (e) => {
      const response = JSON.parse(e.data);

      // 0. Nhận phản hồi giữ sống PONG từ Server Socket
      if (response.event === 'pusher:pong') {
        // console.log('💙 Server đã phản hồi PONG (Kết nối ổn định)');
        return;
      }

      // =========================================================================
      // GIAI ĐOẠN 2: Bắt tay lấy Socket ID thật từ Server gửi về và gọi API Auth Laravel
      // =========================================================================
      if (response.event === 'pusher:connection_established') {
        const connectionData = JSON.parse(response.data);
        const realSocketId = connectionData.socket_id;

        console.log('🔑 Giai đoạn 2: Lấy Socket ID THẬT từ server thành công:', realSocketId);
        console.log(`🔒 Giai đoạn 3: Gửi request xác thực quyền vào kênh qua API Laravel với ID thật này...`);

        try {
          // Lấy token sạch từ thiết bị lưu trữ
          let token = await getItem('access_token');
          if (token && token.startsWith('"') && token.endsWith('"')) {
            token = JSON.parse(token);
          }

          // Gọi API của Laravel để xin chữ ký (Auth)
          const authResponse = await fetch(`${API_URL_NOTIFY}/api/broadcasting/auth`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Authorization': `Bearer ` + token,
            },
            body: JSON.stringify({
              channel_name: channelName,
              socket_id: realSocketId, // Truyền socket_id xịn vừa lấy được
            }),
          });

          if (!authResponse.ok) {
            throw new Error('Xác thực API Auth của Laravel thất bại (403/401)');
          }

          const authData = await authResponse.json();
          console.log('✅ Laravel Auth 200 OK! Gửi lệnh pusher:subscribe chính thức...');

          // Gửi tin nhắn subscribe kèm chữ ký xác thực ngược lại lên Server Socket để vào phòng chờ
          ws.current?.send(
            JSON.stringify({
              event: 'pusher:subscribe',
              data: {
                auth: authData.auth,
                channel: channelName,
                channel_data: authData.channel_data,
              },
            })
          );
        } catch (error) {
          console.error('🔴 Thất bại trong quá trình xác thực:', error);
          ws.current?.close(); // Đóng kết nối nếu bước xác thực thất bại
        }
        return; // Thoát hàm để đứng đợi phản hồi tiếp theo từ server
      }

      // =========================================================================
      // GIAI ĐOẠN 4: Server Socket xác nhận đã đưa thiết bị vào phòng chờ thành công
      // =========================================================================
      if (response.event === 'pusher_internal:subscription_succeeded') {
        console.log(`🎉 [XÁC NHẬN] Đã kết nối & vào phòng chờ thành công kênh: ${channelName}`);
        setIsConnected(true);
        setCurrentChannel(channelId);
        return; // Thoát hàm đứng đợi Postman/Backend kích hoạt bắn dữ liệu thực tế
      }

      // =========================================================================
      // GIAI ĐOẠN 5: Đón nhận tin nhắn REALTIME khi có đơn hàng / thông báo mới
      // =========================================================================
      // Khớp chính xác với hàm broadcastAs() bạn khai báo ở Backend là 'private-notify'
      if (response.event === 'private-notify') {
        // Đảm bảo bóc tách JSON chuẩn nếu dữ liệu data bị bọc chuỗi (String) 2 lần
        const eventData = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;

        console.log('🔥 [THÀNH CÔNG RỰC RỠ] ĐÃ NHẬN ĐƯỢC DATA REALTIME:', eventData.data, eventData.data.order);

        if(eventData.data.order){
           dispatch(updatePublic({order: eventData.data.order}))
        }
        if(eventData.data.notification){
           dispatch(updatePublic({notification: eventData.data.notification, total_notification: total_notification + 1}))
        }
       
        
        // Bạn có thể xử lý bắn Toast, Dispatch vào Redux, hoặc hiển thị Thông báo tại đây:
        // alert(`[Thông báo đơn hàng]\n${eventData.message}\nMã đơn: ${eventData.order_code}`);
      }
    };

    // Bẫy lỗi đường truyền kết nối WebSocket
    ws.current.onerror = (e) => console.error('🔴 WS Error:', e);

    // Xử lý khi kết nối bị ngắt
    ws.current.onclose = () => {
      setIsConnected(false);
      setCurrentChannel(null);
      ws.current = null;

      // Xóa bộ đếm thời gian Heartbeat tránh rò rỉ bộ nhớ (Memory Leak)
      if (heartbeatTimer.current) {
        clearInterval(heartbeatTimer.current);
        heartbeatTimer.current = null;
      }
      console.log('⚪ Đã ngắt kết nối channel và dừng Heartbeat.');
    };
  };

  // Hàm ngắt kết nối chủ động
  const disconnect = (channelId: string | number) => {
    if (heartbeatTimer.current) {
      clearInterval(heartbeatTimer.current);
      heartbeatTimer.current = null;
    }

    if (ws.current) {
      const channelName = `private-notify.${channelId}`;
      ws.current.send(
        JSON.stringify({
          event: 'pusher:unsubscribe',
          data: { channel: channelName },
        })
      );
      ws.current.close();
    }
  };

  // Hàm gửi tin nhắn ngược từ Client lên Server (nếu cần)
  const sendMessage = (message: any) => {
    if (ws.current && isConnected) {
      ws.current.send(JSON.stringify(message));
    }
  };

  return (
    <WebSocketContext.Provider value={{ connect, disconnect, sendMessage, isConnected, currentChannel }}>
      {children}
    </WebSocketContext.Provider>
  );
}

export const useWS = () => {
  const context = useContext(WebSocketContext);
  if (!context) throw new Error('useWS phải được đặt bên trong WebSocketProvider');
  return context;
};