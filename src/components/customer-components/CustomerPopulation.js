import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import { Grid, Stack, Typography, Button, Avatar, Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { IconGridDots } from '@tabler/icons';
import DashboardCard from 'src/components/shared/DashboardCard';
import API_URL from '../../config/apiconfig';

const CustomerPopulation = () => {
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const secondary = theme.palette.secondary.main;

  const [selectedDisco, setSelectedDisco] = useState('All');
  const [discos, setDiscos] = useState(['All']);
  const [customerData, setCustomerData] = useState({
    metered: [],
    unmetered: [],
    years: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(`${API_URL}/Disco-Customer-Number`);
      const data = await response.json();
      processData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const processData = (data) => {
    const discoSet = new Set(data.map(item => item.Discos));
    setDiscos(['All', ...Array.from(discoSet)]);

    const yearlyData = {};
    data.forEach(item => {
      const year = new Date(item.End_of_Quarter).getFullYear();
      if (!yearlyData[year]) {
        yearlyData[year] = {};
      }
      if (!yearlyData[year][item.Discos]) {
        yearlyData[year][item.Discos] = {
          metered: 0,
          unmetered: 0,
          latestMeteredQuarter: new Date(0),
          latestUnmeteredQuarter: new Date(0)
        };
      }
      const currentQuarter = new Date(item.End_of_Quarter);
      if (item.Customer_Type === 'Metered Customer' && currentQuarter > yearlyData[year][item.Discos].latestMeteredQuarter) {
        yearlyData[year][item.Discos].metered = item.Customer_Number;
        yearlyData[year][item.Discos].latestMeteredQuarter = currentQuarter;
      } else if (item.Customer_Type === 'Unmetered Customer' && currentQuarter > yearlyData[year][item.Discos].latestUnmeteredQuarter) {
        yearlyData[year][item.Discos].unmetered = item.Customer_Number;
        yearlyData[year][item.Discos].latestUnmeteredQuarter = currentQuarter;
      }
    });

    const years = Object.keys(yearlyData).sort();
    const allData = years.map(year => {
      const yearData = Object.values(yearlyData[year]);
      return {
        metered: yearData.reduce((sum, disco) => sum + disco.metered, 0),
        unmetered: yearData.reduce((sum, disco) => sum + disco.unmetered, 0)
      };
    });

    setCustomerData({
      metered: allData.map(d => d.metered),
      unmetered: allData.map(d => d.unmetered),
      years,
      yearlyData
    });
  };

  const filteredData = (disco) => {
    if (disco === 'All') {
      return {
        metered: customerData.metered,
        unmetered: customerData.unmetered,
        years: customerData.years
      };
    }
    const filteredMetered = [];
    const filteredUnmetered = [];
    customerData.years.forEach(year => {
      const discoData = customerData.yearlyData[year][disco];
      if (discoData) {
        filteredMetered.push(discoData.metered);
        filteredUnmetered.push(discoData.unmetered);
      } else {
        filteredMetered.push(0);
        filteredUnmetered.push(0);
      }
    });
    return {
      metered: filteredMetered,
      unmetered: filteredUnmetered,
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
    yaxis: {
      title: { text: 'Customers' },
      labels: {
        formatter: function (value) {
          return value.toLocaleString();
        }
      },
      min: 0,
      forceNiceScale: true,
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
          return value.toLocaleString();
        }
      }
    },
  };

  const seriescolumnchart = [
    { name: 'Metered', data: currentData.metered },
    { name: 'Unmetered', data: currentData.unmetered },
  ];

  const getLatestTotals = () => {
    if (selectedDisco === 'All') {
      const latestYear = customerData.years[customerData.years.length - 1];
      return {
        metered: customerData.metered[customerData.metered.length - 1],
        unmetered: customerData.unmetered[customerData.unmetered.length - 1],
        total: customerData.metered[customerData.metered.length - 1] + customerData.unmetered[customerData.unmetered.length - 1]
      };
    } else {
      const latestYear = customerData.years[customerData.years.length - 1];
      const latestData = customerData.yearlyData[latestYear][selectedDisco];
      return {
        metered: latestData ? latestData.metered : 0,
        unmetered: latestData ? latestData.unmetered : 0,
        total: latestData ? latestData.metered + latestData.unmetered : 0
      };
    }
  };

  const latestTotals = getLatestTotals();

  const handleDiscoChange = (event) => {
    setSelectedDisco(event.target.value);
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <DashboardCard title="">
      <Grid container spacing={3}>
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
                    {latestTotals.total.toLocaleString()}
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
                  <Typography variant="h5">{latestTotals.metered.toLocaleString()}</Typography>
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
                  <Typography variant="h5">{latestTotals.unmetered.toLocaleString()}</Typography>
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