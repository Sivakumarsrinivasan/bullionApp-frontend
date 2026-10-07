import { MarketRate } from "../types/marketRate";
import api from "./api";

export const getLatestMarketRates = async (): Promise<MarketRate[]> => {
  const response = await api.get('rates/market-rates');

  return response.data.rates;
};

export const refreshMarketRate = async (
  symbol: 'XAU' | 'XAG' | 'GOLD_999' | 'SILVER_999',
) => {
  const response = await api.get(
    `rates/market-price/${symbol}`,
  );

  return response.data;
};