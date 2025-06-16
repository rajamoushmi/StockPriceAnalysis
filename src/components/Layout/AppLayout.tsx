import React from 'react';
import { Box, Container, CssBaseline, ThemeProvider } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { theme } from '../../theme';
import AppHeader from './AppHeader';
import { StockProvider } from '../../context/StockContext';

const AppLayout: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <StockProvider>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            bgcolor: 'background.default'
          }}
        >
          <AppHeader />
          <Container maxWidth="xl" sx={{ flexGrow: 1, py: 3 }}>
            <Outlet />
          </Container>
        </Box>
      </StockProvider>
    </ThemeProvider>
  );
};

export default AppLayout;