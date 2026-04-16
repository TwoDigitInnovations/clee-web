import { Api } from "@/services/service";
import { setProducts, setLoading } from "../slices/productSlice";

export const fetchProducts = (router) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const res = await Api("get", "products", "", router);
   
    if (res?.data?.data) {
      dispatch(setProducts(res.data.data));
    }
    dispatch(setLoading(false));
  } catch (error) {
    dispatch(setLoading(false));
    console.error("Error fetching products:", error);
  }
};


