import React from 'react';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import EnergyComparisonAllStatesDashboardWidgetCard from '../../shared/EnergyComparisonAllStatesDashboardWidgetCard';

const TechnicalMetricsStates = () => {
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
        return val.toFixed(0) + 'Hrs';
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
      categories: ['Kano', 'Katsina', 'Jigawa'],
      axisBorder: {
        show: false,
      },
    },
    yaxis: {
      tickAmount: 2,
      labels: {
        show: true,
        style: {
          colors: theme.palette.mode === 'dark' ? '#fff' : '#adb0bb',
        },
        formatter: function (val) {
          return val.toFixed(0) + 'Hrs';
        },
      },
    },
    tooltip: {
      theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
      y: {
        formatter: function(val) {
          return val + 'Hrs';
        }
      }
    },
  };
  
  const seriescolumnchart = [
    {
      name: 'Average Hours of Supply',
      data: [9, 9, 14],
      color: primary,
    },
    {
      name: 'Duration of Interuuption',
      data: [6, 6, 6],
      color: secondary,
    },
    {
      name: 'Turnaround Time',
      data: [14.59, 15.00, 15.00],
      color: tertiary,
    },
  ];

  return (
    <EnergyComparisonAllStatesDashboardWidgetCard title="Technical Comparison" sx={{ height: '250px' }}> 
      <Chart options={optionscolumnchart} series={seriescolumnchart} type="bar" height="580px" /> 
    </EnergyComparisonAllStatesDashboardWidgetCard>
  );
};

export default TechnicalMetricsStates;