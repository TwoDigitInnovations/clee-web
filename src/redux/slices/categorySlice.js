import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  categories: [],
  currentCategory: null,
  loading: false,
  error: null,
};

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    setCategories: (state, action) => {
      state.categories = action.payload;
    },

    setCurrentCategory: (state, action) => {
      state.currentCategory = action.payload;
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
    },

    addCategory: (state, action) => {
      state.categories.push(action.payload);
    },

    updateCategoryItem: (state, action) => {
      const index = state.categories.findIndex(
        (c) => c._id === action.payload._id
      );
      if (index !== -1) {
        state.categories[index] = action.payload;
      }
    },

    deleteCategoryItem: (state, action) => {
      state.categories = state.categories.filter(
        (c) => c._id !== action.payload
      );
    },
  },
});

export const {
  setCategories,
  setCurrentCategory,
  setLoading,
  setError,
  addCategory,
  updateCategoryItem,
  deleteCategoryItem,
} = categorySlice.actions;

export default categorySlice.reducer;
