import React from 'react';
import { Box, Tooltip, Typography } from '@mui/material';

interface HeatmapCellProps {
  value: number;
  onHover?: () => void;
  isHighlighted?: boolean;
}

// Utility function to get cell color based on correlation value
const getCellColor = (value: number): string => {
  // Strong negative correlation: red
  if (value <= -0.7) return 'rgba(244, 67, 54, 0.9)';
  // Moderate negative correlation: light red
  if (value <= -0.3) return 'rgba(244, 67, 54, 0.6)';
  // Weak negative correlation: very light red
  if (value < 0) return 'rgba(244, 67, 54, 0.3)';
  // No correlation: white/gray
  if (value === 0) return 'rgba(224, 224, 224, 0.5)';
  // Weak positive correlation: very light green
  if (value < 0.3) return 'rgba(76, 175, 80, 0.3)';
  // Moderate positive correlation: light green
  if (value < 0.7) return 'rgba(76, 175, 80, 0.6)';
  // Strong positive correlation: green
  return 'rgba(76, 175, 80, 0.9)';
};

const HeatmapCell: React.FC<HeatmapCellProps> = ({
  value,
  onHover,
  isHighlighted = false
}) => {
  const cellColor = getCellColor(value);
  const formattedValue = value.toFixed(2);
  
  return (
    <Tooltip
      title={
        <Typography variant="body2">
          Correlation: {formattedValue}
        </Typography>
      }
      arrow
    >
      <Box
        sx={{
          width: '100%',
          height: '100%',
          minWidth: 40,
          minHeight: 40,
          bgcolor: cellColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'transform 0.2s, box-shadow 0.2s',
          border: isHighlighted ? '2px solid' : '1px solid',
          borderColor: isHighlighted ? 'primary.main' : 'divider',
          '&:hover': {
            transform: 'scale(1.05)',
            boxShadow: 2,
            zIndex: 2,
          },
        }}
        onMouseEnter={onHover}
      >
        <Typography
          variant="body2"
          sx={{
            fontWeight: 'medium',
            color: Math.abs(value) > 0.5 ? 'white' : 'text.primary',
          }}
        >
          {formattedValue}
        </Typography>
      </Box>
    </Tooltip>
  );
};

export default HeatmapCell;