import React, { useState } from 'react';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import { MenuItem, Grid, Stack, Typography, Button, Avatar, Box, FormControlLabel, Switch, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { IconGridDots } from '@tabler/icons';
import DashboardCard from 'src/components/shared/DashboardCard';
import CustomSelect from 'src/components/forms/theme-elements/CustomSelect';

const GencoCapacity = () => {
  const [isAnnual, setIsAnnual] = useState(true);
  const [month, setMonth] = useState('All');
  const [openSubscribeDialog, setOpenSubscribeDialog] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleChange = (event) => {
    setMonth(event.target.value);
  };

  const handleToggle = () => {
    if (isAnnual) {
      if (!isSubscribed) {
        setOpenSubscribeDialog(true);
      } else {
        setIsAnnual(false);
        setMonth('All');
      }
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

  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  // chart
  const optionscolumnchart = {
    chart: {
      type: 'line',
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: '#adb0bb',
      toolbar: {
        show: false,
      },
      height: 370,
      stacked: false,
    },
    colors: [primary, secondary],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '20%',
        borderRadius: 6,
      },
    },
    stroke: {
      show: true,
      width: 2,
      curve: 'smooth',
    },
    dataLabels: {
      enabled: false,
    },
    grid: {
      show: false, 
    },
    legend: {
      show: true,
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
        text: 'Capacity (MW)',
      },
      lines: {
        show: false,
      },
    },
    xaxis: {
      categories: ['2017', '2018', '2019', '2020', '2021', '2022', '2023'],
      axisBorder: {
        show: false,
      },
      lines: {
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
      name: 'Installed Capacity',
      type: 'column',
      data: [13022, 12500, 12000, 11500, 11000, 10500, 10000].map(formatNumber),
    },
    {
      name: 'Energy Sent Out',
      type: 'line',
      data: [7000, 6700, 6800, 6700, 6100, 6500, 5700].map(formatNumber),
    },
  ];

  const totalInstalled = formatNumber(13022);
  const totalAvailable = formatNumber(7000);

  return (
    <DashboardCard
      title="GENCO Capacity"
      subtitle="Installed vs Energy Sent Out"
      action={
        <Box display="flex" alignItems="center">
          {isAnnual && isSubscribed && (
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
        <Grid item xs={12} sm={10}>
          <Box className="rounded-bars">
            <Chart
              options={optionscolumnchart}
              series={seriescolumnchart}
              type="line"
              height="370px"
            />
          </Box>
        </Grid>
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
                  {totalInstalled} MW
                </Typography>
                <Typography variant="subtitle2" color="textSecondary">
                  Total Installed Capacity 
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
                <Typography variant="h5">{totalInstalled} MW</Typography>
                <Typography variant="subtitle1" color="textSecondary">
                  Total Installed Capacity (2023)
                </Typography>
              </Box>
            </Stack>
            <Stack direction="row" spacing={2}>
              <Avatar
                sx={{ width: 9, mt: 1, height: 9, bgcolor: secondary, svg: { display: 'none' } }}
              ></Avatar>
              <Box>
                <Typography variant="h5">{totalAvailable} MW</Typography>
                <Typography variant="subtitle1" color="textSecondary">
                  Total Energy Sent Out (2023)
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

export default GencoCapacity;
