import { Api } from "@/services/service";
import { setVouchers, setLoading } from "../slices/vouchersSlice";

export const fetchVouchers = (router) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const res = await Api("get", "gift-vouchers/getAll", "", router);
    if (res?.status === true) {
      dispatch(setVouchers(res.data.data || []));
    }
    dispatch(setLoading(false));
  } catch (error) {
    dispatch(setLoading(false));
    console.error("Error fetching vouchers:", error);
  }
};
