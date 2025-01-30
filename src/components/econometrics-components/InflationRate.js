import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import EnergyComparisonAllStatesDashboardWidgetCard from 'src/components/shared/EnergyComparisonAllStatesDashboardWidgetCard';
import { Grid, Box, CircularProgress } from '@mui/material';
import API_URL from '../../config/apiconfig';

const InflationRate = () => {
  const theme = useTheme();
  const [inflationData, setInflationData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/Core-Inflation-Rate`);
        const sortedData = response.data.sort((a, b) => a.YEAR - b.YEAR);
        setInflationData(sortedData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching inflation data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const chartOptions = {
    chart: {
      type: 'area',
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: theme.palette.text.secondary,
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
            color: theme.palette.primary.main,
            opacity: 0.3
          },
          {
            offset: 100,
            color: theme.palette.primary.main,
            opacity: 0
          }
        ]
      },
    },
    stroke: {
      curve: 'smooth',
      width: 1.5,
      colors: [theme.palette.primary.main],
    },
    dataLabels: {
      enabled: true,
      formatter: val => `${parseFloat(val).toFixed(1)}%`,
      position: 'top',
      offsetY: -10,
      style: {
        fontSize: '10px',
        fontWeight: 700,
        colors: [theme.palette.primary.main],
      },
      background: {
        enabled: false,
        foreColor: theme.palette.background.paper,
        padding: 4,
        borderRadius: 2,
        borderWidth: 1,
        borderColor: theme.palette.divider,
        opacity: 0.9,
      },
    },
    legend: { show: false },
    grid: {
      borderColor: theme.palette.divider,
      strokeDashArray: 3,
      xaxis: { lines: { show: false } },
    },
    yaxis: {
      min: 0,
      tickAmount: 4,
      labels: {
        formatter: (val) => `${val.toFixed(0)}%`,
        style: {
          colors: theme.palette.text.secondary,
        },
      },
    },
    xaxis: {
      categories: inflationData.map(item => item.YEAR.toString()),
      labels: { rotate: 0 },
      axisBorder: { show: false },
    },
    tooltip: {
      theme: theme.palette.mode,
      fillSeriesColor: false,
      y: {
        formatter: (val) => `${parseFloat(val).toFixed(2)}%`
      },
    },
  };

  const series = [{
    name: 'Inflation Rate',
    data: inflationData.map(item => parseFloat(item.CORE_INFLATION_RATE))
  }];

  return (
    <EnergyComparisonAllStatesDashboardWidgetCard title="Inflation Rate">
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box className="rounded-bars" sx={{ position: 'relative', minHeight: 375 }}>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 375 }}>
                <CircularProgress />
              </Box>
            ) : (
              <Chart
                options={chartOptions}
                series={series}
                type="area"
                height="375"
              />
            )}
          </Box>
        </Grid>
      </Grid>
    </EnergyComparisonAllStatesDashboardWidgetCard>
  );
};

export default InflationRate;