import React from 'react';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import { IconArrowDownRight, IconGridDots } from '@tabler/icons';
import { Avatar, Stack, Typography, Box } from '@mui/material';

import CommercialDashboardWidgetCard from '../../shared/CommercialDashboardWidgetCard';

const BillingEfficiencyStates = () => {
  // chart color
  const theme = useTheme();
  const primary = theme.palette.primary.main;

  // gauge chart options
  const optionsGaugeChart = {
    chart: {
      height: 295,
      type: 'radialBar',
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: '#adb0bb',
    },
    plotOptions: {
      radialBar: {
        startAngle: -135,
        endAngle: 135,
        hollow: {
          margin: 0,
          size: '70%',
          background: theme.palette.background.default,
          image: undefined,
          imageOffsetX: 0,
          imageOffsetY: 0,
          position: 'front',
        },
        track: {
          background: theme.palette.grey[200],
          strokeWidth: '67%',
          margin: 0,
        },
        dataLabels: {
          show: true,
          name: {
            offsetY: -10,
            show: false,
            color: theme.palette.text.secondary,
            fontSize: '13px'
          },
          value: {
            formatter: function(val) {
              return parseInt(val) + '%';
            },
            color: theme.palette.text.primary,
            fontSize: '30px',
            show: true,
          }
        }
      }
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        type: 'horizontal',
        shadeIntensity: 0.5,
        gradientToColors: [primary],
        inverseColors: true,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100]
      }
    },
    stroke: {
      lineCap: 'round'
    },
    labels: ['Billing Efficiency'],
    colors: [primary],
  };

  const seriesGaugeChart = [71];
  const monthData = [
    { month: 'March', value: '76%', color: 'primary' },
    { month: 'April', value: '70%', color: 'secondary' },
    { month: 'May', value: '68%', color: 'warning' },
    { month: 'June', value: '79%', color: 'success' },
  ];

  return (
    <CommercialDashboardWidgetCard
      title="Billing Efficiency"
      subtitle={(
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="subtitle2" fontSize="12px" color="textSecondary">
            (last month)
          </Typography>
          <Avatar sx={{ bgcolor: 'error.light', width: 20, height: 20 }}>
            <IconArrowDownRight width={16} color="#FA896B" />
          </Avatar>
          <Typography variant="subtitle2" color="textSecondary">
            -4%
          </Typography>
        </Stack>
      )}
      action={
        <Box textAlign="right">
          <Typography variant="subtitle2" color="textSecondary">
            Target
          </Typography>
          <Typography variant="h6" fontWeight="bold">
            100%
          </Typography>
        </Box>
      }
    >
      <>
        <Chart 
          options={optionsGaugeChart} 
          series={seriesGaugeChart} 
          type="radialBar" 
          height="295px" 
        />
        <Stack direction="row" spacing={2} justifyContent="space-between" mt={2}>
          {monthData.map((item, index) => (
            <Stack key={index} direction="row" spacing={1} alignItems="center">
              <Box
                width={30}
                height={30}
                bgcolor={`${theme.palette[item.color].light}`}
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <IconGridDots width={18} color={theme.palette[item.color].main} />
              </Box>
              <Box>
                <Typography variant="h6" fontWeight="600" fontSize="0.875rem">
                  {item.value}
                </Typography>
                <Typography variant="subtitle2" color="textSecondary" fontSize="0.75rem">
                  {item.month}
                </Typography>
              </Box>
            </Stack>
          ))}
        </Stack>
      </>
    </CommercialDashboardWidgetCard>
  );
};

export default BillingEfficiencyStates;
