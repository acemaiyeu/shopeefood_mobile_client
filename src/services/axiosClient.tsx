import axios from 'axios';
import { toast } from 'react-toastify';
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

      toast.error("Phiên đăng nhập đã hết hạn!");
      // window.location.href = '/login'; 
      return config;
    }

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    // Kiểm tra bảo mật domain
    if (!config.baseURL.includes('almobe.io.vn') && !config.baseURL.includes('192.168.') && !config.baseURL.includes('localhost')) {
      return Promise.reject(new Error('Cảnh báo: Nguồn không xác thực!'));
    }
    return config;
  },
  (error) => Promise.reject(error)
);



axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      const message = data?.message || 'Đã xảy ra lỗi';

      switch (status) {
        case 401:
          // Xử lý khi Token hết hạn hoặc không hợp lệ từ phía Server
          if (!window.location.pathname.includes('/login')) {
            toast.error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.");
            clearClientAuth();
            // Điều hướng người dùng nếu cần
            // setTimeout(() => window.location.href = '/login', 1500);
          }
          break;

        case 403:
          toast.error("Bạn không có quyền truy cập!");
          break;

        case 422:
          const validationErrors = data?.errors;
          toast.error(Array.isArray(validationErrors) ? validationErrors[0] : (validationErrors || "Dữ liệu không hợp lệ."));
          break;

        case 429:
          toast.error("Quá nhiều yêu cầu, vui lòng thử lại sau!");
          break;

        case 500:
          toast.error('Lỗi hệ thống máy chủ!');
          break;

        default:
          toast.error(message);
      }
      if(window.location.pathname !== "/login" &&  !window.location.pathname.startsWith("/1204/admin")){
        window.location.href = '/login'; 
      } 
    } else if (error.code === 'ERR_CANCELED') {
      // Request bị hủy do chủ động check ở interceptor.request, không cần bắn lỗi thêm
      console.log('Request canceled by client (Expired)');
    } else {
      toast.error("Lỗi kết nối hoặc CSP chặn!");
    }
    
    return Promise.reject(error);
  }
);

export default axiosClient;