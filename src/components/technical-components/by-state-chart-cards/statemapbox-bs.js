import React from 'react';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import { MenuItem, Grid, Stack, Typography, Button, Avatar, Box, ButtonGroup } from '@mui/material';
import { IconGridDots } from '@tabler/icons';
import DashboardCard from '../../shared/DashboardCard';
import CustomSelect from '../../forms/theme-elements/CustomSelect';

const StateMapboxTechnicalBS = () => {
  const [month, setMonth] = React.useState('1');

  const handleChange = (event) => {
    setMonth(event.target.value);
  };

  // chart color
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const secondary = theme.palette.secondary.main;

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
      min: -5,
      max: 5,
      tickAmount: 4,
    },
    xaxis: {
      categories: ['16/08', '17/08', '18/08', '19/08', '20/08', '21/08', '22/08'],
      axisBorder: {
        show: false,
      },
    },
    tooltip: {
      theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
      fillSeriesColor: false,
    },
  };
  const seriescolumnchart = [
    {
      name: 'Eanings this month',
      data: [1.5, 2.7, 2.2, 3.6, 1.5, 1.0],
    },
    {
      name: 'Expense this month',
      data: [-1.8, -1.1, -2.5, -1.5, -0.6, -1.8],
    },
  ];

  return (
    <DashboardCard 
      title="Technical Breakdown By State"
      subtitle="Select a state"
      
    >
      <Grid container spacing={3}>
        {/* column */}
        <Grid item xs={12} sm={8}>
          <Box className="rounded-bars" bgcolor='#f7f8f9' height={500} >
            
          </Box>
        </Grid>
        {/* column */}
        <Grid item xs={12} sm={4} alignContent='center' alignItems='flex-end'>
          <Stack spacing={3} mt={3}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Box>
                <Typography variant="h3" fontWeight="700">
                 10 Hrs
                </Typography>
                <Typography variant="subtitle2" color="textSecondary">
                  Avg. Hours of Supply
                </Typography>
              </Box>
            </Stack>
          </Stack>
          

          <Stack spacing={3} mt={3}>
            <Stack direction="row" spacing={2}>
            <Box>
                <Typography variant="h3" fontWeight="700">
                    6 Hrs
                </Typography>
                <Typography variant="subtitle2" color="textSecondary">
                  Duration of Interruption
                </Typography>
              </Box>
            </Stack></Stack>


            <Stack direction="row" spacing={3} mt={3}>
            <Stack direction="row" spacing={2}>
              <Box>
                <Typography variant="h3" fontWeight="700">
                15 Hrs
                </Typography>
                <Typography variant="subtitle2" color="textSecondary">
                  Turnaround Time
                </Typography>
              </Box>
            </Stack>
          </Stack>

          <Stack spacing={3} mt={3}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Box>
                <Typography variant="h3" fontWeight="700">
                14
                </Typography>
                <Typography variant="subtitle2" color="textSecondary">
                  No. Daily Interruptions
                </Typography>
              </Box>
            </Stack>
          </Stack>

          <Stack spacing={3} mt={3}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Box>
                <Typography variant="h3" fontWeight="700">
                39011
                </Typography>
                <Typography variant="subtitle2" color="textSecondary">
                  Number of Faults
                </Typography>
              </Box>
            </Stack>
          </Stack>

          <Stack spacing={3} mt={3}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Box>
                <Typography variant="h3" fontWeight="700">
                185
                </Typography>
                <Typography variant="subtitle2" color="textSecondary">
                  Number of Feeders
                </Typography>
              </Box>
            </Stack>
          </Stack>
        </Grid>
      </Grid>
    </DashboardCard>
  );
};

export default StateMapboxTechnicalBS;
