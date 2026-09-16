export interface ProductRate {
  id: number;
  product_name: string;
  name:string;
  metal_type: string;
  purity: string;
  unit: string;
  buy_price: number;
  sell_price: number;
  valid_from: string;
  valid_to: string | null;
    product_id: number;
}

export interface responseType{
    statusCode:number;
    message:string;
    data:ProductRate
}

export type ProductPayload = {
  name: string;
  metal_type: 'GOLD' | 'SILVER';
  purity: number;
  unit: 'GRAM' | 'KILOGRAM';
};