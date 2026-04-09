import { Api } from "@/services/service";
import {
  setAutomationRules,
  setLoading,
  addAutomationRule,
  updateAutomationRuleItem,
  removeAutomationRule,
} from "../slices/automationSlice";

// ✅ GET ALL
export const fetchAutomationRules = (router) => async (dispatch) => {
  try {
    dispatch(setLoading(true));

    const res = await Api("get", "automation/getAll", "", router);

    if (res?.status) {
      const data = Array.isArray(res.data)
        ? res.data
        : res.data?.data || [];

      dispatch(setAutomationRules(data));
    }

    dispatch(setLoading(false));
    return { success: true, data: res.data };
  } catch (err) {
    dispatch(setLoading(false));
    throw err;
  }
};

// ✅ CREATE / UPDATE (single API handler)
export const saveAutomationRule =
  (id, payload, router) => async (dispatch) => {
    try {
      const method = id ? "put" : "post";
      const url = id
        ? `automation/update/${id}`
        : "automation/create";

      const res = await Api(method, url, payload, router);

      if (res?.status) {
        if (id) {
          dispatch(updateAutomationRuleItem(res.data));
        } else {
          dispatch(addAutomationRule(res.data));
        }

        return {
          success: true,
          data: res.data,
          message: id
            ? "Rule updated successfully"
            : "Rule created successfully",
        };
      }

      return { success: false, message: res.message };
    } catch (err) {
      throw err;
    }
  };

// ✅ DELETE
export const deleteAutomationRule =
  (id, router) => async (dispatch) => {
    try {
      const res = await Api(
        "delete",
        `automation/delete/${id}`,
        "",
        router
      );

      if (res?.status) {
        dispatch(removeAutomationRule(id)); // ✅ instant UI update
        return { success: true, message: res.message };
      }

      return { success: false, message: res.message };
    } catch (err) {
      throw err;
    }
  };


  export const fetchAutomationById = (id, router) => async (dispatch) => {
  if (!id) return;

  try {
    dispatch(setLoading(true));

    const res = await Api("get", `automation/${id}`, "", router);

    if (res?.status) {
      dispatch(setCurrentAutomationRule(res.data.data));
      return { success: true, data: res.data.data };
    }

    return { success: false, message: res.message };
  } catch (err) {
    throw err;
  } finally {
    dispatch(setLoading(false));
  }
};
