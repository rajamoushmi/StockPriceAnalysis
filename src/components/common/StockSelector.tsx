import React from 'react';
import { 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  SelectChangeEvent 
} from '@mui/material';
import { useStockContext } from '../../context/StockContext';

interface StockSelectorProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  fullWidth?: boolean;
}

const StockSelector: React.FC<StockSelectorProps> = ({
  value,
  onChange,
  label = 'Select Stock',
  fullWidth = false
}) => {
  const { availableStocks } = useStockContext();

  const handleChange = (event: SelectChangeEvent) => {
    onChange(event.target.value);
  };

  return (
    <FormControl 
      variant="outlined" 
      size="small" 
      sx={{ minWidth: 200 }}
      fullWidth={fullWidth}
    >
      <InputLabel id="stock-selector-label">{label}</InputLabel>
      <Select
        labelId="stock-selector-label"
        value={value}
        onChange={handleChange}
        label={label}
      >
        {availableStocks.map((stock) => (
          <MenuItem key={stock} value={stock}>
            {stock}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default StockSelector;