import React from 'react';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import EnergyComparisonAllStatesDashboardWidgetCard from 'src/components/shared/EnergyComparisonAllStatesDashboardWidgetCard';
import { Grid } from '@mui/material';

const DistributionEnergyBilled = () => {
  const theme = useTheme();

  const averageATCC = [252.2, 148.8, 280.5, 395.9, 500.7, 350.8, 467.1]; 
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
        columnWidth: '55%',
        endingShape: 'rounded',
        borderRadius: 7,
        dataLabels: {
          position: 'top', // Positions the data labels on top of the bars
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return `${val.toFixed(0)} GWh`; // Formats the data labels as "GWh"
      },
      style: {
        fontSize: '12px',
        colors: [theme.palette.mode === 'dark' ? '#fff' : '#000']
      },
      offsetY: -20, 
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
      show: false, 
    },
    tooltip: {
      y: {
        formatter: (val) => `${val.toFixed(2)} GWh` 
      },
      theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
    },
  };

  return (
    <EnergyComparisonAllStatesDashboardWidgetCard title="Disco Energy Billed">
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Chart
            options={chartOptions}
            series={[{ name: 'Energy Billed', data: averageATCC }]}
            type="bar"  // Changed from 'line' to 'bar'
            height="275px"
          />
        </Grid>
      </Grid>
    </EnergyComparisonAllStatesDashboardWidgetCard>
  );
};

export default DistributionEnergyBilled;
