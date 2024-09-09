import React, { useState } from 'react';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import { MenuItem, Grid, Stack, Typography, Button, Avatar, Box, FormControlLabel, Switch, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { IconGridDots } from '@tabler/icons';
import DashboardCard from 'src/components/shared/DashboardCard';
import CustomSelect from 'src/components/forms/theme-elements/CustomSelect';

const YearlyEnergyGenerated = () => {
  const [isAnnual, setIsAnnual] = useState(true);
  const [month, setMonth] = useState('All');
  const [openSubscribeDialog, setOpenSubscribeDialog] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleChange = (event) => {
    setMonth(event.target.value);
  };

  const handleToggle = () => {
    if (isAnnual) {
      setOpenSubscribeDialog(true);
    } else {
      setIsAnnual(true);
      setMonth('All');
    }
  };

  const handleCloseSubscribeDialog = () => {
    setOpenSubscribeDialog(false);
  };

  const handleSubscribe = () => {
    setIsSubscribed(true);
    setIsAnnual(false);
    setOpenSubscribeDialog(false);
  };

  const handleViewFullReport = () => {
    setOpenSubscribeDialog(true);
  };

  // chart color
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const secondary = theme.palette.secondary.main;

  // Energy data for each year
  const energyData = {
    '2023': { thermal: 2615, hydro: 1800 },
    '2022': { thermal: 2500, hydro: 1700 },
    '2021': { thermal: 2400, hydro: 1600 },
    '2020': { thermal: 2300, hydro: 1500 },
    '2019': { thermal: 2200, hydro: 1400 },
    '2018': { thermal: 2100, hydro: 1300 },
    '2017': { thermal: 2000, hydro: 1200 },
  };

  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

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
    grid: {
      show: false, 
    },
    yaxis: {
      title: {
        text: 'Energy (MW)'
      },
    },
    xaxis: {
      categories: ['2017', '2018', '2019', '2020', '2021', '2022', '2023'],
      axisBorder: {
        show: false,
      },
    },
    tooltip: {
      theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
      fillSeriesColor: false,
      y: {
        formatter: function (val) {
          return formatNumber(val) + " MW";
        }
      }
    },
  };

  const seriescolumnchart = [
    {
      name: 'Thermal Energy',
      data: Object.values(energyData).map(data => data.thermal),
    },
    {
      name: 'Hydro Energy',
      data: Object.values(energyData).map(data => data.hydro),
    },
  ];

  const totalThermal = formatNumber(energyData['2023'].thermal);
  const totalHydro = formatNumber(energyData['2023'].hydro);
  const totalEnergy = formatNumber(energyData['2023'].thermal + energyData['2023'].hydro);

  return (
    <DashboardCard
      title="Energy Generated"
      subtitle="Generation Source"
      action={
        <Box display="flex" alignItems="center">
          {!isAnnual && isSubscribed && (
            <CustomSelect
              labelId="month-dd"
              id="month-dd"
              size="small"
              value={month}
              onChange={handleChange}
            >
              <MenuItem value="All">All</MenuItem>
              {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month) => (
                <MenuItem key={month} value={month}>{month}</MenuItem>
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
                  {totalEnergy} MW
                </Typography>
                <Typography variant="subtitle2" color="textSecondary">
                  Total Energy Generated
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
                <Typography variant="h5">{totalThermal} MW</Typography>
                <Typography variant="subtitle1" color="textSecondary">
                  Thermal this year
                </Typography>
              </Box>
            </Stack>
            <Stack direction="row" spacing={2}>
              <Avatar
                sx={{ width: 9, mt: 1, height: 9, bgcolor: secondary, svg: { display: 'none' } }}
              ></Avatar>
              <Box>
                <Typography variant="h5">{totalHydro} MW</Typography>
                <Typography variant="subtitle1" color="textSecondary">
                  Hydro this year
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
