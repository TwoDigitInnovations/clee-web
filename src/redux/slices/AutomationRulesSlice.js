import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  automationRules: [],
  loading: false,
  currentRule: null, // ✅ add this
};

const automationSlice = createSlice({
  name: "automationRules",
  initialState,
  reducers: {
    setAutomationRules: (state, action) => {
      state.automationRules = action.payload;
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    addAutomationRule: (state, action) => {
      state.automationRules.push(action.payload);
    },

    updateAutomationRuleItem: (state, action) => {
      const index = state.automationRules.findIndex(
        (r) => r._id === action.payload._id,
      );

      if (index !== -1) {
        state.automationRules[index] = action.payload;
      }
    },

    removeAutomationRule: (state, action) => {
      state.automationRules = state.automationRules.filter(
        (r) => r._id !== action.payload,
      );
    },
    setCurrentAutomationRule: (state, action) => {
      state.currentRule = action.payload;
    },
  },
});

export const {
  setAutomationRules,
  setLoading,
  addAutomationRule,
  updateAutomationRuleItem,
  removeAutomationRule,
  setCurrentAutomationRule
} = automationSlice.actions;

export default automationSlice.reducer;
