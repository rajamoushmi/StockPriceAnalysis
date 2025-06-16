import { StockData } from '../types/StockTypes';

// Mock stock symbols
const STOCK_SYMBOLS = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META', 'TSLA', 'NVDA', 'JPM'];

// Function to generate random price within range
const generateRandomPrice = (basePrice: number, volatility: number): number => {
  const change = basePrice * volatility * (Math.random() - 0.5);
  return basePrice + change;
};

// Base prices for stocks
const BASE_PRICES: Record<string, number> = {
  'AAPL': 150,
  'MSFT': 280,
  'GOOGL': 120,
  'AMZN': 130,
  'META': 300,
  'TSLA': 200,
  'NVDA': 400,
  'JPM': 140
};

// Volatility for stocks (0-1, higher means more volatile)
const VOLATILITY: Record<string, number> = {
  'AAPL': 0.02,
  'MSFT': 0.015,
  'GOOGL': 0.025,
  'AMZN': 0.03,
  'META': 0.035,
  'TSLA': 0.05,
  'NVDA': 0.04,
  'JPM': 0.01
};

// Generate historical data for a stock
const generateHistoricalData = (
  symbol: string, 
  minutes: number, 
  interval: number = 10 // seconds between data points
): StockData[] => {
  const data: StockData[] = [];
  const basePrice = BASE_PRICES[symbol] || 100;
  const volatility = VOLATILITY[symbol] || 0.02;
  
  // Current time in milliseconds
  const now = Date.now();
  
  // Calculate the number of data points
  const dataPoints = (minutes * 60) / interval;
  
  // Generate data points
  for (let i = 0; i < dataPoints; i++) {
    // Time for this data point (going back in time)
    const timestamp = now - (i * interval * 1000);
    
    // Generate price with some randomness and trend
    let price = generateRandomPrice(basePrice, volatility);
    
    // Add some trend (e.g., stocks tend to move together)
    // This helps create correlations between stocks
    const trendFactor = Math.sin(i / (dataPoints / 4)) * volatility * basePrice * 0.5;
    
    // Add correlation factors between specific stocks
    if (symbol === 'AAPL' || symbol === 'MSFT') {
      // Positive correlation between AAPL and MSFT
      price += trendFactor;
    } else if (symbol === 'GOOGL' || symbol === 'META') {
      // Positive correlation between GOOGL and META
      price += trendFactor;
    } else if (symbol === 'TSLA') {
      // TSLA sometimes moves opposite to others
      price -= trendFactor;
    }
    
    // Ensure price is positive
    price = Math.max(price, 0.01);
    
    data.push({
      symbol,
      price,
      timestamp
    });
  }
  
  // Sort by timestamp ascending (oldest first)
  return data.sort((a, b) => a.timestamp - b.timestamp);
};

// Mock API endpoints
export const mockApi = {
  // Get available stock symbols
  getAvailableStocks: (): Promise<string[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(STOCK_SYMBOLS);
      }, 500);
    });
  },
  
  // Get historical data for a stock
  getStockData: (symbol: string, minutes: number): Promise<StockData[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const data = generateHistoricalData(symbol, minutes);
        resolve(data);
      }, 800);
    });
  }
};