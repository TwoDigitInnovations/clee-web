import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  locations: [],
  currentLocation: null,
  loading: false,
  error: null,
};

const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    setLocations: (state, action) => {
      state.locations = action.payload;
    },

    setCurrentLocation: (state, action) => {
      state.currentLocation = action.payload;
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
    },

    addLocation: (state, action) => {
      state.locations.push(action.payload);
    },

    updateLocationItem: (state, action) => {
      const index = state.locations.findIndex(
        (l) => l._id === action.payload._id
      );
      if (index !== -1) {
        state.locations[index] = action.payload;
      }
    },

    deleteLocationItem: (state, action) => {
      state.locations = state.locations.filter(
        (l) => l._id !== action.payload
      );
    },
  },
});

export const {
  setLocations,
  setCurrentLocation,
  setLoading,
  setError,
  addLocation,
  updateLocationItem,
  deleteLocationItem,
} = locationSlice.actions;

export default locationSlice.reducer;
