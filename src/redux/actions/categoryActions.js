import { Api } from "@/services/service";
import {
  setCategories,
  setCurrentCategory,
  setLoading,
  setError,
  addCategory,
  updateCategoryItem,
  deleteCategoryItem,
} from "../slices/categorySlice";


export const fetchCategories = (router) => async (dispatch) => {
  try {
    dispatch(setLoading(true));

    const res = await Api("get", "category/getAll", "", router);

    if (res?.status) {
      dispatch(setCategories(res.data?.data || []));
    } else {
      dispatch(setError(res?.message));
    }

    dispatch(setLoading(false));
  } catch (err) {
    dispatch(setLoading(false));
    dispatch(setError(err.message));
  }
};

// ✅ GET BY ID
export const fetchCategoryById = (id, router) => async (dispatch) => {
  try {
    dispatch(setLoading(true));

    const res = await Api("get", `category/${id}`, "", router);

    if (res?.status) {
      dispatch(setCurrentCategory(res.data?.data));
    }

    dispatch(setLoading(false));
  } catch (err) {
    dispatch(setLoading(false));
  }
};

// ✅ CREATE
export const createCategory = (data, router) => async (dispatch) => {
  try {
    const res = await Api("post", "category/create", data, router);

    if (res?.status) {
      dispatch(addCategory(res.data));
    }

    return res;
  } catch (err) {
    throw err;
  }
};

// ✅ UPDATE
export const updateCategory = (id, data, router) => async (dispatch) => {
  try {
    const res = await Api("put", `category/update/${id}`, data, router);

    if (res?.status) {
      dispatch(updateCategoryItem(res.data));
    }

    return res;
  } catch (err) {
    throw err;
  }
};


export const deleteCategory = (id, router) => async (dispatch) => {
  try {
    const res = await Api("delete", `category/delete/${id}`, "", router);

    if (res?.status) {
      dispatch(deleteCategoryItem(id));
    }

    return res;
  } catch (err) {
    throw err;
  }
};
