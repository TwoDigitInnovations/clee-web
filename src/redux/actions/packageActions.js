import { Api } from "@/services/service";
import { setPackages, setLoading } from "../slices/packagesSlice";

export const fetchPackages = (router) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const res = await Api("get", "packages", "", router);
    if (res?.status === true) {
      dispatch(setPackages(res.data?.data?.packages || []));
    }
    dispatch(setLoading(false));
  } catch (error) {
    dispatch(setLoading(false));
    console.error("Error fetching packages:", error);
  }
};
