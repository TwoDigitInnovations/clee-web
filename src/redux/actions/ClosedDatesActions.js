import { Api } from "@/services/service";
import {
  setClosedDates,
  setCurrentClosedDate,
  setLoading,
  addClosedDate,
  updateClosedDateItem,
  removeClosedDate,
} from "../slices/closedDataSlice";

export const fetchClosedDates = (router) => async (dispatch) => {
  try {
    dispatch(setLoading(true));

    const res = await Api("get", "closed-date", "", router);

    if (res?.status) {
      const data = Array.isArray(res.data?.data)
        ? res.data.data
        : res.data?.data || [];
 
      dispatch(setClosedDates(data));
    }

    dispatch(setLoading(false));
  } catch (err) {
    dispatch(setLoading(false));
    throw err;
  }
};

// GET BY ID
export const fetchClosedDateById = (id, router) => async (dispatch) => {
  try {
    dispatch(setLoading(true));

    const res = await Api("get", `closed-date/${id}`, "", router);

    if (res?.status) {
      dispatch(setCurrentClosedDate(res.data?.data));
    }

    dispatch(setLoading(false));
    return res;
  } catch (err) {
    dispatch(setLoading(false));
    throw err;
  }
};

export const createClosedDate = (payload, router) => async (dispatch) => {
  try {
    const res = await Api("post", "closed-date/add", payload, router);

    if (res?.status) {
      dispatch(addClosedDate(res.data));
      return { success: true, message: res.message };
    }

    return { success: false, message: res.message };
  } catch (err) {
    throw err;
  }
};

export const updateClosedDate = (id, payload, router) => async (dispatch) => {
  try {
    const res = await Api("put", `closed-date/update/${id}`, payload, router);

    if (res?.status) {
      dispatch(updateClosedDateItem(res.data));
      return { success: true, message: res.message };
    }

    return { success: false, message: res.message };
  } catch (err) {
    throw err;
  }
};

export const deleteClosedDate = (id, router) => async (dispatch) => {
  try {
    const res = await Api("delete", `closed-date/delete/${id}`, "", router);

    if (res?.status) {
      dispatch(removeClosedDate(id));
      return { success: true, message: res.message };
    }

    return { success: false, message: res.message };
  } catch (err) {
    throw err;
  }
};
