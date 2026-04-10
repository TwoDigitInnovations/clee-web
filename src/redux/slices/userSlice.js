import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  users: [],
  currentUser: null,
  loading: false,
  error: null,
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

    setUsers: (state, action) => {
      state.users = action.payload;
    },

    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
    },

    logoutUser: (state) => {
      state.user = null;

      if (typeof window !== "undefined") {
        localStorage.removeItem("userDetail");
      }
    },

    addCustomer: (state, action) => {
      state.users.push(action.payload);
    },

    updateCustomer: (state, action) => {
      const index = state.users.findIndex((u) => u._id === action.payload._id);
      if (index !== -1) {
        state.users[index] = action.payload;
      }
    },

    deleteCustomer: (state, action) => {
      state.users = state.users.filter((u) => u._id !== action.payload);
    },
  },
});

export const {
  setUser,
  setUsers,
  setCurrentUser,
  setLoading,
  setError,
  logoutUser,
  addCustomer,
  updateCustomer,
  deleteCustomer,
} = userSlice.actions;

export default userSlice.reducer;
