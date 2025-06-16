import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Box,
  Button,
  useMediaQuery,
  useTheme,
  IconButton,
  Menu,
  MenuItem
} from '@mui/material';
import { BarChart, TrendingUp, Menu as MenuIcon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const AppHeader: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const location = useLocation();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  const isActive = (path: string) => location.pathname === path;
  
  const navItems = [
    { label: 'Stock Chart', path: '/', icon: <TrendingUp size={18} /> },
    { label: 'Correlation', path: '/correlation', icon: <BarChart size={18} /> }
  ];
  
  return (
    <AppBar 
      position="sticky" 
      color="default" 
      elevation={1}
      sx={{ 
        bgcolor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider'
      }}
    >
      <Toolbar>
        <Box display="flex" alignItems="center">
          <TrendingUp size={24} color={theme.palette.primary.main} />
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              ml: 1.5,
              fontWeight: 'bold',
              background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            StockVision
          </Typography>
        </Box>
        
        <Box sx={{ flexGrow: 1 }} />
        
        {isMobile ? (
          <>
            <IconButton
              edge="end"
              color="inherit"
              aria-label="menu"
              onClick={handleMenuOpen}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              keepMounted
            >
              {navItems.map((item) => (
                <MenuItem 
                  key={item.path}
                  component={Link}
                  to={item.path}
                  onClick={handleMenuClose}
                  selected={isActive(item.path)}
                >
                  <Box display="flex" alignItems="center">
                    {item.icon}
                    <Typography sx={{ ml: 1 }}>{item.label}</Typography>
                  </Box>
                </MenuItem>
              ))}
            </Menu>
          </>
        ) : (
          <Box display="flex" gap={1}>
            {navItems.map((item) => (
              <Button
                key={item.path}
                component={Link}
                to={item.path}
                color="primary"
                variant={isActive(item.path) ? "contained" : "text"}
                startIcon={item.icon}
                sx={{ 
                  borderRadius: 1,
                  px: 2
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default AppHeader;