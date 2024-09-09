import React from 'react';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import { CardContent, Typography, Stack } from '@mui/material';
import BlankCard from '../../shared/BlankCard';

const EnergyDeliveredStates = () => {
  // Chart color
  const theme = useTheme();
  const primary = theme.palette.primary.main;

  // Chart
  const optionscolumnchart = {
    chart: {
      type: 'area',
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: '#adb0bb',
      toolbar: {
        show: false,
      },
      height: 120, 
      sparkline: {
        enabled: false, 
      },
    },
    colors: [primary],
    stroke: {
      curve: 'smooth',
      width: 1,
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    grid: {
      show: false,
    },
    xaxis: {
      categories: [ 'Mar', 'Apr', 'May', 'Jun'],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        show: true,
        style: {
          fontSize: '8px',
          fontFamily: "'Plus Jakarta Sans', sans-serif;",
        },
      },
    },
    yaxis: {
      show: false,
    },
    tooltip: {
      theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
      fillSeriesColor: false,
    },
    margin: {
      bottom: 30, 
    },
  };

  const seriescolumnchart = [
    {
      name: 'Energy Delivered',
      data: [180, 150, 110, 240],
    },
  ];

  return (
    <BlankCard>
      <CardContent sx={{ p: '30px' }}>
        <Typography variant="h4">1772</Typography>
        <Stack direction="row" spacing={2} justifyContent="space-between">
          <Typography variant="subtitle2" color="textSecondary" style={{ fontSize: '14px' }}>
            Energy Delivered (GWh)
          </Typography>
          <Typography variant="subtitle2" color="success.main">
            +1.20%
          </Typography>
        </Stack>
      </CardContent>
      <Chart options={optionscolumnchart} series={seriescolumnchart} type="area" height="120px" />
    </BlankCard>
  );
};

export default EnergyDeliveredStates;