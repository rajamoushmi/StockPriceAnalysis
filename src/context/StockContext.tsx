import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { 
  fetchAvailableStocks, 
  fetchMultipleStocksData 
} from '../services/mockApiService'; // Using mock API
import { generateCorrelationMatrix } from '../utils/stockCalculations';
import { StockData, TimeWindow, CorrelationMatrix } from '../types/StockTypes';

interface StockContextType {
  availableStocks: string[];
  selectedStock: string;
  timeWindow: TimeWindow;
  stocksData: Record<string, StockData[]>;
  correlationMatrix: CorrelationMatrix | null;
  isLoading: boolean;
  error: string | null;
  setSelectedStock: (symbol: string) => void;
  setTimeWindow: (window: TimeWindow) => void;
  refreshData: () => Promise<void>;
}

export const defaultTimeWindows: TimeWindow[] = [
  { minutes: 5, label: '5m' },
  { minutes: 15, label: '15m' },
  { minutes: 30, label: '30m' },
  { minutes: 60, label: '1h' },
  { minutes: 120, label: '2h' },
  { minutes: 240, label: '4h' },
];

const StockContext = createContext<StockContextType | undefined>(undefined);

export const StockProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [availableStocks, setAvailableStocks] = useState<string[]>([]);
  const [selectedStock, setSelectedStock] = useState<string>('');
  const [timeWindow, setTimeWindow] = useState<TimeWindow>(defaultTimeWindows[0]);
  const [stocksData, setStocksData] = useState<Record<string, StockData[]>>({});
  const [correlationMatrix, setCorrelationMatrix] = useState<CorrelationMatrix | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch available stocks on mount
  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const stocks = await fetchAvailableStocks();
        setAvailableStocks(stocks);
        
        // Set the first stock as selected if available
        if (stocks.length > 0 && selectedStock === '') {
          setSelectedStock(stocks[0]);
        }
      } catch (err) {
        setError('Failed to fetch available stocks');
        console.error(err);
      }
    };

    fetchStocks();
  }, []);

  // Fetch data for all stocks when timeWindow changes or when stocks are loaded
  useEffect(() => {
    if (availableStocks.length > 0) {
      refreshData();
    }
  }, [timeWindow, availableStocks]);

  const refreshData = async (): Promise<void> => {
    if (availableStocks.length === 0) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await fetchMultipleStocksData(
        availableStocks,
        timeWindow.minutes
      );
      setStocksData(data);
      
      // Generate correlation matrix
      const matrix = generateCorrelationMatrix(data);
      setCorrelationMatrix(matrix);
    } catch (err) {
      setError('Failed to fetch stock data');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-refresh data every minute
  useEffect(() => {
    const intervalId = setInterval(() => {
      refreshData();
    }, 60000); // 60 seconds
    
    return () => clearInterval(intervalId);
  }, [availableStocks, timeWindow]);

  const value = {
    availableStocks,
    selectedStock,
    timeWindow,
    stocksData,
    correlationMatrix,
    isLoading,
    error,
    setSelectedStock,
    setTimeWindow,
    refreshData
  };

  return <StockContext.Provider value={value}>{children}</StockContext.Provider>;
};

export const useStockContext = (): StockContextType => {
  const context = useContext(StockContext);
  if (context === undefined) {
    throw new Error('useStockContext must be used within a StockProvider');
  }
  return context;
};