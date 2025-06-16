import React from 'react';
import { Box, Card, CardContent, Divider, Typography, Skeleton } from '@mui/material';
import { StockStatistics } from '../../types/StockTypes';

interface StockStatisticsCardProps {
  stock1?: StockStatistics;
  stock2?: StockStatistics;
  correlation?: number;
  loading?: boolean;
}

const StockStatisticsCard: React.FC<StockStatisticsCardProps> = ({
  stock1,
  stock2,
  correlation,
  loading = false
}) => {
  const getCorrelationDescription = (value: number): string => {
    if (value >= 0.7) return 'Strong positive correlation';
    if (value >= 0.3) return 'Moderate positive correlation';
    if (value > -0.3) return 'Weak or no correlation';
    if (value > -0.7) return 'Moderate negative correlation';
    return 'Strong negative correlation';
  };

  const getCorrelationColor = (value: number): string => {
    if (value >= 0.7) return 'success.main';
    if (value >= 0.3) return 'success.light';
    if (value > -0.3) return 'text.secondary';
    if (value > -0.7) return 'error.light';
    return 'error.main';
  };

  return (
    <Card
      elevation={1}
      sx={{
        height: '100%',
        borderRadius: 2,
      }}
    >
      <CardContent>
        <Typography variant="h6" component="h2" gutterBottom>
          Stock Statistics
        </Typography>
        
        {loading ? (
          <Box>
            <Skeleton variant="text" height={30} width="60%" />
            <Skeleton variant="text" height={24} width="40%" />
            <Skeleton variant="text" height={24} width="40%" />
            <Divider sx={{ my: 2 }} />
            <Skeleton variant="text" height={30} width="60%" />
            <Skeleton variant="text" height={24} width="40%" />
            <Skeleton variant="text" height={24} width="40%" />
          </Box>
        ) : (
          <>
            {!stock1 && !stock2 ? (
              <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                Hover over the heatmap cells to view stock statistics
              </Typography>
            ) : (
              <>
                {stock1 && (
                  <Box mb={2}>
                    <Typography 
                      variant="subtitle1" 
                      color="primary" 
                      gutterBottom
                      sx={{ fontWeight: 'bold' }}
                    >
                      {stock1.symbol}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Average Price: <Box component="span" fontWeight="bold">${stock1.averagePrice.toFixed(2)}</Box>
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Standard Deviation: <Box component="span" fontWeight="bold">${stock1.standardDeviation.toFixed(2)}</Box>
                    </Typography>
                  </Box>
                )}
                
                {stock1 && stock2 && (
                  <Divider sx={{ my: 2 }} />
                )}
                
                {stock2 && stock1 && stock1.symbol !== stock2.symbol && (
                  <Box mb={2}>
                    <Typography 
                      variant="subtitle1" 
                      color="primary" 
                      gutterBottom
                      sx={{ fontWeight: 'bold' }}
                    >
                      {stock2.symbol}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Average Price: <Box component="span" fontWeight="bold">${stock2.averagePrice.toFixed(2)}</Box>
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Standard Deviation: <Box component="span" fontWeight="bold">${stock2.standardDeviation.toFixed(2)}</Box>
                    </Typography>
                  </Box>
                )}
                
                {correlation !== undefined && stock1 && stock2 && stock1.symbol !== stock2.symbol && (
                  <>
                    <Divider sx={{ my: 2 }} />
                    <Box>
                      <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                        Correlation
                      </Typography>
                      <Typography 
                        variant="h5" 
                        color={getCorrelationColor(correlation)}
                        sx={{ fontWeight: 'bold' }}
                      >
                        {correlation.toFixed(2)}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        color={getCorrelationColor(correlation)}
                      >
                        {getCorrelationDescription(correlation)}
                      </Typography>
                    </Box>
                  </>
                )}
              </>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default StockStatisticsCard;