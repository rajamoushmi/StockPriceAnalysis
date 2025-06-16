import React from 'react';
import { Box, Card, CardContent, Typography, Skeleton } from '@mui/material';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  loading?: boolean;
  icon?: React.ReactNode;
  color?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  loading = false,
  icon,
  color = 'primary.main'
}) => {
  return (
    <Card 
      elevation={1}
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 3
        }
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography 
              variant="subtitle2" 
              color="text.secondary" 
              gutterBottom
              sx={{ fontWeight: 500 }}
            >
              {title}
            </Typography>
            
            {loading ? (
              <Skeleton variant="text" width={100} height={40} />
            ) : (
              <Typography 
                variant="h5" 
                component="div"
                sx={{ 
                  fontWeight: 'bold',
                  color: color
                }}
              >
                {value}
              </Typography>
            )}
            
            {subtitle && (
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ mt: 1 }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>
          
          {icon && (
            <Box 
              sx={{ 
                color: color,
                opacity: 0.8,
                bgcolor: `${color}15`,
                p: 1,
                borderRadius: 1
              }}
            >
              {icon}
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default StatCard;