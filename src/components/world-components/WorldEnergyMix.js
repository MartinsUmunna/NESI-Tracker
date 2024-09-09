import React, { useState, useMemo } from 'react';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import { CardContent, Typography, Grid, Slider, Stack, Box } from '@mui/material';
import BlankCard from 'src/components/shared/BlankCard';

const WorldEnergyMix = () => {
  const theme = useTheme();
  const [yearRange, setYearRange] = useState([2013, 2023]); // Updated year range

  const handleChangeYearRange = (event, newValue) => {
    setYearRange(newValue);
  };

  const mockData = Array.from({ length: 224 }, (_, i) => ({
    year: 1800 + i,
    biofuels: Math.round(Math.random() * 1000),
    solar: Math.round(Math.random() * 1000),
    wind: Math.round(Math.random() * 1000),
    hydropower: Math.round(Math.random() * 1000),
    nuclear: Math.round(Math.random() * 1000),
    gas: Math.round(Math.random() * 1000),
    oil: Math.round(Math.random() * 1000),
    coal: Math.round(Math.random() * 1000),
    traditionalBiomass: Math.round(Math.random() * 1000),
  }));

  const filteredData = useMemo(() => {
    return mockData.filter(({ year }) => year >= yearRange[0] && year <= yearRange[1]);
  }, [yearRange]);

  const seriesBarChart = [
    { name: 'Biofuels', data: filteredData.map(({ year, biofuels }) => [year, biofuels]) },
    { name: 'Solar', data: filteredData.map(({ year, solar }) => [year, solar]) },
    { name: 'Wind', data: filteredData.map(({ year, wind }) => [year, wind]) },
    { name: 'Hydropower', data: filteredData.map(({ year, hydropower }) => [year, hydropower]) },
    { name: 'Nuclear', data: filteredData.map(({ year, nuclear }) => [year, nuclear]) },
    { name: 'Gas', data: filteredData.map(({ year, gas }) => [year, gas]) },
    { name: 'Oil', data: filteredData.map(({ year, oil }) => [year, oil]) },
    { name: 'Coal', data: filteredData.map(({ year, coal }) => [year, coal]) },
    { name: 'Traditional biomass', data: filteredData.map(({ year, traditionalBiomass }) => [year, traditionalBiomass]) },
  ];

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
        borderRadius: 4, // Rounded corners for bars
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
      categories: filteredData.map(data => data.year),
      labels: {
        formatter: function (val) {
          return `${parseInt(val)}`
        },
      },
    },
    yaxis: {
      title: {
        text: 'Energy (TWh)',
      },
      labels: {
        formatter: val => `${Math.round(val)}`, // No decimals
      },
    },
    tooltip: {
      theme: 'dark',
      y: {
        formatter: function (val) {
          return `${val} TWh`;
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
          <Slider
            value={yearRange}
            onChange={handleChangeYearRange}
            valueLabelDisplay="auto"
            min={1800}
            max={2023}
          />
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
