import React, { useState } from 'react';
import { 
  Grid, 
  Box, 
  Typography, 
  Button,
  Paper
} from '@mui/material';
import { RefreshCcw } from 'lucide-react';
import { useStockContext } from '../context/StockContext';
import TimeWindowSelector from '../components/common/TimeWindowSelector';
import CorrelationHeatmap from '../components/CorrelationMap/CorrelationHeatmap';
import StockStatisticsCard from '../components/CorrelationMap/StockStatisticsCard';

const CorrelationPage: React.FC = () => {
  const { 
    timeWindow,
    correlationMatrix,
    isLoading,
    error,
    setTimeWindow,
    refreshData
  } = useStockContext();
  
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [selectedStats, setSelectedStats] = useState<{
    stock1: string;
    stock2: string;
  } | null>(null);
  
  React.useEffect(() => {
    if (!isLoading) {
      setLastUpdated(new Date());
    }
  }, [isLoading]);
  
  const handleRefresh = () => {
    refreshData();
  };
  
  const handleCellHover = (stock1: string, stock2: string) => {
    setSelectedStats({ stock1, stock2 });
  };
  
  // Get the statistics for the selected stocks
  const getStatisticsData = () => {
    if (!selectedStats || !correlationMatrix) return { stock1: undefined, stock2: undefined, correlation: undefined };
    
    const { stock1, stock2 } = selectedStats;
    const stock1Stats = correlationMatrix.statistics[stock1];
    const stock2Stats = correlationMatrix.statistics[stock2];
    
    // Get correlation value
    const stock1Index = correlationMatrix.stocks.indexOf(stock1);
    const stock2Index = correlationMatrix.stocks.indexOf(stock2);
    const correlation = correlationMatrix.correlations[stock1Index][stock2Index];
    
    return { 
      stock1: stock1Stats, 
      stock2: stock2Stats,
      correlation
    };
  };
  
  const { stock1, stock2, correlation } = getStatisticsData();

  return (
    <Box>
      <Box mb={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Stock Correlation Analysis
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Visualize and analyze correlations between different stocks
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
        <Box>
          <TimeWindowSelector 
            timeWindow={timeWindow} 
            onChange={setTimeWindow}
            label="Correlation Time Window"
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
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <CorrelationHeatmap 
            correlationData={correlationMatrix}
            loading={isLoading}
            onCellHover={handleCellHover}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StockStatisticsCard 
            stock1={stock1}
            stock2={stock2}
            correlation={correlation}
            loading={isLoading}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default CorrelationPage;