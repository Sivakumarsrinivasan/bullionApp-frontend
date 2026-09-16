export interface MarketRate {
  id: number;
  metal_type: string;
  source: string;
  price: string | number;
  currency: string;
  unit: string;
  recorded_at: string;
}