// store/cartSlice.js
import { createSlice } from '@reduxjs/toolkit';

const PublicSlice = createSlice({
  name: 'public',
  initialState: { 
    cart: undefined,
    total_cart: 0,
    login: false
   },
  reducers: {
    updatePublic: (state, action) => {
      state.cart = action.payload.cart??state.cart;
      state.total_cart = action.payload.total_cart??state.total_cart;
      state.login = action.payload.login??state.login;
    },
  },
});

export const { updatePublic } = PublicSlice.actions;
export default PublicSlice.reducer;