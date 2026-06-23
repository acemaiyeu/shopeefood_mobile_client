import { toast } from '@/utils/toast';
import axios from 'axios';
import { apiURL, deleteItem, getItem } from '../constants/const';


const axiosClient = axios.create({
  baseURL: `${apiURL}/api/`,
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

axiosClient.interceptors.request.use(
  (config) => {
    const token = getItem('access_token');
    const expiresAt = getItem('expires_at');
    // 1. KIỂM TRA CHỦ ĐỘNG: Nếu biết chắc token đã hết hạn thì không gửi request nữa
    if (expiresAt && Date.now() > Number(expiresAt)) {
      clearClientAuth();
      
      // Hủy request để tiết kiệm tài nguyên
      const controller = new AbortController();
      config.signal = controller.signal;
      controller.abort();

      toast("Phiên đăng nhập đã hết hạn!", "error");
      // window.location.href = '/login'; 
      return config;
    }

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    // Kiểm tra bảo mật domain
    // if (!config.baseURL.includes('almobe.io.vn') && !config.baseURL.includes('192.168.') && !config.baseURL.includes('localhost')) {
    //   return Promise.reject(new Error('Cảnh báo: Nguồn không xác thực!'));
    // }
    return config;
  },
  (error) => Promise.reject(error)
);



axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      // 1. Log chi tiết lỗi để debug
      console.log("--- CHI TIẾT LỖI API ---");
      console.log("Request URL:", `${apiURL}/api` + error.config.url); // Tránh cộng chuỗi nếu apiURL đã có trong cấu hình base
      const payload = error.config.data ? JSON.parse(error.config.data) : "Không có payload";
      console.log("Payload (Request Body):", payload);
      console.log("Request Method:", error.config.method?.toUpperCase());
      console.log("Status Code:", error.response.status, error.response.statusText);
      console.log("Request Headers:", error.config.headers);
      console.log("Response Headers:", error.response.headers);
      console.log("------------------------");

      // 2. Xử lý logic theo status code
      const { status, data } = error.response;
      const message = data?.message || 'Đã xảy ra lỗi';

      switch (status) {
        case 401:
          if (!window.location.pathname.includes('/login')) {
            toast("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.", "error");
            clearClientAuth();
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
    } else if (error.code === 'ERR_CANCELED') {
      console.log('Request canceled by client');
    } else {
      toast("Lỗi kết nối hoặc không phản hồi từ máy chủ!", "error");
    }

    return Promise.reject(error);
  }
);

export default axiosClient;