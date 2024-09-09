import React from 'react';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import { Box, Typography, Tooltip, IconButton } from '@mui/material';
import DashboardCard from 'src/components/shared/DashboardCard'; 

const EnergyInjectionandDelivered = () => {
  const theme = useTheme();
  const textColor = theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.8)' : '#2A3547';
  const borderColor = theme.palette.grey[100];

  
  const tertiaryColor = '#3A6B35';  

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
        fontSize: '12px', 
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
    colors: [tertiaryColor, theme.palette.secondary.main]  
  };

  const seriesColumnChart = [
    {
      name: 'Energy Injected into Grid (GWh)',
      data: [23949, 21204, 16234, 13103, 29801, 25982, 21380, 26471],
    },
    {
      name: 'Energy Delivered to Discos and Exports (GWh)',
      data: [21748, 19781, 14782, 11001, 27462, 22220, 19590, 24335],
    },
  ];

  return (
    <DashboardCard
      title="Energy Injected and Delivered"
      subtitle="Tracking of energy flow from generation to distribution"
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

export default EnergyInjectionandDelivered;
