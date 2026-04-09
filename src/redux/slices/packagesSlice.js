import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  packages: [],
  loading: false,
};

const packagesSlice = createSlice({
  name: "packages",
  initialState,
  reducers: {
    setPackages: (state, action) => {
      state.packages = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setPackages, setLoading } = packagesSlice.actions;
export default packagesSlice.reducer;
