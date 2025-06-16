import { StockData, StockStatistics, CorrelationMatrix } from '../types/StockTypes';

/**
 * Calculates the average price from an array of stock data
 */
export const calculateAveragePrice = (stockData: StockData[]): number => {
  if (stockData.length === 0) return 0;
  const sum = stockData.reduce((acc, data) => acc + data.price, 0);
  return sum / stockData.length;
};

/**
 * Calculates the standard deviation of prices
 */
export const calculateStandardDeviation = (
  stockData: StockData[],
  averagePrice: number
): number => {
  if (stockData.length <= 1) return 0;
  
  const squaredDifferences = stockData.map(data => 
    Math.pow(data.price - averagePrice, 2)
  );
  
  const sumSquaredDiff = squaredDifferences.reduce((acc, val) => acc + val, 0);
  return Math.sqrt(sumSquaredDiff / (stockData.length - 1));
};

/**
 * Calculates the covariance between two stock price series
 */
export const calculateCovariance = (
  stockData1: StockData[],
  stockData2: StockData[],
  avg1: number,
  avg2: number
): number => {
  // Ensure we have data points
  if (stockData1.length <= 1 || stockData2.length <= 1) return 0;
  
  // Align the time series by finding common timestamps
  const timeMap = new Map<number, { price1?: number; price2?: number }>();
  
  stockData1.forEach(data => {
    timeMap.set(data.timestamp, { price1: data.price });
  });
  
  stockData2.forEach(data => {
    const existingData = timeMap.get(data.timestamp);
    if (existingData) {
      existingData.price2 = data.price;
    } else {
      timeMap.set(data.timestamp, { price2: data.price });
    }
  });
  
  // Filter for timestamps that have both price1 and price2
  const alignedDataPoints = Array.from(timeMap.values())
    .filter(data => data.price1 !== undefined && data.price2 !== undefined) as 
    Array<{ price1: number; price2: number }>;
  
  if (alignedDataPoints.length <= 1) return 0;
  
  // Calculate covariance
  const covSum = alignedDataPoints.reduce(
    (acc, { price1, price2 }) => acc + (price1 - avg1) * (price2 - avg2),
    0
  );
  
  return covSum / (alignedDataPoints.length - 1);
};

/**
 * Calculates the Pearson correlation coefficient between two stocks
 */
export const calculateCorrelation = (
  stockData1: StockData[],
  stockData2: StockData[]
): number => {
  if (stockData1.length <= 1 || stockData2.length <= 1) return 0;
  
  const avg1 = calculateAveragePrice(stockData1);
  const avg2 = calculateAveragePrice(stockData2);
  
  const stdDev1 = calculateStandardDeviation(stockData1, avg1);
  const stdDev2 = calculateStandardDeviation(stockData2, avg2);
  
  // Avoid division by zero
  if (stdDev1 === 0 || stdDev2 === 0) return 0;
  
  const covariance = calculateCovariance(stockData1, stockData2, avg1, avg2);
  
  return covariance / (stdDev1 * stdDev2);
};

/**
 * Generates a correlation matrix for all stocks
 */
export const generateCorrelationMatrix = (
  stocksData: Record<string, StockData[]>
): CorrelationMatrix => {
  const symbols = Object.keys(stocksData);
  
  // Calculate statistics for each stock
  const statistics: Record<string, StockStatistics> = {};
  symbols.forEach(symbol => {
    const data = stocksData[symbol];
    const averagePrice = calculateAveragePrice(data);
    const standardDeviation = calculateStandardDeviation(data, averagePrice);
    
    statistics[symbol] = {
      symbol,
      averagePrice,
      standardDeviation
    };
  });
  
  // Initialize correlation matrix
  const correlations: number[][] = Array(symbols.length)
    .fill(0)
    .map(() => Array(symbols.length).fill(0));
  
  // Calculate correlations
  for (let i = 0; i < symbols.length; i++) {
    // Diagonal (correlation with self) is always 1
    correlations[i][i] = 1;
    
    for (let j = i + 1; j < symbols.length; j++) {
      const correlation = calculateCorrelation(
        stocksData[symbols[i]],
        stocksData[symbols[j]]
      );
      
      // Matrix is symmetric
      correlations[i][j] = correlation;
      correlations[j][i] = correlation;
    }
  }
  
  return {
    stocks: symbols,
    correlations,
    statistics
  };
};