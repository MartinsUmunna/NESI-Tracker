import React, { useState } from 'react';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import { Grid, Stack, Typography, Button, Avatar, Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { IconGridDots } from '@tabler/icons';
import DashboardCard from 'src/components/shared/DashboardCard';

const CustomerPopulation = () => {
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const secondary = theme.palette.secondary.main;

  const [selectedDisco, setSelectedDisco] = useState('All');

  const discos = ['All', 'AEDC', 'BEDC', 'EEDC', 'EKEDC', 'IBEDC', 'IEDC', 'JEDC', 'KDEDC', 'KEDC', 'PEDC', 'YEDC'];

  const customerData = {
    metered: [100, 90, 95, 93, 88, 95, 92],
    unmetered: [80, 85, 90, 95, 85, 80, 90],
    years: ['2017', '2018', '2019', '2020', '2021', '2022', '2023']
  };

  const filteredData = (disco) => {
    if (disco === 'All') return customerData;
    // This is a placeholder for actual filtering logic
    // You would need to implement actual filtering based on your data structure
    return {
      metered: customerData.metered.map(val => Math.round(val * Math.random())),
      unmetered: customerData.unmetered.map(val => Math.round(val * Math.random())),
      years: customerData.years
    };
  };

  const currentData = filteredData(selectedDisco);

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
    dataLabels: { enabled: false },
    legend: { show: true },
    grid: {
      borderColor: 'rgba(0,0,0,0.1)',
      strokeDashArray: 3,
      xaxis: { lines: { show: false } },
    },
    grid: {
      show: false, 
    },
    yaxis: {
      title: { text: 'Customers' },
      labels: {
        formatter: function (value) {
          return value.toLocaleString(); // Format y-axis labels with thousand separators
        }
      },
      min: 0, // Start y-axis from 0
      forceNiceScale: true, // Ensure nice round numbers on the axis
    },
    xaxis: {
      categories: currentData.years,
      axisBorder: { show: false },
    },
    tooltip: {
      theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
      fillSeriesColor: false,
      y: {
        formatter: function(value) {
          return value.toLocaleString(); // Format tooltip values with thousand separators
        }
      }
    },
  };

  const seriescolumnchart = [
    { name: 'Metered', data: currentData.metered },
    { name: 'Unmetered', data: currentData.unmetered },
  ];

  const totalMetered = currentData.metered.reduce((a, b) => a + b, 0);
  const totalUnmetered = currentData.unmetered.reduce((a, b) => a + b, 0);
  const totalCustomers = totalMetered + totalUnmetered;

  const handleDiscoChange = (event) => {
    setSelectedDisco(event.target.value);
  };

  return (
    <DashboardCard title="">
      <Grid container spacing={3}>
        {/* Text column */}
        <Grid item xs={12} sm={4}>
          <Typography variant="h4" gutterBottom>
            Total Customer Population
          </Typography>
          <Typography variant="body1" paragraph>
            Nigeria has made strides in diversifying its energy sources by investing in renewable energy, particularly solar power. Initiatives promoting solar projects and off-grid solutions have gained traction, aiming to improve access to electricity, especially in rural areas.
          </Typography>
          <Typography variant="body1" paragraph>
            Additionally, policy reforms have aimed to attract investments in the energy sector and promote privatization for increased efficiency. Despite these efforts, challenges persist, including inadequate infrastructure and ongoing issues with electricity access and reliability.
          </Typography>
        </Grid>
                {/* Chart and statistics column */}
                <Grid item xs={12} sm={8}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel id="disco-select-label" sx={{ color: theme.palette.mode === 'dark' ? 'white' : 'black' }}>Select Disco</InputLabel>
              <Select
                labelId="disco-select-label"
                id="disco-select"
                value={selectedDisco}
                label="Select Disco"
                onChange={handleDiscoChange}
                sx={{ 
                  color: theme.palette.mode === 'dark' ? 'white' : 'black',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.23)' : 'rgba(0, 0, 0, 0.23)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: theme.palette.mode === 'dark' ? 'white' : 'black',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: theme.palette.mode === 'dark' ? 'white' : 'black',
                  },
                }}
              >
                {discos.map((disco) => (
                  <MenuItem key={disco} value={disco}>{disco}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Box className="rounded-bars">
            <Chart
              options={optionscolumnchart}
              series={seriescolumnchart}
              type="bar"
              height="370px"
            />
          </Box>
          <Box sx={{ mt: 2 }}>
            <Stack direction="row" spacing={3} justifyContent="space-between">
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
                    {totalCustomers.toLocaleString()}
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
                  <Typography variant="h5">{totalMetered.toLocaleString()}</Typography>
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
                  <Typography variant="h5">{totalUnmetered.toLocaleString()}</Typography>
                  <Typography variant="subtitle1" color="textSecondary">
                    Total Unmetered
                  </Typography>
                </Box>
              </Stack>
            </Stack>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Button color="primary" variant="contained" sx={{ width: '200px' }}>
                View Full Report
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </DashboardCard>
  );
};

export default CustomerPopulation;

