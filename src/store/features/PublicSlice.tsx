// store/cartSlice.js
import { createSlice } from '@reduxjs/toolkit';

const PublicSlice = createSlice({
  name: 'public',
  initialState: { 
    cart: undefined,
    total_cart: 0,
    login: 'none_login',
    refresh_cart: 1,
    order: {},
    notification: {},
    audio_notification: false,
    profile: {},
    total_notification: 0,
    loadding: false,
    version: "1.0.0",
    version_content: "",
    positionDynamic: 11 // ✅ Đã sửa chính xác thành chữ T
   },
  reducers: {
    updatePublic: (state, action) => {
      // Cách viết hiện đại & an toàn nhất của Redux Toolkit: 
      // Duyệt qua tất cả các key truyền lên trong payload và ghi đè thẳng vào state
      Object.keys(action.payload).forEach((key) => {
        if (key === 'refresh_cart' && action.payload.refresh_cart === true) {
          state.refresh_cart = state.refresh_cart == 1 ? 2 : 1;
        } else if (key === 'total_notification_temp') {
          // Bỏ qua không gán trực tiếp mà xử lý riêng ở dưới
        } else {
          state[key] = action.payload[key];
        }
      });

      // Xử lý riêng logic cộng dồn thông báo của bạn
      if (action.payload.total_notification_temp === true) {
        state.total_notification += 1;
      }
    },
  }
});

export const { updatePublic } = PublicSlice.actions;
export default PublicSlice.reducer;