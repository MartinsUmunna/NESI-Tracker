import React from 'react';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import EnergyComparisonAllStatesDashboardWidgetCard from 'src/components/shared/EnergyComparisonAllStatesDashboardWidgetCard';
import { Grid, Typography } from '@mui/material';

const IndustryEnergy = () => {
  const theme = useTheme();
  const primary = theme.palette.primary.main;


  const hourlyEnergyGenerated = [150, 145, 160, 170, 120, 145, 90, 100, 110, 120, 130, 140, 120, 60, 160, 190, 140, 210, 110, 120, 230, 140, 250, 260];

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayString = yesterday.toDateString();

  const averageEnergyGenerated = (hourlyEnergyGenerated.reduce((acc, value) => acc + value, 0) / hourlyEnergyGenerated.length).toFixed(2);

  const chartOptions = {
    chart: {
      type: 'area',
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: '#adb0bb',
      toolbar: {
        show: false,
      },
      height: 350,
    },
    stroke: {
      curve: 'smooth',
      width: 2,
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 0.92,
        opacityFrom: 0.7,
        opacityTo: 0.9,
        stops: [0, 90, 100],
      },
    },
    dataLabels: {
      enabled: false,
    },
    title: {
      text: `Average Energy Generated Yesterday: ${averageEnergyGenerated} MW`,
      align: 'center',
      style: {
        fontSize: '16px',
        fontWeight: 'bold',
        color: theme.palette.text.primary,
      },
    },
    subtitle: {
      text: `Yesterday (${yesterdayString})`,
      align: 'center',
      style: {
        fontSize: '14px',
        color: theme.palette.text.secondary,
      },
    },
    xaxis: {
      categories: Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`),
      axisBorder: {
        show: false,
      },
    },
    yaxis: {
      tickAmount: 2,
      labels: {
        formatter: (val) => `${val} MW`,
        style: {
          colors: theme.palette.mode === 'dark' ? '#fff' : '#adb0bb',
        },
      },
    },
    tooltip: {
      theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
    },
  };

  return (
    <EnergyComparisonAllStatesDashboardWidgetCard title="Energy Generated">
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Chart
            options={chartOptions}
            series={[{ name: 'Energy Generated (MW)', data: hourlyEnergyGenerated, color: primary }]}
            type="area"
            height="345px"
          />
        </Grid>
      </Grid>
    </EnergyComparisonAllStatesDashboardWidgetCard>
  );
};

export default IndustryEnergy;
