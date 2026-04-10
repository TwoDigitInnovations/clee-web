import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  closedDates: [],
  currentClosedDate: null,
  loading: false,
};

const closedDatesSlice = createSlice({
  name: "closedDates",
  initialState,
  reducers: {
    setClosedDates: (state, action) => {
      state.closedDates = action.payload;
    },

    setCurrentClosedDate: (state, action) => {
      state.currentClosedDate = action.payload;
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    addClosedDate: (state, action) => {
      state.closedDates.push(action.payload);
    },

    updateClosedDateItem: (state, action) => {
      const index = state.closedDates.findIndex(
        (item) => item._id === action.payload._id
      );
      if (index !== -1) {
        state.closedDates[index] = action.payload;
      }
    },

    removeClosedDate: (state, action) => {
      state.closedDates = state.closedDates.filter(
        (item) => item._id !== action.payload
      );
    },
  },
});

export const {
  setClosedDates,
  setCurrentClosedDate,
  setLoading,
  addClosedDate,
  updateClosedDateItem,
  removeClosedDate,
} = closedDatesSlice.actions;

export default closedDatesSlice.reducer;
