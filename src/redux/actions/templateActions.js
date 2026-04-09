import { Api } from "@/services/service";
import { setTemplates, setLoading } from "../slices/templateSlice";
import {
  removeTemplate,
  addTemplate,
  updateTemplateItem,
} from "../slices/templateSlice";

export const fetchTemplates = (router) => async (dispatch) => {
  try {
    dispatch(setLoading(true));

    const res = await Api("get", "template/getAll", "", router);

    if (res?.status) {
      const data = Array.isArray(res.data) ? res.data : res.data?.data || [];

      dispatch(setTemplates(data));
    }

    dispatch(setLoading(false));
    return { success: true, data: res.data };
  } catch (err) {
    dispatch(setLoading(false));
    throw err;
  }
};

export const createTemplate = (payload, router) => async (dispatch) => {
  try {
    const res = await Api("post", "template/create", payload, router);

    if (res?.status) {
      return {
        success: true,
        data: res.data,
        message: res.message,
      };
    }

    return { success: false, message: res.message };
  } catch (err) {
    throw err;
  }
};

export const saveTemplate = (id, payload, router) => async (dispatch) => {
  try {
    const method = id ? "put" : "post";
    const url = id ? `template/update/${id}` : "template/create";

    const res = await Api(method, url, payload, router);

    if (res?.status) {
      // ✅ Redux update
      if (id) {
        dispatch(updateTemplateItem(res.data));
      } else {
        dispatch(addTemplate(res.data));
      }

      return {
        success: true,
        data: res.data,
        message: id ? "Template updated" : "Template created",
      };
    }

    return { success: false, message: res?.message };
  } catch (err) {
    throw err;
  }
};

export const updateTemplate = (id, payload, router) => async (dispatch) => {
  try {
    const res = await Api("put", `template/update/${id}`, payload, router);

    if (res?.status) {
      return {
        success: true,
        data: res.data,
        message: res.message,
      };
    }

    return { success: false, message: res.message };
  } catch (err) {
    throw err;
  }
};

export const deleteTemplate = (id, router) => async (dispatch) => {
  try {
    const res = await Api("delete", `template/delete/${id}`, "", router);

    if (res?.status) {
      dispatch(removeTemplate(id)); // ✅ THIS LINE IMPORTANT
      return { success: true, message: res.message };
    }

    return { success: false, message: res.message };
  } catch (err) {
    throw err;
  }
};
