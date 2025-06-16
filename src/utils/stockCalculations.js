export const calculateAveragePrice = (stockData) => {
  if (stockData.length === 0) return 0;
  const sum = stockData.reduce((acc, data) => acc + data.price, 0);
  return sum / stockData.length;
};

export const calculateStandardDeviation = (
  stockData,
  averagePrice
) => {
  if (stockData.length <= 1) return 0;
  
  const squaredDifferences = stockData.map(data => 
    Math.pow(data.price - averagePrice, 2)
  );
  
  const sumSquaredDiff = squaredDifferences.reduce((acc, val) => acc + val, 0);
  return Math.sqrt(sumSquaredDiff / (stockData.length - 1));
};

export const calculateCovariance = (
  stockData1,
  stockData2,
  avg1,
  avg2
) => {
  if (stockData1.length <= 1 || stockData2.length <= 1) return 0;
  
  const timeMap = new Map();
  
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
  
  const alignedDataPoints = Array.from(timeMap.values())
    .filter(data => data.price1 !== undefined && data.price2 !== undefined);
  
  if (alignedDataPoints.length <= 1) return 0;
  
  const covSum = alignedDataPoints.reduce(
    (acc, { price1, price2 }) => acc + (price1 - avg1) * (price2 - avg2),
    0
  );
  
  return covSum / (alignedDataPoints.length - 1);
};

export const calculateCorrelation = (
  stockData1,
  stockData2
) => {
  if (stockData1.length <= 1 || stockData2.length <= 1) return 0;
  
  const avg1 = calculateAveragePrice(stockData1);
  const avg2 = calculateAveragePrice(stockData2);
  
  const stdDev1 = calculateStandardDeviation(stockData1, avg1);
  const stdDev2 = calculateStandardDeviation(stockData2, avg2);
  
  if (stdDev1 === 0 || stdDev2 === 0) return 0;
  
  const covariance = calculateCovariance(stockData1, stockData2, avg1, avg2);
  
  return covariance / (stdDev1 * stdDev2);
};

export const generateCorrelationMatrix = (stocksData) => {
  const symbols = Object.keys(stocksData);
  
  const statistics = {};
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
  
  const correlations = Array(symbols.length)
    .fill(0)
    .map(() => Array(symbols.length).fill(0));
  
  for (let i = 0; i < symbols.length; i++) {
    correlations[i][i] = 1;
    
    for (let j = i + 1; j < symbols.length; j++) {
      const correlation = calculateCorrelation(
        stocksData[symbols[i]],
        stocksData[symbols[j]]
      );
      
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