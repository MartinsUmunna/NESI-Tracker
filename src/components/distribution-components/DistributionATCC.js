import React from 'react';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import EnergyComparisonAllStatesDashboardWidgetCard from 'src/components/shared/EnergyComparisonAllStatesDashboardWidgetCard';
import { Grid, Box } from '@mui/material';

const DistributionATCC = () => {
  const theme = useTheme();

  const averageATCC = [52.2, 48.8, 60.5, 39.9, 62.7, 50.8, 67.1]; 

  const chartOptions = {
    chart: {
      type: 'area',
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: '#adb0bb',
      toolbar: {
        show: false,
      },
      height: 370,
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        inverseColors: false,
        opacityFrom: 0.6,
        opacityTo: 0.1,
        stops: [0, 100],
        colorStops: [
          {
            offset: 0,
            color: '#FF0000',
            opacity: 0.3
          },
          {
            offset: 100,
            color: '#FF0000',
            opacity: 0
          }
        ]
      },
    },
    stroke: {
      curve: 'smooth',
      width: 2,
      colors: ['#FF0000'],  // Set the stroke color to red
    },
    dataLabels: {
      enabled: true,
      formatter: val => `${val.toFixed(1)}%`,
      position: 'top',
      offsetY: -10,
      style: {
        fontSize: '10px',
        fontWeight: 700,
        colors: ['#FF0000'],
      },
      background: '#fff',
    },
    legend: { show: false },
    grid: {
      borderColor: 'rgba(0,0,0,0.1)',
      strokeDashArray: 3,
      xaxis: { lines: { show: false } },
    },
    yaxis: {
      min: 0,
      tickAmount: 4,
      labels: {
        formatter: (val) => `${val.toFixed(0)}%`,
        style: {
          colors: theme.palette.mode === 'dark' ? '#fff' : '#adb0bb',
        },
      },
    },
    xaxis: {
      categories: ['2017', '2018', '2019', '2020', '2021', '2022', '2023'],
      labels: { rotate: 0 },
      axisBorder: { show: false },
    },
    tooltip: {
      theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
      fillSeriesColor: false,
      y: {
        formatter: (val) => `${val.toFixed(2)}%`
      },
    },
  };

  return (
    <EnergyComparisonAllStatesDashboardWidgetCard title="Average ATCC">
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box className="rounded-bars">
            <Chart
              options={chartOptions}
              series={[{ name: 'ATCC', data: averageATCC }]}
              type="area"
              height="275"
            />
          </Box>
        </Grid>
      </Grid>
    </EnergyComparisonAllStatesDashboardWidgetCard>
  );
};

export default DistributionATCC;
