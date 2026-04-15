import { Api } from "@/services/service";
import {
  setGiftVouchers,
  setCurrentGiftVoucher,
  addGiftVoucher,
  updateGiftVoucherItem,
  removeGiftVoucher,
  setLoading,
  setError,
} from "../slices/giftVoucherSlice";

// ✅ GET ALL
export const fetchGiftVouchers = (router) => async (dispatch) => {
  try {
    dispatch(setLoading(true));

    const res = await Api("get", "gift-vouchers/getAll", "", router);

    if (res?.status) {
      dispatch(setGiftVouchers(res.data?.data || []));
    }

    dispatch(setLoading(false));
  } catch (err) {
    dispatch(setLoading(false));
    dispatch(setError(err.message));
  }
};

// ✅ GET BY ID
export const fetchGiftVoucherById = (id, router) => async (dispatch) => {
  try {
    dispatch(setLoading(true));

    const res = await Api("get", `gift-vouchers/${id}`, "", router);

    if (res?.status) {
      dispatch(setCurrentGiftVoucher(res.data?.data));
    }

    dispatch(setLoading(false));
  } catch (err) {
    dispatch(setLoading(false));
    dispatch(setError(err.message));
  }
};

// ✅ CREATE
export const createGiftVoucher = (data, router) => async (dispatch) => {
  try {
    const res = await Api("post", "gift-vouchers/create", data, router);

    if (res?.status) {
      dispatch(addGiftVoucher(res.data));
      return { success: true, message: res.message };
    }

    return { success: false, message: res.message };
  } catch (err) {
    throw err;
  }
};

// ✅ UPDATE
export const updateGiftVoucher = (id, data, router) => async (dispatch) => {
  try {
    const res = await Api("put", `gift-vouchers/update/${id}`, data, router);

    if (res?.status) {
      dispatch(updateGiftVoucherItem(res.data));
      return { success: true, message: res.message };
    }

    return { success: false, message: res.message };
  } catch (err) {
    throw err;
  }
};

// ✅ DELETE
export const deleteGiftVoucher = (id, router) => async (dispatch) => {
  try {
    const res = await Api("delete", `gift-vouchers/delete/${id}`, "", router);

    if (res?.status) {
      dispatch(removeGiftVoucher(id));
      return { success: true, message: res.message };
    }

    return { success: false, message: res.message };
  } catch (err) {
    throw err;
  }
};
