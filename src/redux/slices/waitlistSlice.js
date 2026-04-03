import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  waitlist: [],
  loading: false,
};

const waitlistSlice = createSlice({
  name: "waitlist",
  initialState,
  reducers: {
    setWaitlist: (state, action) => {
      state.waitlist = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    addToWaitlist: (state, action) => {
      state.waitlist.push(action.payload);
    },
    updateWaitlistItem: (state, action) => {
      const index = state.waitlist.findIndex(
        (w) => w._id === action.payload._id
      );
      if (index !== -1) {
        state.waitlist[index] = action.payload;
      }
    },
    removeFromWaitlist: (state, action) => {
      state.waitlist = state.waitlist.filter((w) => w._id !== action.payload);
    },
  },
});

export const {
  setWaitlist,
  setLoading,
  addToWaitlist,
  updateWaitlistItem,
  removeFromWaitlist,
} = waitlistSlice.actions;

export default waitlistSlice.reducer;
