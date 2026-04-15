import { Api } from "@/services/service";
import {
  setPromoCodes,
  setCurrentPromoCode,
  addPromoCode,
  updatePromoCodeItem,
  removePromoCode,
  togglePromoStatus,
  setLoading,
  setError,
} from "../slices/PromoCodeSlice";

// ✅ GET ALL
export const fetchPromoCodes = (router) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const res = await Api("get", "promo-codes", "", router);

    if (res?.status) {
      dispatch(setPromoCodes(res.data?.data || []));
    }

    dispatch(setLoading(false));
  } catch (err) {
    dispatch(setLoading(false));
    dispatch(setError(err.message));
  }
};

// ✅ GET BY ID
export const fetchPromoCodeById = (id, router) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const res = await Api("get", `promo-codes/${id}`, "", router);

    if (res?.status) {
        console.log(res.data.data);
        
      dispatch(setCurrentPromoCode(res.data.data));
    }

    dispatch(setLoading(false));
  } catch (err) {
    dispatch(setLoading(false));
    dispatch(setError(err.message));
  }
};

// ✅ CREATE
export const createPromoCode = (data, router) => async (dispatch) => {
  try {
    const res = await Api("post", "promo-codes", data, router);

    if (res?.status) {
      dispatch(addPromoCode(res.data));
      return { success: true, message: res.message };
    }

    return { success: false, message: res.message };
  } catch (err) {
    throw err;
  }
};

// ✅ UPDATE
export const updatePromoCode = (id, data, router) => async (dispatch) => {
  try {
    const res = await Api("put", `promo-codes/${id}`, data, router);

    if (res?.status) {
      dispatch(updatePromoCodeItem(res.data));
      return { success: true, message: res.message };
    }

    return { success: false, message: res.message };
  } catch (err) {
    throw err;
  }
};

// ✅ DELETE
export const deletePromoCode = (id, router) => async (dispatch) => {
  try {
    const res = await Api("delete", `promo-codes/${id}`, "", router);

    if (res?.status) {
      dispatch(removePromoCode(id));
      return { success: true, message: res.message };
    }

    return { success: false, message: res.message };
  } catch (err) {
    throw err;
  }
};

// ✅ TOGGLE STATUS
export const togglePromoCodeStatus = (id, router) => async (dispatch) => {
  try {
    const res = await Api("patch", `promo-codes/${id}/toggle-status`, "", router);

    if (res?.status) {
      dispatch(togglePromoStatus(id));
      return { success: true, message: res.message };
    }

    return { success: false, message: res.message };
  } catch (err) {
    throw err;
  }
};


export const validatePromoCode = (data, router) => async () => {
  try {
    const res = await Api("post", "promo-codes/validate", data, router);
    return res;
  } catch (err) {
    throw err;
  }
};
