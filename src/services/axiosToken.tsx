import { apiURL, deleteItem, getItem } from '@/constants/const';
import { toast } from '@/utils/toast';
import axios from 'axios';
import * as Crypto from 'expo-crypto';
import * as Device from 'expo-device';
import { router } from 'expo-router'; // CHÚ Ý: Import thẳng object router thay vì hook useRouter
import { Alert } from 'react-native';

// 1. Hàm sinh mã định danh thiết bị độc nhất
const generateDeviceIdentifier = async () => {
  const info = [
    Device.brand,
    Device.modelName,
    Device.osName,
    Device.osVersion,
    Device.totalMemory
  ].join('|');
  
  const hash = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    info
  );
  return hash;
};

// 2. Tạo Instance Axios
const axiosToken = axios.create({
  baseURL: `${apiURL}/api/v2/`,
  headers: {
    'Content-Type': 'application/json',
    'X-App-Source': 'almobe-react-client',
  },
  timeout: 10000,
});

// Hàm hỗ trợ xóa dữ liệu auth khi hết hạn/lỗi thiết bị
const clearClientAuth = async () => {
  await deleteItem('access_token');
  await deleteItem('expires_at');
};

// 3. Request Interceptor: Tự động đính kèm Token và Device ID
axiosToken.interceptors.request.use(
  async (config) => {
    const token = await getItem('access_token');
    const expiresAt = await getItem('expires_at');
    const deviceId = await generateDeviceIdentifier();
    console.log("check token", token, deviceId)
    // Kiểm tra chủ động: Hết hạn Token dựa trên thời gian lưu ở Client
    if (expiresAt && Date.now() > Number(expiresAt)) {
      await clearClientAuth();
      
      const controller = new AbortController();
      config.signal = controller.signal;
      controller.abort();

      Alert.alert("Thông báo", "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!");
      return config;
    }

    // Luôn đính kèm mã máy vào Header (Kể cả khi chưa có token để Backend tiện xử lý nếu cần)
    config.headers['X-Device-ID'] = deviceId;

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 4. Response Interceptor: Xử lý kết quả trả về và xử lý lỗi tập trung
axiosToken.interceptors.response.use(
  (response) => {
    // Trả thẳng dữ liệu sạch (response.data) về cho nơi gọi API sử dụng ngắn gọn
    return response.data;
  },
  async (error) => {
    if (error.response) {
      // --- LOG DEBUG CHI TIẾT LỖI API ---
      console.log("--- CHI TIẾT LỖI API ---");
      console.log("Request URL:", error.config.baseURL + error.config.url);
      const payload = error.config.data ? error.config.data : "Không có payload";
      console.log("Payload (Request Body):", payload);
      console.log("Request Method:", error.config.method?.toUpperCase());
      console.log("Status Code:", error.response.status, error.response.statusText);
      console.log("Response Data:", error.response.data);
      console.log("------------------------");

      const { status, data } = error.response;
      const message = data?.message || 'Đã xảy ra lỗi';

      switch (status) {
        case 401:
          // Token hết hạn hoặc sai lệch từ phía Server trả về
          toast("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.", "error");
          await clearClientAuth();
          router.replace('/(auth)/login'); // Sử dụng expo-router để điều hướng chuẩn Native
          break;

        case 403:
          // Lỗi không có quyền TRỰC TIẾP hoặc lỗi LỆCH MÃ MÁY (X-Device-ID không khớp)
          // Đọc message Backend trả về nếu có thông báo cụ thể tài khoản đăng nhập máy khác
          toast(message || "Bạn không có quyền truy cập!", "error");
          await clearClientAuth();
          router.replace('/(auth)/login');
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
      console.log('Request canceled by client (Expired)');
    } else {
      toast("Lỗi kết nối hoặc không phản hồi từ máy chủ!", "error");
    }

    return Promise.reject(error);
  }
);

export default axiosToken;