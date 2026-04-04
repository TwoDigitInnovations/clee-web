import { createSlice } from '@reduxjs/toolkit';
import {
  getCalendarSettings,
  updateCalendarSettings,
  addCancellationReason,
  removeCancellationReason,
  addAppointmentStatus,
  updateAppointmentStatus,
  removeAppointmentStatus,
} from '../actions/calendarSettingsActions';

const initialState = {
  settings: null,
  loading: false,
  error: null,
};

const calendarSettingsSlice = createSlice({
  name: 'calendarSettings',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Get calendar settings
    builder
      .addCase(getCalendarSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCalendarSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.settings = action.payload;
      })
      .addCase(getCalendarSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update calendar settings
    builder
      .addCase(updateCalendarSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCalendarSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.settings = action.payload;
      })
      .addCase(updateCalendarSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Add cancellation reason
    builder
      .addCase(addCancellationReason.fulfilled, (state, action) => {
        state.settings = action.payload;
      });

    // Remove cancellation reason
    builder
      .addCase(removeCancellationReason.fulfilled, (state, action) => {
        state.settings = action.payload;
      });

    // Add appointment status
    builder
      .addCase(addAppointmentStatus.fulfilled, (state, action) => {
        state.settings = action.payload;
      });

    // Update appointment status
    builder
      .addCase(updateAppointmentStatus.fulfilled, (state, action) => {
        state.settings = action.payload;
      });

    // Remove appointment status
    builder
      .addCase(removeAppointmentStatus.fulfilled, (state, action) => {
        state.settings = action.payload;
      });
  },
});

export const { clearError } = calendarSettingsSlice.actions;
export default calendarSettingsSlice.reducer;
