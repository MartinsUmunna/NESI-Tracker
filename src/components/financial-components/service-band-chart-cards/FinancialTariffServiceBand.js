import React from 'react';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import EnergyComparisonAllStatesDashboardWidgetCard from '../../shared/EnergyComparisonAllStatesDashboardWidgetCard';

const FinancialTariffServiceBand = () => {
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const secondary = theme.palette.secondary.main;
  const tertiary = theme.palette.error.main;

  const optionscolumnchart = {
    chart: {
      type: 'bar',
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: '#adb0bb',
      toolbar: {
        show: false,
      },
      height: 650,
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: '45%',
        endingShape: 'rounded',
        grouped: true,
        dataLabels: {
          position: 'top'
        }
      },
    },
    dataLabels: {
      enabled: true,
      position: "top",
      style: {
        fontSize: '12px',
        colors: [theme.palette.mode === 'dark' ? '#fff' : '#000'],
      },
      offsetY: -20,
      formatter: function (val) {
        return '₦'+val.toFixed(0) + 'B';
      },
    },
    legend: {
      show: true,
    },
    grid: {
      yaxis: {
        lines: {
          show: false,
        },
      },
    },
    xaxis: {
      categories: ['Band A', 'Band B', 'Band C', 'Band D', 'Band E'],
      axisBorder: {
        show: false,
      },
    },
    yaxis: {
      tickAmount: 1,
      labels: {
        show: true,
        style: {
          colors: theme.palette.mode === 'dark' ? '#fff' : '#adb0bb',
        },
        formatter: function (val) {
          return '₦' +val.toFixed(0) + 'B';
        },
      },
    },
    tooltip: {
      theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
      y: {
        formatter: function(val) {
          return '₦' +val + 'B';
        }
      }
    },
  };
  
  const seriescolumnchart = [
    {
      name: 'Total Cost',
      data: [30, 8, 15,5,1],
      color: primary,
    },
    {
      name: 'Revenue Billed',
      data: [48, 10, 16,5,1],
      color: secondary,
    },
    {
      name: 'Collections',
      data: [33, 5, 5,2,0],
      color: tertiary,
    },
  ];

  return (
    <EnergyComparisonAllStatesDashboardWidgetCard title="Financial Comparison" sx={{ height: '250px' }}> 
      <Chart options={optionscolumnchart} series={seriescolumnchart} type="bar" height="580px" /> 
    </EnergyComparisonAllStatesDashboardWidgetCard>
  );
};

export default FinancialTariffServiceBand;