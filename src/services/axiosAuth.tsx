import { toast } from '@/utils/toast';
import axios from 'axios';
import { apiURL, deleteItem, getItem } from '../constants/const';


const axiosAuth = axios.create({
  baseURL: `${apiURL}/api/auth`,
  headers: {
    'Content-Type': 'application/json',
    'X-App-Source': 'almobe-react-client',
  },
  timeout: 10000,
});

// Hàm hỗ trợ xóa dữ liệu khi hết hạn
const clearClientAuth = () => {
  deleteItem('access_token');
  deleteItem('expires_at');
  // Nếu có dùng Redux/Slice để lưu profile client, bạn nên dispatch reset ở đây
};

axiosAuth.interceptors.request.use(
  async (config) => { // 🌟 THÊM async ở đây
    try {
      // 🌟 THÊM await ở đây để lấy ra chính xác chuỗi string token
      const token = await getItem('access_token'); 
      const expiresAt = await getItem('expires_at');

      // Kiểm tra hạn token
      if (expiresAt && Date.now() > Number(expiresAt)) {
        // clearClientAuth(); // Hàm xóa auth của bạn
        const controller = new AbortController();
        config.signal = controller.signal;
        controller.abort();
        // toast("Phiên đăng nhập đã hết hạn!", "error");
        return config;
      }

      // Gán token thật (dạng string) vào header
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Lỗi đọc SecureStore trong interceptor:", error);
    }

    return config;
  },
  (error) => Promise.reject(error)
);



axiosAuth.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      const message = data?.message || 'Đã xảy ra lỗi';
      console.log("--- CHI TIẾT LỖI API ---");
            console.log("Request URL:", `${apiURL}/api/auth` + error.config.url); // Tránh cộng chuỗi nếu apiURL đã có trong cấu hình base
            const payload = error.config.data ? JSON.parse(error.config.data) : "Không có payload";
            console.log("Payload (Request Body):", payload);
            console.log("Request Method:", error.config.method?.toUpperCase());
            console.log("Status Code:", error.response.status, error.response.statusText);
            console.log("Request Headers:", error.config.headers);
            console.log("Response Headers:", error.response.headers);
            console.log("------------------------");
      switch (status) {
        case 401:
          // Xử lý khi Token hết hạn hoặc không hợp lệ từ phía Server
          if (!window.location.pathname.includes('/login')) {
            toast("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.", "error");
            clearClientAuth();
            // Điều hướng người dùng nếu cần
            // setTimeout(() => window.location.href = '/login', 1500);
          }
          break;

        case 403:
          toast("Bạn không có quyền truy cập!", "error");
          break;

        case 422:
          const validationErrors = data?.errors;
          toast(Array.isArray(validationErrors) ? validationErrors[0] : (validationErrors || "Dữ liệu không hợp lệ."), "error");
          break;

        case 429:
          toast("Quá nhiều yêu cầu, vui lòng thử lại sau!", "error");
          break;

        case 500:
          toast('Lỗi hệ thống máy chủ!', "error");
          break;

        default:
          toast(message, "error");
      }
      // if(window.location.pathname !== "/login" &&  !window.location.pathname.startsWith("/1204/admin")){
      //   window.location.href = '/login'; 
      // } 
    } else if (error.code === 'ERR_CANCELED') {
      // Request bị hủy do chủ động check ở interceptor.request, không cần bắn lỗi thêm
      console.log('Request canceled by client (Expired)');
    } else {
      toast("Lỗi kết nối hoặc CSP chặn!", "error");
    }
    
    return Promise.reject(error);
  }
);

export default axiosAuth;