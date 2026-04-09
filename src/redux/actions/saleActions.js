import { Api } from "@/services/service";

export const createSale = (saleData, router) => async (dispatch) => {
  try {
    const res = await Api("post", "sales", saleData, router);
    return res;
  } catch (error) {
    console.error("Error creating sale:", error);
    throw error;
  }
};
