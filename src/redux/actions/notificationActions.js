import { Api } from "@/services/service";
import {
  setTemplates,
  setSettings,
  setLoading,
  setError,
  addTemplate,
  updateTemplateInState,
  removeTemplate
} from "../slices/notificationSlice";

export const fetchTemplates = (router) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const res = await Api("get", "notifications/templates", "", router);
    const templatesData = Array.isArray(res) ? res : [];
    dispatch(setTemplates(templatesData));
    dispatch(setLoading(false));
    return { success: true, data: res };
  } catch (err) {
    dispatch(setLoading(false));
    dispatch(setError(err.message));
    throw err;
  }
};

export const getTemplateById = (id, router) => async (dispatch) => {
  try {
    const res = await Api("get", `notifications/templates/${id}`, "", router);
    return { success: true, data: res };
  } catch (err) {
    throw err;
  }
};

export const createTemplate = (templateData, router) => async (dispatch) => {
  try {
    const res = await Api("post", "notifications/templates", templateData, router);
    dispatch(addTemplate(res));
    return { success: true, data: res, message: 'Template created successfully' };
  } catch (err) {
    throw err;
  }
};

export const updateTemplate = (id, templateData, router) => async (dispatch) => {
  try {
    const res = await Api("put", `notifications/templates/${id}`, templateData, router);
    dispatch(updateTemplateInState(res));
    return { success: true, data: res, message: 'Template updated successfully' };
  } catch (err) {
    throw err;
  }
};

export const deleteTemplate = (id, router) => async (dispatch) => {
  try {
    const res = await Api("delete", `notifications/templates/${id}`, "", router);
    dispatch(removeTemplate(id));
    return { success: true, message: res.message || 'Template deleted successfully' };
  } catch (err) {
    throw err;
  }
};

export const fetchSettings = (router) => async (dispatch) => {
  try {
    const res = await Api("get", "notifications/settings", "", router);
    dispatch(setSettings(res));
    return { success: true, data: res };
  } catch (err) {
    throw err;
  }
};

export const updateStaffSettings = (settingsData, router) => async (dispatch) => {
  try {
    const res = await Api("put", "notifications/settings/staff", settingsData, router);
    dispatch(setSettings(res));
    return { success: true, data: res, message: 'Settings updated successfully' };
  } catch (err) {
    throw err;
  }
};

export const updateEmailSettings = (settingsData, router) => async (dispatch) => {
  try {
    const res = await Api("put", "notifications/settings/email", settingsData, router);
    dispatch(setSettings(res));
    return { success: true, data: res, message: 'Settings updated successfully' };
  } catch (err) {
    throw err;
  }
};

export const updateSMSSettings = (settingsData, router) => async (dispatch) => {
  try {
    const res = await Api("put", "notifications/settings/sms", settingsData, router);
    dispatch(setSettings(res));
    return { success: true, data: res, message: 'Settings updated successfully' };
  } catch (err) {
    throw err;
  }
};

export const sendTestNotification = (testData, router) => async (dispatch) => {
  try {
    const res = await Api("post", "notifications/send-test", testData, router);
    return { success: true, data: res, message: 'Test notification sent' };
  } catch (err) {
    throw err;
  }
};
