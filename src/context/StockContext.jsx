import React, { createContext, useState, useEffect, useContext } from 'react';
import { 
  fetchAvailableStocks, 
  fetchMultipleStocksData 
} from '../services/mockApiService';
import { generateCorrelationMatrix } from '../utils/stockCalculations';

export const defaultTimeWindows = [
  { minutes: 5, label: '5m' },
  { minutes: 15, label: '15m' },
  { minutes: 30, label: '30m' },
  { minutes: 60, label: '1h' },
  { minutes: 120, label: '2h' },
  { minutes: 240, label: '4h' },
];

const StockContext = createContext();

export const StockProvider = ({ children }) => {
  const [availableStocks, setAvailableStocks] = useState([]);
  const [selectedStock, setSelectedStock] = useState('');
  const [timeWindow, setTimeWindow] = useState(defaultTimeWindows[0]);
  const [stocksData, setStocksData] = useState({});
  const [correlationMatrix, setCorrelationMatrix] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const stocks = await fetchAvailableStocks();
        setAvailableStocks(stocks);
        
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

  useEffect(() => {
    if (availableStocks.length > 0) {
      refreshData();
    }
  }, [timeWindow, availableStocks]);

  const refreshData = async () => {
    if (availableStocks.length === 0) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await fetchMultipleStocksData(
        availableStocks,
        timeWindow.minutes
      );
      setStocksData(data);
      
      const matrix = generateCorrelationMatrix(data);
      setCorrelationMatrix(matrix);
    } catch (err) {
      setError('Failed to fetch stock data');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      refreshData();
    }, 60000);
    
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

export const useStockContext = () => {
  const context = useContext(StockContext);
  if (context === undefined) {
    throw new Error('useStockContext must be used within a StockProvider');
  }
  return context;
};