import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import { Grid, Stack, Typography, Button, Box, Select, MenuItem, FormControl, InputLabel, Dialog, DialogTitle, DialogContent, DialogActions, FormControlLabel, Switch } from '@mui/material';
import { IconGridDots } from '@tabler/icons';
import DashboardCard from 'src/components/shared/DashboardCard';
import axios from 'axios';
import API_URL from '../../config/apiconfig';

const CustomerPopulationbyServiceBand = () => {
  const theme = useTheme();
  const primary = theme.palette.primary.main;

  const [selectedYear, setSelectedYear] = useState('');
  const [selectedDisco, setSelectedDisco] = useState('AEDC');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [customerData, setCustomerData] = useState([]);
  const [years, setYears] = useState([]);
  const [discos, setDiscos] = useState([]);
  const [months, setMonths] = useState([]);
  const [notations, setNotations] = useState([]);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [openSubscribeDialog, setOpenSubscribeDialog] = useState(false);
  const [isAnnual, setIsAnnual] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_URL}/customerpopulationby-service-bands`);
      const data = response.data;
      setCustomerData(data);

      const uniqueYears = [...new Set(data.map(item => item.YEAR))].sort((a, b) => b - a);
      const uniqueDiscos = [...new Set(data.map(item => item.Disco))];
      const uniqueMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      const uniqueNotations = [...new Set(data.map(item => item.Notation))];

      setYears(uniqueYears);
      setDiscos(uniqueDiscos);
      setMonths(uniqueMonths);
      setNotations(uniqueNotations);
      setSelectedYear(uniqueYears[0].toString());
      setSelectedMonth(getLatestAvailableMonth(data, uniqueYears[0], 'AEDC'));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getLatestAvailableMonth = (data, year, disco) => {
    const yearData = data.filter(item => item.YEAR.toString() === year.toString() && item.Disco === disco);
    const availableMonths = [...new Set(yearData.map(item => item.MonthName))];
    return months.filter(month => availableMonths.includes(month)).pop() || 'December';
  };

  const filterData = () => {
    let filteredData = customerData.filter(item => item.YEAR.toString() === selectedYear && item.Disco === selectedDisco);

    if (!isAnnual && isSubscribed) {
      filteredData = filteredData.filter(item => item.MonthName === selectedMonth);
    }

    return filteredData;
  };

  const processChartData = () => {
    const filteredData = filterData();
    let chartData;

    if (isAnnual) {
      const latestMonth = getLatestAvailableMonth(customerData, selectedYear, selectedDisco);
      chartData = [{
        name: selectedDisco,
        data: notations.map(notation => {
          const notationData = filteredData.find(item => item.Notation === notation && item.MonthName === latestMonth);
          return notationData ? notationData['Total Customers'] : 0;
        })
      }];
    } else {
      chartData = [{
        name: selectedDisco,
        data: notations.map(notation => {
          const notationData = filteredData.find(item => item.Notation === notation && item.MonthName === selectedMonth);
          return notationData ? notationData['Total Customers'] : 0;
        })
      }];
    }

    return chartData;
  };

  const optionscolumnchart = {
    chart: {
      type: 'bar',
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: '#adb0bb',
      toolbar: { show: true },
      height: 370,
    },
    colors: [primary],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '50%',
        borderRadius: 6,
      },
    },
    stroke: { show: false },
    dataLabels: {
      enabled: false,
    },
    legend: { show: false },
    grid: {
      show: false,
    },
    yaxis: { 
      title: { text: 'Customers' },
      labels: {
        formatter: (value) => value.toLocaleString()
      }
    },
    xaxis: {
      categories: notations,
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

  const seriescolumnchart = processChartData();

  const getTotalCustomers = () => {
    const filteredData = filterData(); // This ensures the data is filtered according to the selected year and disco.
    const latestMonth = getLatestAvailableMonth(customerData, selectedYear, selectedDisco);
  
    if (isAnnual) {
      // Only consider data for the latest month in the selected year for annual view
      const latestMonthData = filteredData.filter(item => item.MonthName === latestMonth);
      return latestMonthData.reduce((sum, item) => sum + Number(item['Total Customers']), 0);
    } else {
      // Consider all data for the selected month in monthly view
      return filteredData.reduce((sum, item) => sum + Number(item['Total Customers']), 0);
    }
  };
  

  const totalCustomers = getTotalCustomers();

  const handleViewFullReport = () => {
    setOpenSubscribeDialog(true);
  };

  const handleCloseSubscribeDialog = () => {
    setOpenSubscribeDialog(false);
  };

  const handleSubscribe = () => {
    setIsSubscribed(true);
    setIsAnnual(false);
    setOpenSubscribeDialog(false);
  };

  const handleToggle = () => {
    if (isAnnual) {
      setOpenSubscribeDialog(true);
    } else {
      setIsAnnual(true);
    }
  };

  return (
    <DashboardCard title="">
      <Grid container spacing={2}>
        <Grid item xs={12} sm={8}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={3}>
              <FormControl fullWidth>
                <InputLabel id="year-select-label">Year</InputLabel>
                <Select
                  labelId="year-select-label"
                  value={selectedYear}
                  label="Year"
                  onChange={(e) => {
                    setSelectedYear(e.target.value);
                    setSelectedMonth(getLatestAvailableMonth(customerData, e.target.value, selectedDisco));
                  }}
                >
                  {years.map((year) => (
                    <MenuItem key={year} value={year.toString()}>{year}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={3}>
              <FormControl fullWidth>
                <InputLabel id="disco-select-label">Disco</InputLabel>
                <Select
                  labelId="disco-select-label"
                  value={selectedDisco}
                  label="Disco"
                  onChange={(e) => {
                    setSelectedDisco(e.target.value);
                    setSelectedMonth(getLatestAvailableMonth(customerData, selectedYear, e.target.value));
                  }}
                >
                  {discos.map((disco) => (
                    <MenuItem key={disco} value={disco}>{disco}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            {isSubscribed && !isAnnual && (
              <Grid item xs={3}>
                <FormControl fullWidth>
                  <InputLabel id="month-select-label">Month</InputLabel>
                  <Select
                    labelId="month-select-label"
                    value={selectedMonth}
                    label="Month"
                    onChange={(e) => setSelectedMonth(e.target.value)}
                  >
                    {months.map((month) => (
                      <MenuItem key={month} value={month}>{month}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}
            <Grid item xs={3}>
              <FormControlLabel
                control={<Switch checked={isAnnual} onChange={handleToggle} name="toggleView" color="primary" />}
                label={isAnnual ? 'Annual' : 'Monthly'}
              />
            </Grid>
          </Grid>
          <Box className="rounded-bars" mt={2}>
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
                  {totalCustomers.toLocaleString()}
                </Typography>
                <Typography variant="subtitle2" color="textSecondary">
                  Total Customers for {selectedDisco} in {isAnnual ? `${selectedYear} (${getLatestAvailableMonth(customerData, selectedYear, selectedDisco)})` : `${selectedMonth} ${selectedYear}`}
                </Typography>
              </Box>
            </Stack>
          </Stack>
        </Grid>
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
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Button color="primary" variant="contained" sx={{ width: '200px' }} onClick={handleViewFullReport}>
              View Full Report
            </Button>
          </Box>
        </Grid>
      </Grid>
      <Dialog open={openSubscribeDialog} onClose={handleCloseSubscribeDialog}>
        <DialogTitle>Subscribe to EMRC Services</DialogTitle>
        <DialogContent>
          <Typography>
            To access detailed monthly data, please subscribe to EMRC services.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSubscribeDialog}>Cancel</Button>
          <Button onClick={handleSubscribe} color="primary">
            Subscribe
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardCard>
  );
};

export default CustomerPopulationbyServiceBand;