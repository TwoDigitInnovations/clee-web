import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  templates: [],
  loading: false,
  currentTemplate : null,
};

const templateSlice = createSlice({
  name: "template",
  initialState,
  reducers: {
    setTemplates: (state, action) => {
      state.templates = action.payload;
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    addTemplate: (state, action) => {
      state.templates.push(action.payload);
    },

    updateTemplateItem: (state, action) => {
      const index = state.templates.findIndex(
        (t) => t._id === action.payload._id,
      );

      if (index !== -1) {
        state.templates[index] = action.payload;
      }
    },

    removeTemplate: (state, action) => {
      state.templates = state.templates.filter((t) => t._id !== action.payload);
    },
    setCurrentTemplate: (state, action) => {
      state.currentTemplate = action.payload;
    },
  },
});

export const {
  setTemplates,
  setLoading,
  addTemplate,
  updateTemplateItem,
  removeTemplate,
  setCurrentTemplate,
} = templateSlice.actions;

export default templateSlice.reducer;
