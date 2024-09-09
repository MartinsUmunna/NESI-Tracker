import React from 'react';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import { Box, Typography, Tooltip, IconButton } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import DashboardCard from 'src/components/shared/DashboardCard'; 

const SystemCollapses = () => {
  const theme = useTheme();
  const textColor = theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.8)' : '#2A3547';
  const borderColor = theme.palette.grey[100];

  const optionsColumnChart = {
    chart: {
      type: 'bar',
      height: 350,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '40%',
        borderRadius: 7,
        dataLabels: {
          position: 'top',
        },
      },
    },
    dataLabels: {
      enabled: true,
      offsetX: 0,
      offsetY: -20,
      style: {
        colors: [textColor],
        fontSize: '16px',
      },
      formatter: (val) => `${val}`,  
    },
    xaxis: {
      categories: [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023],
      labels: {
        style: {
          colors: textColor,
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: textColor,
        },
      },
    },
    tooltip: {
      theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
    },
    grid: {
      borderColor: borderColor,
    },
    colors: [theme.palette.primary.main, theme.palette.secondary.main]  
  };

  const seriesColumnChart = [
    {
      name: 'Total System Collapses',
      data: [1, 2, 6, 3, 4, 2, 5, 3],
    },
    {
      name: 'Partial System Collapses',
      data: [3, 1, 0, 1, 2, 0, 2, 1],
    },
  ];

  return (
    <DashboardCard
      title="System Collapses"
      subtitle="Frequency of Grid Failures"
      action={null}
    >
      <Box mt={4}>
        <Chart
          options={optionsColumnChart}
          series={seriesColumnChart}
          type="bar"
          height="350px"
        />
      </Box>
    </DashboardCard>
  );
};

export default SystemCollapses;
