import React from 'react';
import { Box, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { defaultTimeWindows } from '../../context/StockContext';
import { TimeWindow } from '../../types/StockTypes';

interface TimeWindowSelectorProps {
  timeWindow: TimeWindow;
  onChange: (window: TimeWindow) => void;
  label?: string;
}

const TimeWindowSelector: React.FC<TimeWindowSelectorProps> = ({
  timeWindow,
  onChange,
  label = 'Time Window'
}) => {
  const handleChange = (
    _: React.MouseEvent<HTMLElement>,
    newValue: number | null
  ) => {
    if (newValue !== null) {
      const selected = defaultTimeWindows.find(
        window => window.minutes === newValue
      );
      if (selected) {
        onChange(selected);
      }
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
      <Typography variant="body2" color="text.secondary">
        {label}:
      </Typography>
      <ToggleButtonGroup
        value={timeWindow.minutes}
        exclusive
        onChange={handleChange}
        aria-label="time window"
        size="small"
        sx={{
          '& .MuiToggleButtonGroup-grouped': {
            border: 1,
            borderColor: 'divider',
            '&.Mui-selected': {
              backgroundColor: 'primary.main',
              color: 'white',
              '&:hover': {
                backgroundColor: 'primary.dark',
              },
            },
          },
        }}
      >
        {defaultTimeWindows.map((window) => (
          <ToggleButton 
            key={window.minutes} 
            value={window.minutes}
            aria-label={`${window.label} time window`}
          >
            {window.label}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Box>
  );
};

export default TimeWindowSelector;