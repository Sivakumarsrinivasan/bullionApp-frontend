export interface CreateOrderRequest {
  product_id: number;
  order_type: 'BUY' | 'SELL';
  quantity: number;
}

export interface getOrder {
  id: number;
  product_id: number;
  product_rate_id: number;
  order_type: 'BUY' | 'SELL';
  quantity: string | number;
  price: string | number;
  total_amount: string | number;
  status: string;
  created_at: string;
}