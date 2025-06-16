import React, { useMemo } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { format } from 'date-fns';
import { Box, Paper, Typography, useTheme } from '@mui/material';
import { StockData } from '../../types/StockTypes';
import { calculateAveragePrice } from '../../utils/stockCalculations';
import CustomTooltip from './CustomTooltip';

interface StockChartProps {
  data: StockData[];
  symbol: string;
  loading?: boolean;
}

const StockChart: React.FC<StockChartProps> = ({ 
  data, 
  symbol,
  loading = false 
}) => {
  const theme = useTheme();

  const chartData = useMemo(() => {
    return data.map(item => ({
      timestamp: item.timestamp,
      price: item.price,
      time: format(new Date(item.timestamp), 'HH:mm:ss')
    }));
  }, [data]);

  const averagePrice = useMemo(() => {
    return calculateAveragePrice(data);
  }, [data]);

  if (loading) {
    return (
      <Paper
        elevation={1}
        sx={{
          p: 3,
          borderRadius: 2,
          height: 400,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Typography variant="body1" color="text.secondary">
          Loading chart data...
        </Typography>
      </Paper>
    );
  }

  if (data.length === 0) {
    return (
      <Paper
        elevation={1}
        sx={{
          p: 3,
          borderRadius: 2,
          height: 400,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Typography variant="body1" color="text.secondary">
          No data available for {symbol}
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper
      elevation={1}
      sx={{
        p: 3,
        borderRadius: 2,
        height: 400
      }}
    >
      <Box mb={2}>
        <Typography variant="h6" component="h2">
          {symbol} Price Chart
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Real-time stock price data
        </Typography>
      </Box>
      
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
          <XAxis 
            dataKey="time" 
            tick={{ fontSize: 12 }}
            stroke={theme.palette.text.secondary}
          />
          <YAxis 
            domain={['auto', 'auto']}
            tick={{ fontSize: 12 }}
            stroke={theme.palette.text.secondary}
            width={60}
          />
          <Tooltip content={<CustomTooltip symbol={symbol} />} />
          <Legend />
          <ReferenceLine
            y={averagePrice}
            stroke={theme.palette.warning.main}
            strokeDasharray="3 3"
            label={{
              value: `Avg: ${averagePrice.toFixed(2)}`,
              fill: theme.palette.warning.main,
              fontSize: 12,
              position: 'right',
            }}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke={theme.palette.primary.main}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6 }}
            name={`${symbol} Price`}
            isAnimationActive={true}
            animationDuration={500}
          />
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default StockChart;