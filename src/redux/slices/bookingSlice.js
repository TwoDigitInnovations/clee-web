import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  bookings: [],
  upcomingBookings: [],
  loading: false,
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    setBookings: (state, action) => {
      state.bookings = action.payload;
    },
    setUpcomingBookings: (state, action) => {
      state.upcomingBookings = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    addBooking: (state, action) => {
      state.bookings.push(action.payload);
    },
    updateBooking: (state, action) => {
      const index = state.bookings.findIndex(
        (b) => b._id === action.payload._id
      );
      if (index !== -1) {
        state.bookings[index] = action.payload;
      }
    },
    removeBooking: (state, action) => {
      state.bookings = state.bookings.filter((b) => b._id !== action.payload);
    },
  },
});

export const {
  setBookings,
  setUpcomingBookings,
  setLoading,
  addBooking,
  updateBooking,
  removeBooking,
} = bookingSlice.actions;

export default bookingSlice.reducer;
