import { Api } from '@/services/service';
import {
  setStockOrders,
  setCurrentStockOrder,
  setSupplierProducts,
  setLoading,
  setError,
  setSuccess,
} from '../slices/stockOrderSlice';


export const createStockOrder = (orderData, router) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const res = await Api('POST', 'stock-orders', orderData, router);
    if (res?.status) {
      dispatch(setSuccess(true));
      const orderData = res.data?.data || res.data;
      return { success: true, data: orderData, message: res.message };
    }
    dispatch(setLoading(false));
    return { success: false, message: res.message };
  } catch (err) {
    dispatch(setLoading(false));
    dispatch(setError(err.message || 'Failed to create stock order'));
    throw err;
  }
};


export const fetchStockOrders = (router) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const res = await Api('GET', 'stock-orders', '', router);
    if (res?.status) {
      const ordersData = Array.isArray(res.data) ? res.data : res.data?.data || [];
      dispatch(setStockOrders(ordersData));
    }
    dispatch(setLoading(false));
    return { success: true, data: res.data };
  } catch (err) {
    dispatch(setLoading(false));
    throw err;
  }
};


export const getStockOrderById = (id, router) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const res = await Api('GET', `stock-orders/${id}`, '', router);
    if (res?.status) {
      const orderData = res.data?.data || res.data;
      dispatch(setCurrentStockOrder(orderData));
      dispatch(setLoading(false));
      return { success: true, data: orderData };
    }
    dispatch(setLoading(false));
    return { success: false, message: res.message };
  } catch (err) {
    dispatch(setLoading(false));
    throw err;
  }
};


export const updateStockOrder = (id, orderData, router) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const res = await Api('PUT', `stock-orders/${id}`, orderData, router);
    if (res?.status) {
      dispatch(setSuccess(true));
      return { success: true, data: res.data, message: res.message };
    }
    dispatch(setLoading(false));
    return { success: false, message: res.message };
  } catch (err) {
    dispatch(setLoading(false));
    dispatch(setError(err.message || 'Failed to update stock order'));
    throw err;
  }
};


export const sendStockOrder = (id, sendData, router) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const res = await Api('POST', `stock-orders/${id}/send`, sendData, router);
    if (res?.status) {
      dispatch(setSuccess(true));
      return { success: true, data: res.data, message: res.message };
    }
    dispatch(setLoading(false));
    return { success: false, message: res.message };
  } catch (err) {
    dispatch(setLoading(false));
    dispatch(setError(err.message || 'Failed to send stock order'));
    throw err;
  }
};


export const deleteStockOrder = (id, router) => async (dispatch) => {
  try {
    const res = await Api('DELETE', `stock-orders/${id}`, '', router);
    if (res?.status) {
      return { success: true, message: res.message };
    }
    return { success: false, message: res.message };
  } catch (err) {
    throw err;
  }
};


export const fetchProductsBySupplier = (supplierId, router) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const res = await Api('GET', `stock-orders/supplier/${supplierId}/products`, '', router);
    if (res?.status) {
      const productsData = Array.isArray(res.data) ? res.data : res.data?.data || [];
      dispatch(setSupplierProducts(productsData));
    }
    dispatch(setLoading(false));
    return { success: true, data: res.data };
  } catch (err) {
    dispatch(setLoading(false));
    throw err;
  }
};
