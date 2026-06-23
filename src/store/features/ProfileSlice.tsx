// store/cartSlice.js
import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: { qty: 1 },
  reducers: {
    updateQty: (state, action) => {
      state.qty = action.payload;
    },
  },
});

export const { updateQty } = cartSlice.actions;
export default cartSlice.reducer;