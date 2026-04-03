import { Api } from "@/services/service";
import { setBookings, setUpcomingBookings, setLoading } from "../slices/bookingSlice";

export const fetchBookings = (date, router) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const dateStr = date.toISOString().split('T')[0];
    const res = await Api("get", `booking/getAll?date=${dateStr}`, "", router);
    if (res?.status) {
      const bookingsData = Array.isArray(res.data) ? res.data : res.data?.data || [];
      dispatch(setBookings(bookingsData));
    }
    dispatch(setLoading(false));
    return { success: true, data: res.data };
  } catch (err) {
    dispatch(setLoading(false));
    throw err;
  }
};

export const fetchUpcomingBookings = (router) => async (dispatch) => {
  try {
    const res = await Api("get", "booking/upcoming", "", router);
    if (res?.status) {
      const upcomingData = Array.isArray(res.data) ? res.data : res.data?.data || [];
      dispatch(setUpcomingBookings(upcomingData));
    }
    return { success: true, data: res.data };
  } catch (err) {
    throw err;
  }
};

export const createBooking = (bookingData, router) => async (dispatch) => {
  try {
    const res = await Api("post", "booking/create", bookingData, router);
    if (res?.status) {
      return { success: true, data: res.data, message: res.message };
    }
    return { success: false, message: res.message };
  } catch (err) {
    throw err;
  }
};

export const updateBooking = (id, bookingData, router) => async (dispatch) => {
  try {
    const res = await Api("put", `booking/update/${id}`, bookingData, router);
    if (res?.status) {
      return { success: true, data: res.data, message: res.message };
    }
    return { success: false, message: res.message };
  } catch (err) {
    throw err;
  }
};

export const deleteBooking = (id, router) => async (dispatch) => {
  try {
    const res = await Api("delete", `booking/delete/${id}`, "", router);
    if (res?.status) {
      return { success: true, message: res.message };
    }
    return { success: false, message: res.message };
  } catch (err) {
    throw err;
  }
};

export const getBookingById = (id, router) => async (dispatch) => {
  try {
    const res = await Api("get", `booking/${id}`, "", router);
    if (res?.status) {
      return { success: true, data: res.data };
    }
    return { success: false, message: res.message };
  } catch (err) {
    throw err;
  }
};

export const fetchPendingBookings = (router) => async (dispatch) => {
  try {
    const res = await Api("get", "booking/getAll?status=Pending", "", router);
    if (res?.status) {
      const bookingsData = Array.isArray(res.data)
        ? res.data
        : res.data?.data || [];
      return { success: true, data: bookingsData };
    }
    return { success: false, data: [] };
  } catch (err) {
    throw err;
  }
};

export const approveBooking = (id, router) => async (dispatch) => {
  try {
    const res = await Api("put", `booking/approve/${id}`, {}, router);
    if (res?.status) {
      return { success: true, message: res.message };
    }
    return { success: false, message: res.message };
  } catch (err) {
    throw err;
  }
};

export const declineBooking = (id, router) => async (dispatch) => {
  try {
    const res = await Api("put", `booking/decline/${id}`, {}, router);
    if (res?.status) {
      return { success: true, message: res.message };
    }
    return { success: false, message: res.message };
  } catch (err) {
    throw err;
  }
};
