import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  giftVouchers: [],
  currentGiftVoucher: null,
  loading: false,
  error: null,
};

const giftVoucherSlice = createSlice({
  name: "giftVoucher",
  initialState,
  reducers: {
    setGiftVouchers: (state, action) => {
      state.giftVouchers = action.payload;
    },
    setCurrentGiftVoucher: (state, action) => {
      state.currentGiftVoucher = action.payload;
    },
    addGiftVoucher: (state, action) => {
      state.giftVouchers.unshift(action.payload);
    },
    updateGiftVoucherItem: (state, action) => {
      const index = state.giftVouchers.findIndex(
        (item) => item._id === action.payload._id,
      );
      if (index !== -1) {
        state.giftVouchers[index] = action.payload;
      }
    },
    removeGiftVoucher: (state, action) => {
      state.giftVouchers = state.giftVouchers.filter(
        (item) => item._id !== action.payload,
      );
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setGiftVouchers,
  setCurrentGiftVoucher,
  addGiftVoucher,
  updateGiftVoucherItem,
  removeGiftVoucher,
  setLoading,
  setError,
} = giftVoucherSlice.actions;

export default giftVoucherSlice.reducer;
