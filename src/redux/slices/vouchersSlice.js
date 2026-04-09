import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  vouchers: [],
  loading: false,
};

const vouchersSlice = createSlice({
  name: "vouchers",
  initialState,
  reducers: {
    setVouchers: (state, action) => {
      state.vouchers = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setVouchers, setLoading } = vouchersSlice.actions;
export default vouchersSlice.reducer;
