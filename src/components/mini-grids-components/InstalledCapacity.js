import React from 'react';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import { CardContent, Typography, Avatar, Grid, Stack, Box } from '@mui/material';
import BlankCard from 'src/components/shared/BlankCard';
import { IconArrowUpRight } from '@tabler/icons';


const InstalledCapacity = () => {
  // chart color
  const theme = useTheme();
  const primary = theme.palette.primary.main;

  // chart
  const optionscolumnchart = {
    chart: {
      type: 'bar',
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: '#adb0bb',
      toolbar: {
        show: false,
      },
    },
    colors: [primary],
    plotOptions: {
      bar: {
        borderRadius: 3,
        columnWidth: '65%',
        endingShape: 'rounded',
        dataLabels: {
          position: 'top',
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return val ;
      },
      style: {
        fontSize: '10px',
        colors: [theme.palette.mode === 'dark' ? '#fff' : '#000'],
      },
      offsetY: -20,
    },
    legend: {
      show: false,
    },
    grid: {
      yaxis: {
        lines: {
          show: false,
        },
      },
    },
    xaxis: {
      categories: [2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      labels: {
        style: {
          fontSize: '9px',
          fontWeight: 600,
        },
      },
    },
    yaxis: {
      show: false, // Hide y-axis
    },
    tooltip: {
      theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
      y: {
        formatter: function(val) {
          return  val + 'MWp';
        }
      }
    },
    title: {
      text: 'Yearly Trend',
      align: 'center',
      style: {
        fontSize: '14px',
        fontWeight: 600,
        color: theme.palette.mode === 'dark' ? '#fff' : '#000',
      },
    },
  };

  const seriescolumnchart = [
    {
      name: 'Capacity',
      data: [3,3,4,6, 6, 7, 10, 12, 15, 15, 18, 18], 
    },
  ];

  return (
    <BlankCard>
      <CardContent sx={{ p: '25px' }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="h5">Installed Capacity MWp</Typography>
        </Stack>

        <Grid container spacing={0} mt={2}>
  <Grid item xs={12}>
    <Typography variant="h4" mt={3} fontWeight={600}>18 MWp</Typography>
    <Typography variant="subtitle2" fontSize="10px" color="textSecondary">
      (last year)
    </Typography>
    <Stack direction="row" spacing={1} mt={1} alignItems="center">
      <Avatar sx={{ bgcolor: 'error.light', width: 20, height: 20 }}>
        <IconArrowUpRight width={16} color="#FA896B" />
      </Avatar>
      <Typography variant="subtitle2" color="textSecondary">
        +4%
      </Typography>
    </Stack>
  </Grid>
  <Grid item xs={12}> {/* Now using the full width */}
    <Box mt={2}>
      <Chart
        options={optionscolumnchart}
        series={seriescolumnchart}
        type="bar"
        height="125px"
      />
    </Box>
  </Grid>
</Grid>

      </CardContent>
    </BlankCard>
  );
};

export default InstalledCapacity;