import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  templates: [],
  settings: null,
  loading: false,
  error: null
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setTemplates: (state, action) => {
      state.templates = action.payload;
    },
    setSettings: (state, action) => {
      state.settings = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    addTemplate: (state, action) => {
      state.templates.push(action.payload);
    },
    updateTemplateInState: (state, action) => {
      const index = state.templates.findIndex(t => t._id === action.payload._id);
      if (index !== -1) {
        state.templates[index] = action.payload;
      }
    },
    removeTemplate: (state, action) => {
      state.templates = state.templates.filter(t => t._id !== action.payload);
    }
  }
});

export const {
  setTemplates,
  setSettings,
  setLoading,
  setError,
  addTemplate,
  updateTemplateInState,
  removeTemplate
} = notificationSlice.actions;

export default notificationSlice.reducer;
