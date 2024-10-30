import React, { useState, useEffect, useMemo } from 'react';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import { CardContent, Typography, Grid, Slider, Stack, Box } from '@mui/material';
import BlankCard from 'src/components/shared/BlankCard';
import API_URL from 'src/config/apiconfig';

const WorldEnergyMix = () => {
  const theme = useTheme();
  const [data, setData] = useState([]);
  const [yearRange, setYearRange] = useState([0, 0]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}/World-Energy-Mix`);
        const jsonData = await response.json();
        setData(jsonData);

        // Set initial year range to last 5 years
        const years = [...new Set(jsonData.map(item => item.Year))].sort((a, b) => a - b);
        const lastYear = years[years.length - 1];
        setYearRange([lastYear - 4, lastYear]);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleChangeYearRange = (event, newValue) => {
    setYearRange(newValue);
  };

  const filteredData = useMemo(() => {
    return data.filter(({ Year }) => Year >= yearRange[0] && Year <= yearRange[1]);
  }, [data, yearRange]);

  const energySources = useMemo(() => {
    return [...new Set(data.map(item => item.Energy_Source))];
  }, [data]);

  const seriesBarChart = useMemo(() => {
    return energySources.map(source => ({
      name: source,
      data: filteredData
        .filter(item => item.Energy_Source === source)
        .map(({ Year, Energy_TWh }) => [Year, Math.round(Energy_TWh)])
    }));
  }, [filteredData, energySources]);

  const optionsBarChart = {
    chart: {
      type: 'bar',
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: '#adb0bb',
      toolbar: {
        show: false,
      },
    },
    colors: [
      theme.palette.primary.main,
      theme.palette.secondary.main,
      theme.palette.error.main,
      theme.palette.warning.main,
      theme.palette.info.main,
      theme.palette.success.main,
      theme.palette.grey[500],
      theme.palette.grey[700],
      theme.palette.grey[900],
    ],
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: false,
        columnWidth: '55%',
      },
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: true,
      position: 'bottom',
    },
    grid: {
      yaxis: {
        lines: {
          show: false,
        },
      },
    },
    xaxis: {
      type: 'numeric',
      categories: [...new Set(filteredData.map(item => item.Year))],
      labels: {
        formatter: function (val) {
          return `${parseInt(val)}`;
        },
      },
    },
    yaxis: {
      title: {
        text: 'Energy (TWh)',
      },
      labels: {
        formatter: val => `${Math.round(val)}`,
      },
    },
    tooltip: {
      theme: 'dark',
      y: {
        formatter: function (val) {
          return `${Math.round(val)} TWh`;
        },
      },
    },
  };

  return (
    <BlankCard>
      <CardContent sx={{ p: '25px', textAlign: 'left' }}>
        <Stack direction="column" spacing={2} alignItems="start">
          <Typography variant="h5">
            Energy Mix around the world from {yearRange[0]} to {yearRange[1]}
          </Typography>
          <Box width="100%">
            <Typography variant="subtitle1" gutterBottom>
              Select Year Range: {yearRange[0]} - {yearRange[1]}
            </Typography>
            <Slider
              value={yearRange}
              onChange={handleChangeYearRange}
              valueLabelDisplay="auto"
              min={Math.min(...data.map(item => item.Year))}
              max={Math.max(...data.map(item => item.Year))}
              marks={[
                { value: Math.min(...data.map(item => item.Year)), label: Math.min(...data.map(item => item.Year)) },
                { value: Math.max(...data.map(item => item.Year)), label: Math.max(...data.map(item => item.Year)) },
              ]}
            />
          </Box>
        </Stack>
        <Grid container spacing={0} mt={2}>
          <Grid item xs={12}>
            <Box mt={2}>
              <Chart
                options={optionsBarChart}
                series={seriesBarChart}
                type="bar"
                height="300px"
              />
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </BlankCard>
  );
};

export default WorldEnergyMix;