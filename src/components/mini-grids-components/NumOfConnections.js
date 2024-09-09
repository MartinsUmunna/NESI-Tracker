import React from 'react';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import { CardContent, Typography, Grid, Stack, Box } from '@mui/material';
import BlankCard from 'src/components/shared/BlankCard';

const NumOfConnections = () => {
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const secondary = theme.palette.secondary.main;
  const error = theme.palette.error.main;

  const optionslinechart = {
    chart: {
      type: 'line',
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: '#adb0bb',
      toolbar: {
        show: false,
      },
    },
    colors: [primary, secondary, error],
    stroke: {
      width: 3,
      curve: 'smooth',
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.9,
        stops: [0, 90, 100]
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
      categories: [2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      labels: {
        style: {
          fontSize: '9px',
          fontWeight: 600,
        },
      },
    },
    yaxis: {
      show: true,
      title: {
        text: 'Connections',
      },
    },
    tooltip: {
      theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
      y: {
        formatter: function(val) {
          return val ;
        }
      }
    },
   
  };

  const serieslinechart = [
    {
      name: 'Commercial',
      data: [1, 1, 2, 3, 3, 3, 4, 5, 6, 6, 7, 7],
    },
    {
      name: 'Residential',
      data: [5, 4, 3, 6, 3, 4, 5, 6, 9, 10, 8, 12],
    },
    {
      name: 'Productive',
      data: [0, 0, 0, 0, 0, 0, 1, 1, 2, 2, 3, 3],
    },
    {
      name: 'Public',
      data: [0, 3, 0, 2, 0, 0, 1, 1, 2, 2, 2, 3],
    },
  ];

  return (
    <BlankCard>
      <CardContent sx={{ p: '25px' }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="h5">Number of Connections</Typography>
        </Stack>
        <Grid container spacing={0} mt={2}>
          <Grid item xs={12}>
            <Box mt={2}>
              <Chart
                options={optionslinechart}
                series={serieslinechart}
                type="line"
                height="300px"
              />
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </BlankCard>
  );
};

export default NumOfConnections;