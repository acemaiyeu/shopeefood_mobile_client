// store/index.js
import { configureStore } from '@reduxjs/toolkit';
import publicReducer from './features/PublicSlice';

export const store = configureStore({
  reducer: {
    public: publicReducer,
  },
});