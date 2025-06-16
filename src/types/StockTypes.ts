export interface StockData {
  symbol: string;
  price: number;
  timestamp: number;
}

export interface StockChartData {
  symbol: string;
  data: Array<{
    timestamp: number;
    price: number;
  }>;
  averagePrice: number;
  standardDeviation: number;
}

export interface TimeWindow {
  minutes: number;
  label: string;
}

export interface CorrelationData {
  stock1: string;
  stock2: string;
  correlation: number;
}

export interface StockStatistics {
  symbol: string;
  averagePrice: number;
  standardDeviation: number;
}

export interface CorrelationMatrix {
  stocks: string[];
  correlations: number[][];
  statistics: Record<string, StockStatistics>;
}