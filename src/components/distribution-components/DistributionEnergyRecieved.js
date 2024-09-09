import React from 'react';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import EnergyComparisonAllStatesDashboardWidgetCard from 'src/components/shared/EnergyComparisonAllStatesDashboardWidgetCard';
import { Grid } from '@mui/material';

const DistributionEnergyRecieved = () => {
  const theme = useTheme();

  const averageATCC = [252.2, 148.8, 280.5, 395.9, 500.7, 350.8, 467.1]; 
  const years = ['2017', '2018', '2019', '2020', '2021', '2022', '2023'];

  const chartOptions = {
    chart: {
      type: 'bar', 
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: '#adb0bb',
      toolbar: {
        show: false,
      },
      height: 350,
    },
    plotOptions: {
      bar: {
        borderRadius: 7, 
        columnWidth: '55%',
      endingShape: 'rounded',
        dataLabels: {
          position: 'top', 
        },
      },
    },
    dataLabels: {
      enabled: true,
      offsetY: -20, 
      style: {
        fontSize: '12px',
        colors: [theme.palette.text.primary],
      },
      formatter: (val) => `${val.toFixed(1)} GWh`, 
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
        formatter: (val) => `${val.toFixed(0)} GWh`, 
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
        formatter: (val) => `${val.toFixed(2)} GWh` 
      },
      theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
    },
  };

  return (
    <EnergyComparisonAllStatesDashboardWidgetCard title="Disco Energy Received">
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Chart
            options={chartOptions}
            series={[{ name: 'Energy Received', data: averageATCC }]}
            type="bar"
            height="275px"
          />
        </Grid>
      </Grid>
    </EnergyComparisonAllStatesDashboardWidgetCard>
  );
};

export default DistributionEnergyRecieved;
