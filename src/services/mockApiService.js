import { mockApi } from '../mocks/mockApi';

export const fetchStockData = async (
  symbol,
  minutes
) => {
  try {
    const data = await mockApi.getStockData(symbol, minutes);
    return data;
  } catch (error) {
    console.error(`Error fetching stock data for ${symbol}:`, error);
    return [];
  }
};

export const fetchAvailableStocks = async () => {
  try {
    const symbols = await mockApi.getAvailableStocks();
    return symbols;
  } catch (error) {
    console.error('Error fetching available stocks:', error);
    return [];
  }
};

export const fetchMultipleStocksData = async (
  symbols,
  minutes
) => {
  try {
    const promises = symbols.map((symbol) => fetchStockData(symbol, minutes));
    const results = await Promise.all(promises);
    
    const stocksData = {};
    symbols.forEach((symbol, index) => {
      stocksData[symbol] = results[index];
    });
    
    return stocksData;
  } catch (error) {
    console.error('Error fetching multiple stocks data:', error);
    return {};
  }
};