import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import EnergyComparisonAllStatesDashboardWidgetCard from 'src/components/shared/EnergyComparisonAllStatesDashboardWidgetCard';
import { Grid, Typography, CircularProgress } from '@mui/material';
import API_URL from 'src/config/apiconfig';

const DistributionTariff = () => {
  const theme = useTheme();
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTariffData = async () => {
      try {
        const response = await fetch(`${API_URL}/Yearly-Avg-Tariff`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setChartData(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching tariff data:', error);
        setError('Failed to load tariff data. Please try again later.');
        setLoading(false);
      }
    };

    fetchTariffData();
  }, []);

  if (loading) {
    return (
      <EnergyComparisonAllStatesDashboardWidgetCard title="Average Tariff">
        <Grid container justifyContent="center" alignItems="center" style={{ height: '275px' }}>
          <CircularProgress />
        </Grid>
      </EnergyComparisonAllStatesDashboardWidgetCard>
    );
  }

  if (error) {
    return (
      <EnergyComparisonAllStatesDashboardWidgetCard title="Average Tariff">
        <Grid container justifyContent="center" alignItems="center" style={{ height: '275px' }}>
          <Typography color="error">{error}</Typography>
        </Grid>
      </EnergyComparisonAllStatesDashboardWidgetCard>
    );
  }

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
      categories: chartData.map(item => item.Year.toString()),
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

  const series = [{
    name: 'Average Tariff',
    data: chartData.map(item => item.AVGTariff)
  }];

  return (
    <EnergyComparisonAllStatesDashboardWidgetCard title="Average Tariff">
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Chart
            options={chartOptions}
            series={series}
            type="bar"
            height="275px"
          />
        </Grid>
      </Grid>
    </EnergyComparisonAllStatesDashboardWidgetCard>
  );
};

export default DistributionTariff;