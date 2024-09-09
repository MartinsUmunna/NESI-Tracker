import React from 'react';
import { useTheme } from '@mui/material/styles';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { useSelector } from 'react-redux';

const CommercialDashboardWidgetCard = ({
  title,
  subtitle,
  children,
  action,
}) => {
  const customizer = useSelector((state) => state.customizer);
  const theme = useTheme();
  const borderColor = theme.palette.grey[100];

  return (
    <Card
      sx={{ padding: 0, border: !customizer.isCardShadow ? `1px solid ${borderColor}` : 'none' }}
      elevation={customizer.isCardShadow ? 9 : 0}
      variant={!customizer.isCardShadow ? 'outlined' : undefined}
    >
      <CardContent sx={{ p: '30px' }}>
        {title && (
          <Box display="flex" justifyContent="space-between" mb={2}>
            <Box>
              <Typography variant="h5">{title}</Typography>
              {subtitle && (
                <Typography variant="subtitle2" color="textSecondary">
                  {subtitle}
                </Typography>
              )}
            </Box>
            {action && (
              <Box textAlign="right">
                {action}
              </Box>
            )}
          </Box>
        )}
        {children}
      </CardContent>
    </Card>
  );
};

export default CommercialDashboardWidgetCard;