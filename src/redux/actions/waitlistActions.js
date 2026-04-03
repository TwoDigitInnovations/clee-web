import { Api } from "@/services/service";
import { setWaitlist, setLoading } from "../slices/waitlistSlice";

export const fetchWaitlist = (router) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const res = await Api("get", "waitlist/getAll", "", router);
    if (res?.status) {
      const waitlistData = Array.isArray(res.data) ? res.data : res.data?.data || [];
      dispatch(setWaitlist(waitlistData));
    }
    dispatch(setLoading(false));
    return { success: true, data: res.data };
  } catch (err) {
    dispatch(setLoading(false));
    throw err;
  }
};

export const createWaitlist = (waitlistData, router) => async (dispatch) => {
  try {
    const res = await Api("post", "waitlist/create", waitlistData, router);
    if (res?.status) {
      return { success: true, data: res.data, message: res.message };
    }
    return { success: false, message: res.message };
  } catch (err) {
    throw err;
  }
};

export const updateWaitlist = (id, waitlistData, router) => async (dispatch) => {
  try {
    const res = await Api("put", `waitlist/update/${id}`, waitlistData, router);
    if (res?.status) {
      return { success: true, data: res.data, message: res.message };
    }
    return { success: false, message: res.message };
  } catch (err) {
    throw err;
  }
};

export const deleteWaitlist = (id, router) => async (dispatch) => {
  try {
    const res = await Api("delete", `waitlist/delete/${id}`, "", router);
    if (res?.status) {
      return { success: true, message: res.message };
    }
    return { success: false, message: res.message };
  } catch (err) {
    throw err;
  }
};
