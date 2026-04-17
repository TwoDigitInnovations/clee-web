import { Api, ApiFormData } from "@/services/service";
import {
  setUser,
  setUsers,
  setCurrentUser,
  setLoading,
  setError,
  addCustomer,
  updateCustomer,
  deleteCustomer,
} from "../slices/userSlice";

export const loginUser = (data, router) => async (dispatch) => {
  try {
    dispatch(setLoading(true));

    const res = await Api("post", "auth/login", data, router);

    if (res?.status) {
      localStorage.setItem("token", res.data.token);

      dispatch(setUser(res.data.user));
      router.push("/");
      return { success: true };
    } else {
      dispatch(setError(res?.message));
    }

    dispatch(setLoading(false));
  } catch (err) {
    dispatch(setLoading(false));
    throw err;
  }
};

export const registerUser = (data, router) => async (dispatch) => {
  try {
    dispatch(setLoading(true));

    const res = await Api("post", "auth/register", data, router);

    dispatch(setLoading(false));
    return res;
  } catch (err) {
    dispatch(setLoading(false));
    throw err;
  }
};

export const fetchProfile = (router) => async (dispatch) => {
  try {
    dispatch(setLoading(true));

    const res = await Api("get", "auth/profile", "", router);

    if (res?.status) {
      dispatch(setUser(res.data));
    }

    dispatch(setLoading(false));
  } catch (err) {
    dispatch(setLoading(false));
  }
};

export const updateProfile = (data, router) => async (dispatch) => {
  try {
    dispatch(setLoading(true));

    const res = await Api("post", "auth/updateprofile", data, router);

    if (res?.status) {
      dispatch(setUser(res.data));
    }

    dispatch(setLoading(false));
    return res;
  } catch (err) {
    dispatch(setLoading(false));
    throw err;
  }
};

export const fetchUsers =
  (router, role = null) =>
  async (dispatch) => {
    try {
      dispatch(setLoading(true));

      const res = await Api("get", `auth/getAllUser?role=${role}`, "", router);

      if (res?.status) {
        dispatch(setUsers(res.data?.data || []));
        dispatch(setLoading(false));
        return res.data?.data || [];
      }

      dispatch(setLoading(false));
      return [];
    } catch (err) {
      dispatch(setLoading(false));
      return [];
    }
  };

export const fetchUserById = (id, router) => async (dispatch) => {
  try {
    dispatch(setLoading(true));

    const res = await Api("get", `auth/getUserInfo/${id}`, "", router);

    if (res?.status) {
      dispatch(setCurrentUser(res.data?.data));
    }

    dispatch(setLoading(false));
  } catch (err) {
    dispatch(setLoading(false));
  }
};

export const createCustomer = (data, router) => async (dispatch) => {
  try {
    const res = await ApiFormData("post", "auth/createCustomer", data, router);

    if (res?.status) {
      dispatch(addCustomer(res.data));
    }

    return res;
  } catch (err) {
    throw err;
  }
};

export const updateCustomerById = (id, data, router) => async (dispatch) => {
  try {
    const res = await ApiFormData(
      "post",
      `auth/updateCustomer/${id}`,
      data,
      router,
    );

    if (res?.status) {
      dispatch(updateCustomer(res.data));
    }

    return res;
  } catch (err) {
    throw err;
  }
};

export const deleteCustomerById = (id, router) => async (dispatch) => {
  try {
    const res = await Api("delete", `auth/deleteCustomer/${id}`, "", router);

    if (res?.status) {
      dispatch(deleteCustomer(id));
    }

    return res;
  } catch (err) {
    throw err;
  }
};

export const sendOTPAction = (data) => async () => {
  return await Api("post", "auth/sendOTP", data);
};

export const verifyOTPAction = (data) => async () => {
  return await Api("post", "auth/verifyOTP", data);
};

export const resendOTPAction = (data) => async () => {
  return await Api("post", "auth/resendOTP", data);
};

export const changePasswordAction = (data) => async () => {
  return await Api("post", "auth/changePassword", data);
};

export const updateUserStatus = (data, router) => async () => {
  return await Api("post", "auth/updateStatus", data, router);
};
