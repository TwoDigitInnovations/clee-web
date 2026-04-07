import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  stockOrders: [],
  currentStockOrder: null,
  supplierProducts: [],
  loading: false,
  error: null,
  success: false,
};

const stockOrderSlice = createSlice({
  name: 'stockOrder',
  initialState,
  reducers: {
    setStockOrders: (state, action) => {
      state.stockOrders = action.payload;
    },
    setCurrentStockOrder: (state, action) => {
      state.currentStockOrder = action.payload;
    },
    setSupplierProducts: (state, action) => {
      state.supplierProducts = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setSuccess: (state, action) => {
      state.success = action.payload;
      state.loading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
    clearCurrentStockOrder: (state) => {
      state.currentStockOrder = null;
    },
    clearSupplierProducts: (state) => {
      state.supplierProducts = [];
    },
  },
});

export const {
  setStockOrders,
  setCurrentStockOrder,
  setSupplierProducts,
  setLoading,
  setError,
  setSuccess,
  clearError,
  clearSuccess,
  clearCurrentStockOrder,
  clearSupplierProducts,
} = stockOrderSlice.actions;

export default stockOrderSlice.reducer;
