import { mockApi } from '../mocks/mockApi';
import { StockData } from '../types/StockTypes';

/**
 * Fetches stock data for a given symbol and time window
 * This implementation uses the mock API
 */
export const fetchStockData = async (
  symbol: string,
  minutes: number
): Promise<StockData[]> => {
  try {
    const data = await mockApi.getStockData(symbol, minutes);
    return data;
  } catch (error) {
    console.error(`Error fetching stock data for ${symbol}:`, error);
    return [];
  }
};

/**
 * Fetches available stock symbols
 * This implementation uses the mock API
 */
export const fetchAvailableStocks = async (): Promise<string[]> => {
  try {
    const symbols = await mockApi.getAvailableStocks();
    return symbols;
  } catch (error) {
    console.error('Error fetching available stocks:', error);
    return [];
  }
};

/**
 * Fetches stock data for multiple symbols
 */
export const fetchMultipleStocksData = async (
  symbols: string[],
  minutes: number
): Promise<Record<string, StockData[]>> => {
  try {
    const promises = symbols.map((symbol) => fetchStockData(symbol, minutes));
    const results = await Promise.all(promises);
    
    const stocksData: Record<string, StockData[]> = {};
    symbols.forEach((symbol, index) => {
      stocksData[symbol] = results[index];
    });
    
    return stocksData;
  } catch (error) {
    console.error('Error fetching multiple stocks data:', error);
    return {};
  }
};