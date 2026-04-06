import { Api } from '@/services/service';
import {
  setSuppliers,
  setCurrentSupplier,
  setLoading,
  setError,
  setSuccess,
} from '../slices/supplierSlice';


export const createSupplier = (supplierData, router) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const res = await Api('POST', 'suppliers', supplierData, router);
    if (res?.status) {
      dispatch(setSuccess(true));
      return { success: true, data: res.data, message: res.message };
    }
    dispatch(setLoading(false));
    return { success: false, message: res.message };
  } catch (err) {
    dispatch(setLoading(false));
    dispatch(setError(err.message || 'Failed to create supplier'));
    throw err;
  }
};


export const fetchSuppliers = (router) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const res = await Api('GET', 'suppliers', '', router);
    if (res?.status) {
      const suppliersData = Array.isArray(res.data) ? res.data : res.data?.data || [];
      dispatch(setSuppliers(suppliersData));
    }
    dispatch(setLoading(false));
    return { success: true, data: res.data };
  } catch (err) {
    dispatch(setLoading(false));
    throw err;
  }
};


export const getSupplierById = (id, router) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const res = await Api('GET', `suppliers/${id}`, '', router);
    if (res?.status) {
      const supplierData = res.data?.data || res.data;
      dispatch(setCurrentSupplier(supplierData));
      dispatch(setLoading(false));
      return { success: true, data: supplierData };
    }
    dispatch(setLoading(false));
    return { success: false, message: res.message };
  } catch (err) {
    dispatch(setLoading(false));
    throw err;
  }
};


export const updateSupplier = (id, supplierData, router) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const res = await Api('PUT', `suppliers/${id}`, supplierData, router);
    if (res?.status) {
      dispatch(setSuccess(true));
      return { success: true, data: res.data, message: res.message };
    }
    dispatch(setLoading(false));
    return { success: false, message: res.message };
  } catch (err) {
    dispatch(setLoading(false));
    dispatch(setError(err.message || 'Failed to update supplier'));
    throw err;
  }
};


export const deleteSupplier = (id, router) => async (dispatch) => {
  try {
    const res = await Api('DELETE', `suppliers/${id}`, '', router);
    if (res?.status) {
      return { success: true, message: res.message };
    }
    return { success: false, message: res.message };
  } catch (err) {
    throw err;
  }
};
