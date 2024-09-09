import React, { useState } from 'react';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import { Grid, Stack, Typography, Button, Avatar, Box, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { IconGridDots } from '@tabler/icons';
import DashboardCard from 'src/components/shared/DashboardCard';

const CustomerPopulationbyServiceBand = () => {
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const secondary = theme.palette.secondary.main;

  const [selectedYear, setSelectedYear] = useState('2023');
  const [selectedDisco, setSelectedDisco] = useState('All');

  const discos = ['All', 'AEDC', 'BEDC', 'EEDC', 'EKEDC', 'IBEDC', 'IEDC', 'JEDC', 'KDEDC', 'KEDC', 'PEDC', 'YEDC'];

  // Customer Population data
  const customerDataByYear = {
    '2017': { metered: [80, 70, 75, 73, 68], unmetered: [60, 65, 70, 75, 65] },
    '2018': { metered: [85, 75, 80, 78, 73], unmetered: [65, 70, 75, 80, 70] },
    '2019': { metered: [90, 80, 85, 83, 78], unmetered: [70, 75, 80, 85, 75] },
    '2020': { metered: [95, 85, 90, 88, 83], unmetered: [75, 80, 85, 90, 80] },
    '2021': { metered: [100, 90, 95, 93, 88], unmetered: [80, 85, 90, 95, 85] },
    '2022': { metered: [105, 95, 100, 98, 93], unmetered: [85, 90, 95, 100, 90] },
    '2023': { metered: [110, 100, 105, 103, 98], unmetered: [90, 95, 100, 105, 95] },
  };

  // Filter data by disco (this is a placeholder)
  const filteredData = (year, disco) => {
    const data = customerDataByYear[year];
    if (disco === 'All') return data;
    // Add actual filtering logic based on disco here
    return {
      metered: data.metered.map(val => Math.round(val * Math.random())),
      unmetered: data.unmetered.map(val => Math.round(val * Math.random())),
    };
  };

  const customerData = filteredData(selectedYear, selectedDisco);

  const optionscolumnchart = {
  chart: {
    type: 'bar',
    fontFamily: "'Plus Jakarta Sans', sans-serif;",
    foreColor: '#adb0bb',
    toolbar: { show: true },
    height: 370,
    stacked: true,
  },
  colors: [primary, secondary],
  plotOptions: {
    bar: {
      horizontal: false,
      barHeight: '60%',
      columnWidth: '20%',
      borderRadius: [6],
      borderRadiusApplication: 'end',
      borderRadiusWhenStacked: 'all',
    },
  },
  stroke: { show: false },
  dataLabels: {
    enabled: false,
    formatter: (value) => value.toLocaleString(), 
  },
  legend: { show: true },
  grid: {
    borderColor: 'rgba(0,0,0,0.1)',
    strokeDashArray: 3,
    xaxis: { lines: { show: false } },
    show: false,
  },
  yaxis: { title: { text: 'Customers' } },
  xaxis: {
    categories: ['Band A', 'Band B', 'Band C', 'Band D', 'Band E'],
    axisBorder: { show: false },
  },
  tooltip: {
    theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
    fillSeriesColor: false,
    y: {
      formatter: (value) => value.toLocaleString(), 
    },
  },
};
  const seriescolumnchart = [
    { name: 'Metered', data: customerData.metered },
    { name: 'Unmetered', data: customerData.unmetered },
  ];

  const totalMetered = customerData.metered.reduce((a, b) => a + b, 0);
  const totalUnmetered = customerData.unmetered.reduce((a, b) => a + b, 0);
  const totalCustomers = totalMetered + totalUnmetered;

  return (
    <DashboardCard title="">
      <Grid container spacing={2}>
        <Grid item xs={12} sm={8}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <FormControl fullWidth sx={{ width: '80%' }}>
                <InputLabel id="year-select-label">Year</InputLabel>
                <Select
                  labelId="year-select-label"
                  value={selectedYear}
                  label="Year"
                  onChange={(e) => setSelectedYear(e.target.value)}
                >
                  {Object.keys(customerDataByYear).map((year) => (
                    <MenuItem key={year} value={year}>{year}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth sx={{ width: '80%' }}>
                <InputLabel id="disco-select-label">Select Disco</InputLabel>
                <Select
                  labelId="disco-select-label"
                  value={selectedDisco}
                  label="Select Disco"
                  onChange={(e) => setSelectedDisco(e.target.value)}
                >
                  {discos.map((disco) => (
                    <MenuItem key={disco} value={disco}>{disco}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Box className="rounded-bars">
            <Chart
              options={optionscolumnchart}
              series={seriescolumnchart}
              type="bar"
              height="370px"
            />
          </Box>
          <Stack direction="row" spacing={3} justifyContent="space-between" sx={{ mt: 2 }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Box
                width={40}
                height={40}
                bgcolor="primary.light"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Typography color="primary" variant="h6" display="flex">
                  <IconGridDots width={21} />
                </Typography>
              </Box>
              <Box>
                <Typography variant="h3" fontWeight="700">
                  {totalCustomers.toLocaleString()} {/* Format with thousand separators */}
                </Typography>
                <Typography variant="subtitle2" color="textSecondary">
                  Total Customers
                </Typography>
              </Box>
            </Stack>
            <Stack direction="row" spacing={2}>
              <Avatar
                sx={{ width: 9, mt: 1, height: 9, bgcolor: primary, svg: { display: 'none' } }}
              ></Avatar>
              <Box>
                <Typography variant="h5">
                  {totalMetered.toLocaleString()} {/* Format with thousand separators */}
                </Typography>
                <Typography variant="subtitle1" color="textSecondary">
                  Total Metered
                </Typography>
              </Box>
            </Stack>
            <Stack direction="row" spacing={2}>
              <Avatar
                sx={{ width: 9, mt: 1, height: 9, bgcolor: secondary, svg: { display: 'none' } }}
              ></Avatar>
              <Box>
                <Typography variant="h5">
                  {totalUnmetered.toLocaleString()} {/* Format with thousand separators */}
                </Typography>
                <Typography variant="subtitle1" color="textSecondary">
                  Total Unmetered
                </Typography>
              </Box>
            </Stack>
          </Stack>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Button color="primary" variant="contained" sx={{ width: '200px' }}>
              View Full Report
            </Button>
          </Box>
        </Grid>
        {/* Text column */}
        <Grid item xs={12} sm={4}>
          <Typography variant="h4" gutterBottom>
            Customer Population by Service Band
          </Typography>
          <Typography variant="body1" paragraph>
            The distribution of customers across different service bands provides insights into the energy consumption patterns and service levels. This data helps in understanding the demand distribution and planning for service improvements accordingly.
          </Typography>
          <Typography variant="body1" paragraph>
            By analyzing these metrics, utilities can better manage resources and improve service quality. This information is crucial for optimizing energy distribution and enhancing overall operational efficiency.
          </Typography>
        </Grid>
      </Grid>
    </DashboardCard>
  );
  
};

export default CustomerPopulationbyServiceBand;
