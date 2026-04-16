import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  promoCodes: [],
  currentPromoCode: null,
  loading: false,
  error: null,
};

const promoCodeSlice = createSlice({
  name: "promoCode",
  initialState,
  reducers: {
    setPromoCodes: (state, action) => {
      state.promoCodes = action.payload;
    },
    setCurrentPromoCode: (state, action) => {
      state.currentPromoCode = action.payload;
    },
    addPromoCode: (state, action) => {
      state.promoCodes.unshift(action.payload);
    },
    updatePromoCodeItem: (state, action) => {
      const index = state.promoCodes.findIndex(
        (p) => p._id === action.payload._id,
      );
      if (index !== -1) {
        state.promoCodes[index] = action.payload;
      }
    },
    removePromoCode: (state, action) => {
      state.promoCodes = state.promoCodes?.filter(
        (p) => p._id !== action.payload,
      );
    },
    togglePromoStatus: (state, action) => {
      const item = state.promoCodes.find((p) => p._id === action.payload);
      if (item) {
        item.status = item.status === "active" ? "inactive" : "active";
      }
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
  setPromoCodes,
  setCurrentPromoCode,
  addPromoCode,
  updatePromoCodeItem,
  removePromoCode,
  togglePromoStatus,
  setLoading,
  setError,
} = promoCodeSlice.actions;

export default promoCodeSlice.reducer;
