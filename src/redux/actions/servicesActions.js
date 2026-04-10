import { Api } from "@/services/service";
import {
  setServices,
  setLoading,
  addService,
  updateServiceItem,
  removeService,
} from "../slices/servicesSlice";


export const fetchServices = (router) => async (dispatch) => {
  try {
    dispatch(setLoading(true));

    const res = await Api("get", "services/getAll", "", router);

    if (res?.status) {
      const data = Array.isArray(res.data)
        ? res.data
        : res.data?.data || [];

      dispatch(setServices(data));
    }

    dispatch(setLoading(false));
    return { success: true };
  } catch (err) {
    dispatch(setLoading(false));
    throw err;
  }
};


export const fetchServiceById = (id, router) => async () => {
  try {
    const res = await Api("get", `services/${id}`, "", router);
    return res;
  } catch (err) {
    throw err;
  }
};


export const createService = (payload, router) => async (dispatch) => {
  try {
    const res = await Api("post", "services/create", payload, router);

    if (res?.status) {
      dispatch(addService(res.data));
      return { success: true, message: res.message };
    }

    return { success: false, message: res.message };
  } catch (err) {
    throw err;
  }
};


export const updateService = (id, payload, router) => async (dispatch) => {
  try {
    const res = await Api("put", `services/update/${id}`, payload, router);

    if (res?.status) {
      dispatch(updateServiceItem(res.data));
      return { success: true, message: res.message };
    }

    return { success: false, message: res.message };
  } catch (err) {
    throw err;
  }
};

export const deleteService = (id, router) => async (dispatch) => {
  try {
    const res = await Api("delete", `services/delete/${id}`, "", router);

    if (res?.status) {
      dispatch(removeService(id));
      return { success: true, message: res.message };
    }

    return { success: false, message: res.message };
  } catch (err) {
    throw err;
  }
};
