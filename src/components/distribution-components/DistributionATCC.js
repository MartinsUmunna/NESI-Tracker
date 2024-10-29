import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import axios from 'axios'; // Import axios for API calls
import EnergyComparisonAllStatesDashboardWidgetCard from 'src/components/shared/EnergyComparisonAllStatesDashboardWidgetCard';
import { Grid, Box } from '@mui/material';
import API_URL from 'src/config/apiconfig';

const DistributionATCC = () => {
  const theme = useTheme();

  const [averageATCC, setAverageATCC] = useState([]); // State for ATCC values
  const [years, setYears] = useState([]); // State for years

  useEffect(() => {
    // Fetch data from the API
    const fetchATCCData = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/Yearly-AVG-ATCC`);
        const data = response.data;

        // Extract years and ATCC values from the response
        const fetchedYears = data.map(item => item.Year);
        const fetchedATCC = data.map(item => item.ATCC);

        setYears(fetchedYears); // Set the x-axis categories (years)
        setAverageATCC(fetchedATCC); // Set the ATCC data
      } catch (error) {
        console.error('Error fetching ATCC data:', error);
      }
    };

    fetchATCCData(); 
  }, []); 

  const chartOptions = {
    chart: {
      type: 'area',
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: '#adb0bb',
      toolbar: { show: false },
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
            color: '#FF0000',
            opacity: 0.3
          },
          {
            offset: 100,
            color: '#FF0000',
            opacity: 0
          }
        ]
      },
    },
    stroke: {
      curve: 'smooth',
      width: 2,
      colors: ['#FF0000'],  
    },
    dataLabels: {
      enabled: true,
      formatter: val => `${val.toFixed(1)}%`,
      position: 'top',
      offsetY: -10,
      style: {
        fontSize: '10px',
        fontWeight: 700,
        colors: ['#FF0000'],
      },
      background: '#fff',
    },
    legend: { show: false },
    grid: {
      borderColor: 'rgba(0,0,0,0.1)',
      strokeDashArray: 3,
      xaxis: { lines: { show: false } },
    },
    yaxis: {
      min: 0,
      tickAmount: 4,
      labels: {
        formatter: (val) => `${val.toFixed(0)}%`,
        style: {
          colors: theme.palette.mode === 'dark' ? '#fff' : '#adb0bb',
        },
      },
    },
    xaxis: {
      categories: years, 
      labels: { rotate: 0 },
      axisBorder: { show: false },
    },
    tooltip: {
      theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
      fillSeriesColor: false,
      y: {
        formatter: (val) => `${val.toFixed(2)}%`
      },
    },
  };

  return (
    <EnergyComparisonAllStatesDashboardWidgetCard title="Average ATCC">
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box className="rounded-bars">
            <Chart
              options={chartOptions}
              series={[{ name: 'ATCC', data: averageATCC }]} 
              type="area"
              height="275"
            />
          </Box>
        </Grid>
      </Grid>
    </EnergyComparisonAllStatesDashboardWidgetCard>
  );
};

export default DistributionATCC;
