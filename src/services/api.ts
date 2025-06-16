import axios from 'axios';
import { StockData } from '../types/StockTypes';

// Mock API URL (replace with your actual API endpoint)
const API_BASE_URL = 'http://localhost:3000/api';

/**
 * Fetches stock data for a given symbol and time window
 */
export const fetchStockData = async (
  symbol: string,
  minutes: number
): Promise<StockData[]> => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/stocks/${symbol}?minutes=${minutes}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching stock data for ${symbol}:`, error);
    return [];
  }
};

/**
 * Fetches available stock symbols
 */
export const fetchAvailableStocks = async (): Promise<string[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/stocks/available`);
    return response.data;
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