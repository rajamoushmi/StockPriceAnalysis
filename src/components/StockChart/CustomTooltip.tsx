import React from 'react';
import { Box, Paper, Typography } from '@mui/material';

interface TooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  symbol: string;
}

const CustomTooltip: React.FC<TooltipProps> = ({ 
  active, 
  payload, 
  label, 
  symbol 
}) => {
  if (active && payload && payload.length) {
    const price = payload[0].value;
    
    return (
      <Paper
        elevation={3}
        sx={{
          p: 1.5,
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          boxShadow: 2,
          borderRadius: 1,
          maxWidth: 200
        }}
      >
        <Typography 
          variant="subtitle2" 
          component="div"
          color="primary"
          sx={{ fontWeight: 'bold', mb: 0.5 }}
        >
          {symbol}
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
          <Typography variant="body2" color="text.secondary">
            Time:
          </Typography>
          <Typography variant="body2" fontWeight="medium">
            {label}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body2" color="text.secondary">
            Price:
          </Typography>
          <Typography 
            variant="body2" 
            fontWeight="medium"
            color="primary.main"
          >
            ${price.toFixed(2)}
          </Typography>
        </Box>
      </Paper>
    );
  }

  return null;
};

export default CustomTooltip;