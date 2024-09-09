import React from 'react';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import EnergyComparisonAllStatesDashboardWidgetCard from 'src/components/shared/EnergyComparisonAllStatesDashboardWidgetCard';
import { Grid } from '@mui/material';

const DistributionTariff = () => {
  const theme = useTheme();

  const averageTariff = [35, 40, 47, 45, 60, 60, 65]; 

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
        horizontal: false,
        columnWidth: '55%',
        endingShape: 'rounded',
        borderRadius: 7,
        dataLabels: {
          position: 'top',
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return "₦" + val.toFixed(0) + "/kWh";
      },
      style: {
        fontSize: '12px',
        colors: [theme.palette.mode === 'dark' ? '#fff' : '#000']
      },
      offsetY: -20,
      position: 'top', 
    },
    colors: [theme.palette.primary.main],
    
    xaxis: {
      categories: ['2017', '2018', '2019', '2020', '2021', '2022', '2023'],
      axisBorder: {
        show: false,
      },
    },
    yaxis: {
      title: {
        text: '₦/kWh'
      },
      labels: {
        formatter: (val) => `₦${val.toFixed(0)}`,
        style: {
          colors: theme.palette.mode === 'dark' ? '#fff' : '#adb0bb',
        },
      },
      tickAmount: 2, 
    },
    grid: {
      show: false, 
    },
    tooltip: {
      y: {
        formatter: (val) => `₦${val.toFixed(2)}/kWh`
      },
      theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
    },
  };

  return (
    <EnergyComparisonAllStatesDashboardWidgetCard title="Average Tariff">
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Chart
            options={chartOptions}
            series={[{ name: 'Average Tariff', data: averageTariff }]}
            type="bar"
            height="275px"
          />
        </Grid>
      </Grid>
    </EnergyComparisonAllStatesDashboardWidgetCard>
  );
};

export default DistributionTariff;