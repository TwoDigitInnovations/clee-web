import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;

      if (typeof window !== "undefined") {
        localStorage.setItem("userDetail", JSON.stringify(action.payload));
      }
    },
    logoutUser: (state) => {
      state.user = null;

      if (typeof window !== "undefined") {
        localStorage.removeItem("userDetail");
      }
    },
  },
});

export const { setUser, logoutUser } = userSlice.actions;
export default userSlice.reducer;
