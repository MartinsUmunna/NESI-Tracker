import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import { MenuItem, Grid, Stack, Typography, Button, Avatar, Box, FormControlLabel, Switch, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { IconGridDots } from '@tabler/icons';
import DashboardCard from 'src/components/shared/DashboardCard';
import CustomSelect from 'src/components/forms/theme-elements/CustomSelect';
import axios from 'axios';

const YearlyEnergyGenerated = () => {
  const [isAnnual, setIsAnnual] = useState(true);
  const [year, setYear] = useState('');
  const [openSubscribeDialog, setOpenSubscribeDialog] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [energyData, setEnergyData] = useState({});
  const [yearOptions, setYearOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, [isAnnual]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const url = isAnnual
        ? 'http://localhost:5000/api/yearly-Energy-Sentout'
        : 'http://localhost:5000/api/Monthly-Energy-Sentout';
      const response = await axios.get(url);
      const formattedData = formatData(response.data);
      setEnergyData(formattedData);
      const years = Object.keys(formattedData).sort((a, b) => a - b);
      setYearOptions(years);
      setYear(prev => prev || years[years.length - 1]);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const formatData = (data) => {
    const formattedData = {};
    if (isAnnual) {
      data.forEach(item => {
        const year = item.Year.toString();
        if (!formattedData[year]) {
          formattedData[year] = { thermal: 0, hydro: 0 };
        }
        if (item.Energy_Source === 'THERMAL') {
          formattedData[year].thermal = item.YearlyAvgEnergy;
        } else if (item.Energy_Source === 'HYDRO') {
          formattedData[year].hydro = item.YearlyAvgEnergy;
        }
      });
    } else {
      data.forEach(item => {
        const year = item.Year.toString();
        if (!formattedData[year]) {
          formattedData[year] = { months: {} };
        }
        if (!formattedData[year].months[item.Month_Name]) {
          formattedData[year].months[item.Month_Name] = { thermal: 0, hydro: 0 };
        }
        if (item.Energy_Source === 'THERMAL') {
          formattedData[year].months[item.Month_Name].thermal = item.Total_Energy;
        } else if (item.Energy_Source === 'HYDRO') {
          formattedData[year].months[item.Month_Name].hydro = item.Total_Energy;
        }
      });
    }
    return formattedData;
  };

  const handleChangeYear = (event) => {
    setYear(event.target.value);
  };

  const handleToggle = () => {
    if (isAnnual) {
      setOpenSubscribeDialog(true);
    } else {
      setIsAnnual(true);
    }
  };

  const handleCloseSubscribeDialog = () => {
    setOpenSubscribeDialog(false);
  };

  const handleSubscribe = () => {
    setIsSubscribed(true);
    setIsAnnual(false);
    setOpenSubscribeDialog(false);
    fetchData(); // Fetch monthly data when subscribing
  };

  const handleViewFullReport = () => {
    setOpenSubscribeDialog(true);
  };

  // chart color
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const secondary = theme.palette.secondary.main;

  const formatNumber = (num) => {
    return Math.round(num).toLocaleString();
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography>Error: {error}</Typography>;
  }

  const monthOrder = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const seriescolumnchart = [
    {
      name: 'Thermal Energy',
      data: isAnnual
        ? yearOptions.map(y => Math.round(energyData[y]?.thermal || 0))
        : monthOrder.map(m => {
            const monthData = energyData[year]?.months?.[m];
            return Math.round(monthData?.thermal || 0);
          }),
    },
    {
      name: 'Hydro Energy',
      data: isAnnual
        ? yearOptions.map(y => Math.round(energyData[y]?.hydro || 0))
        : monthOrder.map(m => {
            const monthData = energyData[year]?.months?.[m];
            return Math.round(monthData?.hydro || 0);
          }),
    },
  ];

  const calculateTotalEnergy = () => {
    if (isAnnual) {
      return (energyData[year]?.thermal || 0) + (energyData[year]?.hydro || 0);
    } else {
      const monthlyData = energyData[year]?.months || {};
      return Object.values(monthlyData).reduce((sum, month) => sum + (month.thermal || 0) + (month.hydro || 0), 0) / 12;
    }
  };

  const totalEnergy = formatNumber(calculateTotalEnergy());
  const totalThermal = formatNumber(isAnnual 
    ? energyData[year]?.thermal || 0 
    : (energyData[year]?.months?.[monthOrder[monthOrder.length - 1]]?.thermal || 0));
  const totalHydro = formatNumber(isAnnual 
    ? energyData[year]?.hydro || 0 
    : (energyData[year]?.months?.[monthOrder[monthOrder.length - 1]]?.hydro || 0));

  // chart
  const optionscolumnchart = {
    chart: {
      type: 'bar',
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: '#adb0bb',
      toolbar: {
        show: true,
      },
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
    stroke: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    grid: {
      borderColor: 'rgba(0,0,0,0.1)',
      strokeDashArray: 3,
      xaxis: {
        lines: {
          show: false,
        },
      },
    },
    yaxis: {
      title: {
        text: 'Energy (MWh)',
      },
      labels: {
        formatter: (value) => Math.round(value),
      },
    },
    xaxis: {
      categories: isAnnual ? yearOptions : monthOrder,
      axisBorder: {
        show: false,
      },
    },
    tooltip: {
      theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
      fillSeriesColor: false,
      y: {
        formatter: function (val) {
          return formatNumber(val) + ' MWh';
        },
      },
    },
  };

  return (
    <DashboardCard
      title="Energy Sent Out"
      subtitle=""
      action={
        <Box display="flex" alignItems="center">
          {isSubscribed && (
            <CustomSelect
              labelId="year-dd"
              id="year-dd"
              size="small"
              value={year}
              onChange={handleChangeYear}
              sx={{ marginRight: 2 }}
            >
              {yearOptions.map((y) => (
                <MenuItem key={y} value={y}>{y}</MenuItem>
              ))}
            </CustomSelect>
          )}
          <FormControlLabel
            control={<Switch checked={isAnnual} onChange={handleToggle} name="toggleView" color="primary" />}
            label={isAnnual ? 'Annual' : 'Monthly'}
          />
        </Box>
      }
    >
      <Grid container spacing={3}>
        {/* column */}
        <Grid item xs={12} sm={10}>
          <Box className="rounded-bars">
            <Chart
              options={optionscolumnchart}
              series={seriescolumnchart}
              type="bar"
              height="370px"
            />
          </Box>
        </Grid>
        {/* column */}
        <Grid item xs={12} sm={2}>
          <Stack spacing={3} mt={3}>
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
                  {totalEnergy} MWh
                </Typography>
                <Typography variant="subtitle2" color="textSecondary">
                  {isAnnual ? 'Avg Total Energy Sent Out This Year' : 'Average Monthly Energy Sent Out'}
                </Typography>
              </Box>
            </Stack>
          </Stack>
          <Stack spacing={3} my={5}>
            <Stack direction="row" spacing={2}>
              <Avatar
                sx={{ width: 9, mt: 1, height: 9, bgcolor: primary, svg: { display: 'none' } }}
              ></Avatar>
              <Box>
                <Typography variant="h5">{totalThermal} MWh</Typography>
                <Typography variant="subtitle1" color="textSecondary">
                  Thermal {isAnnual ? 'this Year' : 'this Month'}
                </Typography>
              </Box>
            </Stack>
            <Stack direction="row" spacing={2}>
              <Avatar
                sx={{ width: 9, mt: 1, height: 9, bgcolor: secondary, svg: { display: 'none' } }}
              ></Avatar>
              <Box>
                <Typography variant="h5">{totalHydro} MWh</Typography>
                <Typography variant="subtitle1" color="textSecondary">
                  Hydro {isAnnual ? 'this Year' : 'this Month'}
                </Typography>
              </Box>
            </Stack>
          </Stack>
          <Button color="primary" variant="contained" fullWidth onClick={handleViewFullReport}>
            View Full Report
          </Button>
        </Grid>
      </Grid>
      <Dialog open={openSubscribeDialog} onClose={handleCloseSubscribeDialog}>
        <DialogTitle>Subscribe to EMRC Services</DialogTitle>
        <DialogContent>
          <Typography>
            To access monthly data and view the full report, please subscribe to EMRC services.
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

export default YearlyEnergyGenerated;