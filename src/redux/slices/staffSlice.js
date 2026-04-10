import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  staff: [],
  staffStats: [],
  currentStaff: null,
  loading: false,
  error: null,
};

const staffSlice = createSlice({
  name: "staff",
  initialState,
  reducers: {
    setStaff: (state, action) => {
      state.staff = action.payload;
    },

    setStaffStats: (state, action) => {
      state.staffStats = action.payload;
    },

    setCurrentStaff: (state, action) => {
      state.currentStaff = action.payload;
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
    },

    addStaff: (state, action) => {
      state.staff.push(action.payload);
    },

    updateStaffItem: (state, action) => {
      const index = state.staff.findIndex(
        (s) => s._id === action.payload._id
      );
      if (index !== -1) {
        state.staff[index] = action.payload;
      }
    },

    removeStaff: (state, action) => {
      state.staff = state.staff.filter(
        (s) => s._id !== action.payload
      );
    },
  },
});

export const {
  setStaff,
  setStaffStats,
  setCurrentStaff,
  setLoading,
  setError,
  addStaff,
  updateStaffItem,
  removeStaff,
} = staffSlice.actions;

export default staffSlice.reducer;
