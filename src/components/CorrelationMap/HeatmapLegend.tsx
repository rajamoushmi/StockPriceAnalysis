import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';

const HeatmapLegend: React.FC = () => {
  const theme = useTheme();

  const legendGradient = `linear-gradient(to right, 
    ${theme.palette.error.main} 0%, 
    ${theme.palette.error.light} 20%, 
    rgba(224, 224, 224, 0.5) 50%, 
    ${theme.palette.success.light} 80%, 
    ${theme.palette.success.main} 100%)`;

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 500,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        mb: 3,
      }}
    >
      <Box
        sx={{
          width: '100%',
          height: 20,
          background: legendGradient,
          borderRadius: 1,
          mb: 1,
        }}
      />
      
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="caption" color="error">
          Strong Negative (-1.0)
        </Typography>
        <Typography variant="caption" color="text.secondary">
          No Correlation (0)
        </Typography>
        <Typography variant="caption" color="success">
          Strong Positive (+1.0)
        </Typography>
      </Box>
    </Box>
  );
};

export default HeatmapLegend;