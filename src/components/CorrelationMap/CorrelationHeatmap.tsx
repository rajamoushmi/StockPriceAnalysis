import React from 'react';
import { Box, Paper, Typography, useTheme, CircularProgress } from '@mui/material';
import { CorrelationMatrix } from '../../types/StockTypes';
import HeatmapCell from './HeatmapCell';
import HeatmapLegend from './HeatmapLegend';

interface CorrelationHeatmapProps {
  correlationData: CorrelationMatrix | null;
  loading?: boolean;
  onCellHover?: (stock1: string, stock2: string) => void;
}

const CorrelationHeatmap: React.FC<CorrelationHeatmapProps> = ({
  correlationData,
  loading = false,
  onCellHover
}) => {
  const theme = useTheme();
  
  if (loading) {
    return (
      <Paper
        elevation={1}
        sx={{
          p: 3,
          borderRadius: 2,
          minHeight: 400,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <CircularProgress size={40} sx={{ mb: 2 }} />
        <Typography variant="body1" color="text.secondary">
          Calculating correlation matrix...
        </Typography>
      </Paper>
    );
  }

  if (!correlationData || correlationData.stocks.length === 0) {
    return (
      <Paper
        elevation={1}
        sx={{
          p: 3,
          borderRadius: 2,
          minHeight: 400,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Typography variant="body1" color="text.secondary">
          No correlation data available
        </Typography>
      </Paper>
    );
  }

  const { stocks, correlations } = correlationData;

  return (
    <Paper
      elevation={1}
      sx={{
        p: 3,
        borderRadius: 2,
        overflowX: 'auto'
      }}
    >
      <Box mb={2}>
        <Typography variant="h6" component="h2">
          Stock Correlation Heatmap
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Pearson correlation coefficients between stocks
        </Typography>
      </Box>
      
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mb: 2
        }}
      >
        <HeatmapLegend />
      </Box>
      
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: `auto repeat(${stocks.length}, 1fr)`,
          gridGap: 1,
          width: '100%',
          minWidth: stocks.length * 60 + 100,
        }}
      >
        {/* Empty cell in top-left corner */}
        <Box
          sx={{
            p: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderBottom: `1px solid ${theme.palette.divider}`,
            borderRight: `1px solid ${theme.palette.divider}`,
          }}
        />
        
        {/* Column headers */}
        {stocks.map((stock) => (
          <Box
            key={`col-${stock}`}
            sx={{
              p: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderBottom: `1px solid ${theme.palette.divider}`,
              fontWeight: 'bold',
              fontSize: '0.75rem',
              textAlign: 'center',
              bgcolor: 'background.paper',
              position: 'sticky',
              top: 0,
              zIndex: 1,
            }}
          >
            <Typography
              variant="body2"
              sx={{
                fontWeight: 'bold',
                transform: 'rotate(-45deg)',
                transformOrigin: 'bottom left',
                whiteSpace: 'nowrap',
              }}
            >
              {stock}
            </Typography>
          </Box>
        ))}
        
        {/* Row headers and data cells */}
        {stocks.map((rowStock, rowIndex) => (
          <React.Fragment key={`row-${rowStock}`}>
            {/* Row header */}
            <Box
              sx={{
                p: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                borderRight: `1px solid ${theme.palette.divider}`,
                fontWeight: 'bold',
                fontSize: '0.75rem',
                textAlign: 'right',
                minWidth: 80,
              }}
            >
              <Typography variant="body2" fontWeight="bold">
                {rowStock}
              </Typography>
            </Box>
            
            {/* Data cells */}
            {stocks.map((colStock, colIndex) => (
              <HeatmapCell
                key={`cell-${rowStock}-${colStock}`}
                value={correlations[rowIndex][colIndex]}
                onHover={() => onCellHover && onCellHover(rowStock, colStock)}
                isHighlighted={rowIndex === colIndex}
              />
            ))}
          </React.Fragment>
        ))}
      </Box>
    </Paper>
  );
};

export default CorrelationHeatmap;