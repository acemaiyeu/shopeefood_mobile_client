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
    audio_notification: false
   },
  reducers: {
    updatePublic: (state, action) => {
      state.cart = action.payload.cart??state.cart;
      state.total_cart = action.payload.total_cart??state.total_cart;
      state.login = (action.payload.login === 'is_login' || action.payload.login === 'none_login') ? action.payload.login : state.login;
      state.refresh_cart = action.payload.refresh_cart === true ? (state.refresh_cart == 1 ? 2 : 1) :state.refresh_cart;
      state.order = action.payload.order??state.order;
      state.notification = action.payload.notification??state.notification;
      state.audio_notification = (action.payload.audio_notification === true || action.payload.audio_notification === false) ? action.payload.audio_notification : state.audio_notification;
    },
  },
});

export const { updatePublic } = PublicSlice.actions;
export default PublicSlice.reducer;