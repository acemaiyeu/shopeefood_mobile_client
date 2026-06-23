// store/cartSlice.js
import { createSlice } from '@reduxjs/toolkit';

const PublicSlice = createSlice({
  name: 'cart',
  initialState: { 
    cart: undefined,
    total_cart: 1
   },
  reducers: {
    updatePublic: (state, action) => {
      state.cart = action.payload.cart??state.cart;
      state.total_cart = action.payload.total_cart??state.total_cart;
    },
  },
});

export const { updatePublic } = PublicSlice.actions;
export default PublicSlice.reducer;