import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  staffStats: [],
  loading: false,
  error: null,
};

const staffSlice = createSlice({
  name: 'staff',
  initialState,
  reducers: {
    setStaffStats: (state, action) => {
      state.staffStats = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setStaffStats, setLoading, setError } = staffSlice.actions;
export default staffSlice.reducer;
