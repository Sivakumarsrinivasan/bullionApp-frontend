import { CreateOrderRequest } from '../types/order';
import api from './api';


export const createOrder = async (
  data: CreateOrderRequest,
) => {
    // console.log(data)
  const response = await api.post('orders/create-orders', data);

  return response.data;
};

export const getMyOrders = async (
  page = 1,
  limit = 10,
) => {
  const response = await api.get('orders/get-orders', {
    params: {
      page,
      limit,
    },
  });

  return response.data;
};

export const getAdminOrders = async (
  page = 1,
  limit = 10,
) => {
  const response = await api.get(
    'orders/admin/orders',
    {
      params: {
        page,
        limit,
      },
    },
  );

  return response.data;
};


export const getAdminOrderById = async (
  orderId: number,
) => {
  const response = await api.get(
    `orders/admin/orders/${orderId}`,
  );

  return response.data;
};


export const updateOrderStatus = async (
  orderId: number,
  status:
    | 'CONFIRMED'
    | 'PROCESSING'
    | 'COMPLETED'
    | 'CANCELLED',
) => {
  const response = await api.patch(
    `orders/admin/orders/${orderId}/status`,
    {
      status,
    },
  );

  return response.data;
};

