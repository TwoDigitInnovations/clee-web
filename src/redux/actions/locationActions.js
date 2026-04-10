import { Api } from "@/services/service";
import {
  setLocations,
  setCurrentLocation,
  setLoading,
  setError,
  addLocation,
  updateLocationItem,
  deleteLocationItem,
} from "../slices/locationSlice";

export const fetchLocations = (router) => async (dispatch) => {
  try {
    dispatch(setLoading(true));

    const res = await Api("get", "location/getAll", "", router);

    if (res?.status) {
      dispatch(setLocations(res.data?.data || []));
    } else {
      dispatch(setError(res?.message));
    }

    dispatch(setLoading(false));
  } catch (err) {
    dispatch(setLoading(false));
    dispatch(setError(err.message));
  }
};

export const fetchLocationById = (id, router) => async (dispatch) => {
  try {
    dispatch(setLoading(true));

    const res = await Api("get", `location/${id}`, "", router);

    if (res?.status) {
      dispatch(setCurrentLocation(res.data?.data));
    }

    dispatch(setLoading(false));
  } catch (err) {
    dispatch(setLoading(false));
  }
};

export const createLocation = (data, router) => async (dispatch) => {
  try {
    const res = await Api("post", "location/create", data, router);

    if (res?.status) {
      dispatch(addLocation(res.data));
    }

    return res;
  } catch (err) {
    throw err;
  }
};

export const updateLocation = (id, data, router) => async (dispatch) => {
  try {
    const res = await Api("put", `location/update/${id}`, data, router);

    if (res?.status) {
      dispatch(updateLocationItem(res.data));
    }

    return res;
  } catch (err) {
    throw err;
  }
};

export const deleteLocation = (id, router) => async (dispatch) => {
  try {
    const res = await Api("delete", `location/delete/${id}`, "", router);

    if (res?.status) {
      dispatch(deleteLocationItem(id));
    }

    return res;
  } catch (err) {
    throw err;
  }
};
