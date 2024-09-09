import React from 'react';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import EnergyComparisonAllStatesDashboardWidgetCard from 'src/components/shared/EnergyComparisonAllStatesDashboardWidgetCard';
import { Grid } from '@mui/material';

const DistributionRevenueBilled = () => {
  const theme = useTheme();

  const averageATCC = [2.2, 3.8, 6.5, 5.9, 4.7, 3.8, 7.1]; 
  const years = ['2017', '2018', '2019', '2020', '2021', '2022', '2023'];

  const chartOptions = {
    chart: {
      type: 'bar', // Changed from 'line' to 'bar'
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: '#adb0bb',
      toolbar: {
        show: false,
      },
      height: 350,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%', // Adjust the column width
        endingShape: 'rounded',
        borderRadius: 7,
        dataLabels: {
          position: 'top',
        },
      },
    },
    dataLabels: {
      enabled: true, // Enable data labels for bars
      offsetY: -20,
      style: {
        fontSize: '12px',
        colors: [theme.palette.text.primary],
      },
      formatter: (val) => `₦${val.toFixed(1)}bn`,
    },
    colors: [theme.palette.primary.main], 
    
    xaxis: {
      categories: years,
      axisBorder: {
        show: false,
      },
    },
    yaxis: {
      tickAmount: 2, 
      min: 0,  
      labels: {
        formatter: (val) => `₦${val.toFixed(0)}bn`, 
        style: {
          colors: theme.palette.mode === 'dark' ? '#fff' : '#adb0bb',
        },
      },
    },
    grid: {
      yaxis: {
        lines: {
          show: false, 
        },
      },
    },
    tooltip: {
      y: {
        formatter: (val) => `₦${val.toFixed(2)}bn` 
      },
      theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
    },
    
  };

  return (
    <EnergyComparisonAllStatesDashboardWidgetCard title="Disco Revenue Billed">
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Chart
            options={chartOptions}
            series={[{ name: 'Revenue Billed', data: averageATCC }]} // Adjusted series name
            type="bar" // Changed from 'line' to 'bar'
            height="275px"
          />
        </Grid>
      </Grid>
    </EnergyComparisonAllStatesDashboardWidgetCard>
  );
};

export default DistributionRevenueBilled;
