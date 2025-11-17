// client/src/api/order.routes.js
import axiosAuth from '../axios/axiosAuth';

export const createOrder = (items) => {
  return axiosAuth.post('/orders', { items });
};

export const fetchMyOrders = () => {
  return axiosAuth.get('/orders/me');
};

export const fetchAllOrders = () => {
  return axiosAuth.get('/orders');
};

export const updateOrderStatus = (orderId, status) => {
  return axiosAuth.put(`/orders/${orderId}`, { status });
};
