import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  services: [],
  loading: false,
};

const servicesSlice = createSlice({
  name: "services",
  initialState,
  reducers: {
    setServices: (state, action) => {
      state.services = action.payload;
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    addService: (state, action) => {
      state.services.push(action.payload);
    },

    updateServiceItem: (state, action) => {
      const index = state.services.findIndex(
        (s) => s._id === action.payload._id
      );
      if (index !== -1) {
        state.services[index] = action.payload;
      }
    },

    removeService: (state, action) => {
      state.services = state.services.filter(
        (s) => s._id !== action.payload
      );
    },
  },
});

export const {
  setServices,
  setLoading,
  addService,
  updateServiceItem,
  removeService,
} = servicesSlice.actions;

export default servicesSlice.reducer;
