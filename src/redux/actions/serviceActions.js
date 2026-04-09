import { Api } from "@/services/service";
import { setServices, setLoading } from "../slices/servicesSlice";

export const fetchServices = (router) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const res = await Api("get", "services/getAll", "", router);
    console.log("Services API Response:", res);
    if (res?.data?.data) {
      dispatch(setServices(res.data.data));
    }
    dispatch(setLoading(false));
  } catch (error) {
    dispatch(setLoading(false));
    console.error("Error fetching services:", error);
  }
};
