import React, { useState, useEffect } from 'react';
import { 
  Grid, 
  Box, 
  Typography, 
  Button,
  Paper,
  Divider,
  useTheme
} from '@mui/material';
import { RefreshCcw, TrendingUp, Activity, DollarSign } from 'lucide-react';
import { useStockContext } from '../context/StockContext';
import StockSelector from '../components/common/StockSelector';
import TimeWindowSelector from '../components/common/TimeWindowSelector';
import StockChart from '../components/StockChart/StockChart';
import StatCard from '../components/common/StatCard';
import { calculateAveragePrice, calculateStandardDeviation } from '../utils/stockCalculations';

const StockPage: React.FC = () => {
  const theme = useTheme();
  const { 
    availableStocks,
    selectedStock,
    timeWindow,
    stocksData,
    isLoading,
    error,
    setSelectedStock,
    setTimeWindow,
    refreshData
  } = useStockContext();
  
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  
  useEffect(() => {
    // Set initial stock selection if not already set
    if (availableStocks.length > 0 && !selectedStock) {
      setSelectedStock(availableStocks[0]);
    }
  }, [availableStocks]);
  
  useEffect(() => {
    if (!isLoading) {
      setLastUpdated(new Date());
    }
  }, [isLoading]);

  // Get the stock data for the selected stock
  const currentStockData = selectedStock ? stocksData[selectedStock] || [] : [];
  
  // Calculate statistics
  const averagePrice = selectedStock ? calculateAveragePrice(currentStockData) : 0;
  const stdDev = selectedStock ? 
    calculateStandardDeviation(currentStockData, averagePrice) : 0;
  
  // Find min and max prices
  const prices = currentStockData.map(data => data.price);
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;
  
  const handleRefresh = () => {
    refreshData();
  };

  return (
    <Box>
      <Box mb={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Stock Price Analysis
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Real-time stock price visualization and analysis
        </Typography>
      </Box>
      
      <Paper 
        elevation={0} 
        sx={{ 
          p: 2, 
          mb: 4, 
          borderRadius: 2,
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'flex-start', md: 'center' },
          justifyContent: 'space-between',
          gap: 2
        }}
      >
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'flex-start', sm: 'center' },
            gap: 2,
            width: { xs: '100%', md: 'auto' }
          }}
        >
          <StockSelector 
            value={selectedStock} 
            onChange={setSelectedStock}
            fullWidth
          />
          
          <TimeWindowSelector 
            timeWindow={timeWindow} 
            onChange={setTimeWindow}
          />
        </Box>
        
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center',
            gap: 2,
            width: { xs: '100%', md: 'auto' }
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </Typography>
          
          <Button
            variant="outlined"
            color="primary"
            startIcon={<RefreshCcw size={16} />}
            onClick={handleRefresh}
            disabled={isLoading}
            sx={{ whiteSpace: 'nowrap' }}
          >
            Refresh
          </Button>
        </Box>
      </Paper>
      
      {error && (
        <Paper 
          elevation={0}
          sx={{
            p: 2,
            mb: 4,
            bgcolor: 'error.light',
            color: 'error.contrastText',
            borderRadius: 2
          }}
        >
          <Typography>{error}</Typography>
        </Paper>
      )}
      
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Average Price"
            value={`$${averagePrice.toFixed(2)}`}
            loading={isLoading}
            icon={<DollarSign size={24} />}
            color={theme.palette.primary.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Standard Deviation"
            value={`$${stdDev.toFixed(2)}`}
            loading={isLoading}
            icon={<Activity size={24} />}
            color={theme.palette.warning.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Minimum Price"
            value={`$${minPrice.toFixed(2)}`}
            loading={isLoading}
            icon={<TrendingUp size={24} />}
            color={theme.palette.error.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Maximum Price"
            value={`$${maxPrice.toFixed(2)}`}
            loading={isLoading}
            icon={<TrendingUp size={24} />}
            color={theme.palette.success.main}
          />
        </Grid>
      </Grid>
      
      <StockChart
        data={currentStockData}
        symbol={selectedStock}
        loading={isLoading}
      />
    </Box>
  );
};

export default StockPage;