import { primary_color, setItem, SF_Pro, SF_Pro_DISPLAY_BOLD } from "@/constants/const";
import { getNotifications } from "@/services/NotificationService";
import { updatePublic } from "@/store/features/PublicSlice";
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import { useNavigation } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import { Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

// Interface định dạng dữ liệu lưu trong bộ nhớ SecureStore
interface ReadItem {
  id: string;
  createdAt: number; // Lưu timestamp thời gian đọc
}

interface Notification {
  id: number | string;
  title: string;
  content: string;
  is_read: number;
  created_at?: string;
  [key: string]: any; 
}

const NotifiHome = () => {
  const { notification, total_notification } = useSelector((state: any) => state.public);
  const [listNotifications, setListNotifications] = useState<Notification[]>([]);
  const navigation: any = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const dispatch = useDispatch();
  // HẰNG SỐ: 30 ngày tính bằng miligiây (30 ngày * 24 giờ * 60 phút * 60 giây * 1000ms)
  const EXPIRATION_TIME = 30 * 24 * 60 * 60 * 1000; 

  // 1. Hàm lấy dữ liệu từ API và tự động dọn dẹp bộ nhớ đã quá 30 ngày
// 1. Hàm lấy dữ liệu từ API và tự động dọn dẹp bộ nhớ đã quá 30 ngày
  const getData = async () => {
    try {
      setRefreshing(true);
      const data = await getNotifications();
      
      if (data && data.data) {
        let apiData: Notification[] = data.data;

        // Lấy danh sách Object đã đọc từ bộ nhớ
        const notifiesStr = await SecureStore.getItemAsync('notifications');
        let localReadItems: ReadItem[] = notifiesStr ? JSON.parse(notifiesStr) : [];

        // --- LOGIC TỰ ĐỘNG XÓA SAU 30 NGÀY ---
        const now = Date.now();
        const validReadItems = localReadItems.filter(item => (now - item.createdAt) < EXPIRATION_TIME);

        if (validReadItems.length !== localReadItems.length) {
          await setItem("notifications", JSON.stringify(validReadItems));
        }

        // Tạo mảng chỉ chứa các chuỗi ID hợp lệ để kiểm tra nhanh
        const validReadIds = validReadItems.map(item => item.id);

        // --- TÍNH NĂNG MỚI: LỌC CÁC THÔNG BÁO CHƯA ĐỌC (KHÔNG CÓ TRONG IDS) ---
        const unreadNotifications = apiData.filter(item => !validReadIds.includes(item.id + ""));

        // Nếu có thông báo chưa đọc, hiển thị Alert thông báo cho người dùng
        if (unreadNotifications.length > 0) {
          // Gom tiêu đề của các thông báo chưa đọc lại thành một chuỗi văn bản
          const unreadTitles = unreadNotifications.map(item => `- ${item.title}`).join("\n");
          
          dispatch(updatePublic({total_notification: unreadNotifications.length}))
        }

        // Duyệt qua danh sách từ API, đồng bộ trạng thái hiển thị UI
        const mappedData = apiData.map((item) => ({
          ...item,
          is_read: validReadIds.includes(item.id + "") ? 1 : Number(item.is_read)
        }));

        setListNotifications(mappedData);
      }
    } catch (error) {
      console.log("Lỗi lấy danh sách thông báo:", error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const fetchData = () => {
    getData();
  };

  useEffect(() => {
    if (notification?.id) {
      setListNotifications(prev => {
        const isExist = prev.some(item => item.id === notification.id);
        if (isExist) return prev;
        
        return [{ ...notification, is_read: 0 }, ...prev];
      });
    }
  }, [total_notification, notification]);

  // 2. Hàm xử lý khi nhấn vào chi tiết (Lưu ID + Thời gian hiện tại)
  // 2. Hàm xử lý khi nhấn vào chi tiết từng thông báo
  const handleDetail = async (noti: Notification) => {
    const notiIdStr = noti.id + "";

    // Cập nhật giao diện lập tức (Chuyển item vừa click thành đã đọc)
    setListNotifications(prev => 
      prev.map((item) => item.id === noti.id ? { ...item, is_read: 1 } : item)
    );

    try {
      const notifiesStr = await SecureStore.getItemAsync('notifications');
      let localReadItems: ReadItem[] = notifiesStr ? JSON.parse(notifiesStr) : [];

      // Kiểm tra xem ID này đã được lưu trước đó chưa
      const isExist = localReadItems.some(item => item.id === notiIdStr);

      if (!isExist) {
        // Lưu kèm theo dấu mốc thời gian hiện tại
        localReadItems.push({
          id: notiIdStr,
          createdAt: Date.now()
        });

        // Cập nhật Redux: Tránh giảm xuống số âm, nếu nhỏ hơn 0 thì giữ là 0
        const newTotal = total_notification > 0 ? total_notification - 1 : 0;
        dispatch(updatePublic({ total_notification: newTotal }));

        await setItem("notifications", JSON.stringify(localReadItems));
      }
    } catch (error) {
      console.log("Lỗi lưu bộ nhớ mã thông báo:", error);
    }

    navigation.navigate("notifi_detail", { 
      noti: JSON.stringify({ ...noti, is_read: 1 }) 
    });
  };

  // 3. Đánh dấu đã đọc tất cả (SỬA LỖI ĐỒNG BỘ REDUX TẠI ĐÂY)
  const handleReadAll = async () => {
    try {
      const now = Date.now();
      
      // Lấy lại danh sách đã lưu trong bộ nhớ trước đó để gộp chung (tránh ghi đè mất các item cũ)
      const notifiesStr = await SecureStore.getItemAsync('notifications');
      let localReadItems: ReadItem[] = notifiesStr ? JSON.parse(notifiesStr) : [];
      const existingIds = localReadItems.map(item => item.id);

      // Chỉ thêm những ID chưa tồn tại trong bộ nhớ tạm
      listNotifications.forEach(item => {
        const itemIdStr = item.id + "";
        if (!existingIds.includes(itemIdStr)) {
          localReadItems.push({
            id: itemIdStr,
            createdAt: now
          });
        }
      });
      
      // 1. Lưu lại danh sách mới vào SecureStore
      await setItem("notifications", JSON.stringify(localReadItems));
      
      // 2. Cập nhật giao diện lập tức thành đã đọc tất cả
      setListNotifications(prev => prev.map(item => ({ ...item, is_read: 1 })));

      // 3. CẬP NHẬT REDUX: Đưa tổng số thông báo chưa đọc về số 0
      dispatch(updatePublic({ total_notification: 0 }));

    } catch (error) {
      console.log("Lỗi khi đánh dấu đã đọc tất cả:", error);
    }
  };

  return (
    <ScrollView 
      style={styles.container} 
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchData} />}
    >
      {listNotifications && listNotifications.length > 0 ? (
        <View style={styles.box}>
          <View style={styles.headerBox}>
            <Text style={styles.readAllText} onPress={handleReadAll}>Đã đọc tất cả</Text>
          </View>
          <View style={styles.list_notifications}>
            {listNotifications.map((noti, noti_index) => (
              <Pressable 
                key={noti.id ? noti.id.toString() : noti_index.toString()} 
                onPress={() => handleDetail(noti)} 
                style={[
                  styles.item_notification, 
                  noti.is_read !== 1 && styles.active, 
                  noti_index === 0 && styles.item_notification_first, 
                  noti_index === listNotifications.length - 1 && styles.item_notification_last
                ]}
              >
                <View style={styles.icon}>
                  <AntDesign name="notification" size={20} color={primary_color} />
                </View>
                <View style={styles.info_notification}>
                  <View style={styles.info_notification_box}>
                    <View style={styles.info_notification_title}>
                      <Text style={styles.info_notification_title_text}>{noti.title}</Text>
                      {noti.is_read !== 1 && <Entypo name="dot-single" size={24} color={primary_color} />}
                    </View>
                    <Text numberOfLines={1} ellipsizeMode="tail" style={styles.info_notification_content}>
                      {noti.content}
                    </Text>
                  </View>
                  <Text style={styles.info_notification_created_at}>{noti.created_at}</Text>
                </View>
              </Pressable>
            ))}
          </View>
        </View>
      ) : (
        <Text style={styles.container_text}>Bạn không có thông báo</Text>
      )}
    </ScrollView>
  );
};



const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
  },
  container_text: {
    fontFamily: SF_Pro_DISPLAY_BOLD,
    color: primary_color,
    textAlign: 'center',
    marginTop: 40
  },
  box: {
    width: "95%",
    backgroundColor: "#fff",
    marginVertical: 10,
    borderRadius: 5,
    marginHorizontal: 'auto',
    elevation: 1, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  headerBox: {
    padding: 10,
    borderBottomWidth: 0.5,
    borderColor: '#eee',
    alignItems: 'flex-end'
  },
  readAllText: {
    color: primary_color,
    fontSize: 12,
    fontFamily: SF_Pro,
    padding: 4
  },
  list_notifications: {
    width: "100%"
  },
  item_notification: {
    width: "100%",
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#eee"
  },
  info_notification: {
    flex: 1,
    paddingHorizontal: 5,
  },
  info_notification_box: {
    overflow: 'hidden'
  },
  info_notification_title: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  info_notification_title_text: {
    fontSize: 14,
    fontFamily: SF_Pro_DISPLAY_BOLD,
    flex: 1,
  },
  info_notification_content: {
    fontSize: 13,
    fontFamily: SF_Pro,
    color: '#555',
    marginTop: 2
  },
  icon: {
    marginTop: 2,
    paddingRight: 5
  },
  active: {
    backgroundColor: "#e413590a" 
  },
  item_notification_first: {
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5
  },
  item_notification_last: {
    borderBottomRightRadius: 5,
    borderBottomLeftRadius: 5,
    borderBottomWidth: 0
  },
  info_notification_created_at: {
    color: "#a19d9d",
    fontSize: 10,
    marginTop: 4
  }
});

export default NotifiHome;