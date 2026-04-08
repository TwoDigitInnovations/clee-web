import { createAsyncThunk } from '@reduxjs/toolkit';
import { Api } from '@/services/service';


export const getCalendarSettings = createAsyncThunk(
  'calendarSettings/get',
  async (_, { rejectWithValue }) => {
    try {
      const response = await Api('get', 'calendar-settings');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


export const updateCalendarSettings = createAsyncThunk(
  'calendarSettings/update',
  async (settings, { rejectWithValue }) => {
    try {
      const response = await Api('put', 'calendar-settings', settings);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


export const addCancellationReason = createAsyncThunk(
  'calendarSettings/addCancellationReason',
  async (reason, { rejectWithValue }) => {
    try {
      const response = await Api('post', 'calendar-settings/cancellation-reason', { reason });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


export const removeCancellationReason = createAsyncThunk(
  'calendarSettings/removeCancellationReason',
  async (reason, { rejectWithValue }) => {
    try {
      const response = await Api('delete', 'calendar-settings/cancellation-reason', { reason });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


export const addAppointmentStatus = createAsyncThunk(
  'calendarSettings/addAppointmentStatus',
  async (status, { rejectWithValue }) => {
    try {
      const response = await Api('post', 'calendar-settings/appointment-status', status);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Update appointment status
export const updateAppointmentStatus = createAsyncThunk(
  'calendarSettings/updateAppointmentStatus',
  async ({ statusId, data }, { rejectWithValue }) => {
    try {
      const response = await Api('put', `calendar-settings/appointment-status/${statusId}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Remove appointment status
export const removeAppointmentStatus = createAsyncThunk(
  'calendarSettings/removeAppointmentStatus',
  async (statusId, { rejectWithValue }) => {
    try {
      const response = await Api('delete', `calendar-settings/appointment-status/${statusId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
