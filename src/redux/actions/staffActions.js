import { Api } from "@/services/service";
import {
  setStaff,
  setStaffStats,
  setCurrentStaff,
  setLoading,
  setError,
  addStaff,
  updateStaffItem,
  removeStaff,
} from "../slices/staffSlice";

// ✅ GET ALL STAFF
export const fetchStaff = (router) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    dispatch(setError(null));

    const res = await Api("get", "staff/getAll", "", router);

    if (res?.status) {
      const data = Array.isArray(res.data) ? res.data : res.data?.data || [];

      dispatch(setStaff(data));
    } else {
      dispatch(setError(res?.message));
    }

    dispatch(setLoading(false));
  } catch (err) {
    dispatch(setLoading(false));
    dispatch(setError(err.message));
    throw err;
  }
};

// ✅ GET STAFF BY ID
export const fetchStaffById = (id, router) => async (dispatch) => {
  try {
    dispatch(setLoading(true));

    const res = await Api("get", `staff/${id}`, "", router);

    if (res?.status) {
      dispatch(setCurrentStaff(res.data?.data));
    }

    dispatch(setLoading(false));
    return res;
  } catch (err) {
    dispatch(setLoading(false));
    throw err;
  }
};

// ✅ CREATE / UPDATE STAFF
export const saveStaff = (id, payload, router) => async (dispatch) => {
  try {
    const method = id ? "put" : "post";
    const url = id ? `staff/update/${id}` : "staff/create";

    const res = await Api(method, url, payload, router);

    if (res?.status) {
      if (id) {
        dispatch(updateStaffItem(res.data));
      } else {
        dispatch(addStaff(res.data));
      }

      return {
        success: true,
        message: id ? "Staff updated" : "Staff created",
      };
    }

    return { success: false, message: res?.message };
  } catch (err) {
    throw err;
  }
};


export const deleteStaff = (id, router) => async (dispatch) => {
  try {
    const res = await Api("delete", `staff/delete/${id}`, "", router);

    if (res?.status) {
      dispatch(removeStaff(id));
      return { success: true, message: res.message };
    }

    return { success: false, message: res.message };
  } catch (err) {
    throw err;
  }
};

export const fetchStaffStats = (router) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    dispatch(setError(null));

    const res = await Api("get", "staff/stats", "", router);

    if (res?.status) {
      const data = Array.isArray(res.data) ? res.data : res.data?.data || [];

      dispatch(setStaffStats(data));
    } else {
      dispatch(setError(res?.message));
    }

    dispatch(setLoading(false));
  } catch (err) {
    dispatch(setLoading(false));
    dispatch(setError(err.message));
    throw err;
  }
};
