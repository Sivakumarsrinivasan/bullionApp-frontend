import { ProductPayload, ProductRate, responseType } from "../types/product";
import api from "./api";

export const getCurrentProductRates = async (): Promise<ProductRate[]> => {
  const response = await api.get('rates/fetch-rates');

  return response.data.rates;
}
export const getProductRate = async (
  productId: number,
): Promise<responseType> => {
  const response = await api.get(
    `rates/products/${productId}/rate`,
  );

  return response.data;
};
export const getProducts = async () => {
  const response = await api.get('rates/products');
  return response.data;
};

export const createProduct = async (data: ProductPayload) => {
  const response = await api.post('rates/products/insert-products', data);
  return response.data;
};

export const updateProduct = async (
  productId: number,
  data: ProductPayload,
) => {
  console.log(data);
  console.log(productId)
  const response = await api.put(`rates/products/${productId}`, data);
  return response.data;
};

export const createProductRate = async (data: {
  product_id: number;
  buy_price: number;
  sell_price: number;
}) => {
  const response = await api.post(
    'rates/product-rates',
    data,
  );

  return response.data;
};

export const updateProductRate = async (
  rateId: number,
  data: {
    buy_price: number;
    sell_price: number;
  },
) => {
  const response = await api.put(
    `rates/product-rates/${rateId}`,
    data,
  );

  return response.data;
};

export const getProductRateHistory = async (
  productId: number,
  page: number = 1,
  limit: number = 20,
) => {
  const response = await api.get(
    `rates/products/${productId}/rate-history`,
    {
      params: {
        page,
        limit,
      },
    },
  );

  return response.data;
};

