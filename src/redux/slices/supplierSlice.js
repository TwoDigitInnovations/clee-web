import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  suppliers: [],
  currentSupplier: null,
  loading: false,
  error: null,
  success: false,
};

const supplierSlice = createSlice({
  name: 'supplier',
  initialState,
  reducers: {
    setSuppliers: (state, action) => {
      state.suppliers = action.payload;
    },
    setCurrentSupplier: (state, action) => {
      state.currentSupplier = action.payload;
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
    clearCurrentSupplier: (state) => {
      state.currentSupplier = null;
    },
  },
});

export const {
  setSuppliers,
  setCurrentSupplier,
  setLoading,
  setError,
  setSuccess,
  clearError,
  clearSuccess,
  clearCurrentSupplier,
} = supplierSlice.actions;

export default supplierSlice.reducer;
