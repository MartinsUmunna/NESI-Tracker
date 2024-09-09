import React from 'react';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import { Box, CardContent, Grid, Typography, Stack, Avatar } from '@mui/material';
import BlankCard from '../../shared/BlankCard';

const TechBreakdownTechnicalSBT = () => {
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const primarylight = theme.palette.primary.light;
  const secondary = theme.palette.secondary.main;
  const textColor = theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.8)' : '#2A3547';

  const barColors = ['#3B80B2', '#599BC8', '#77ADD2', '#95BED8', '#B3CEDE'];

  const createChartOptions = (title) => ({
    chart: {
      type: 'bar',
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      toolbar: {
        show: false,
      },
      height: 275,
    },
    plotOptions: {
      bar: {
        horizontal: true,
        dataLabels: {
          position: 'right',
        },
        distributed: true, // This enables different colors for each bar
      },
    },
    dataLabels: {
      enabled: true,
      textAnchor: 'start',
      style: {
        colors: [textColor],
      },
      formatter: function (val) {
        return val;
      },
      offsetX: 0,
    },
    xaxis: {
      categories: ["Band A", "Band B", "Band C", "Band D", "Band E"],
      labels: {
        style: {
          colors: textColor,
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: textColor,
        },
      },
    },
    colors: barColors,
    tooltip: {
      theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
      y: {
        formatter: function (val) {
          return val;
        },
      },
    },
    title: {
      text: title,
      align: 'center',
      style: {
        fontSize: '18px',
        fontWeight: 'bold',
        color: theme.palette.mode === 'dark' ? textColor : '#273E76',
      },
    },
    legend: {
      show: false, // This will remove the legend
    },
  });

  const feederNumbersSeries = [
    {
      name: 'Feeder Numbers',
      data: [42, 62, 30, 25, 14],
    },
  ];

  const loadReadingSeries = [
    {
      name: 'Load Reading',
      data: [5.2, 2.7, 3.5, 3.0, 2.9],
    },
  ];

  const customerNumbersSeries = [
    {
      name: 'Customer Numbers',
      data: [100, 150, 80, 70, 40],
    },
  ];

  return (
    <BlankCard>
      <CardContent sx={{ p: '30px' }}>
        <Stack direction="row" spacing={2} justifyContent="space-between">
          <Typography variant="h5">Tariff Metrics By Service Band</Typography>
          <Stack direction="row" spacing={2} mt={5} justifyContent="center">
            {["Band A", "Band B", "Band C", "Band D", "Band E"].map((band, index) => (
              <Stack key={band} direction="row" alignItems="center" spacing={1}>
                <Avatar sx={{ width: 9, height: 9, bgcolor: barColors[index], svg: { display: 'none' } }}></Avatar>
                <Box>
                  <Typography variant="subtitle2" fontSize="12px" fontWeight={700} color="textSecondary">
                    {band}
                  </Typography>
                </Box>
              </Stack>
            ))}
          </Stack>
        </Stack>

        <Grid container spacing={3} mt={2}>
          <Grid item xs={12} sm={4}>
            <BlankCard>
              <CardContent sx={{ p: '20px' }}>
                <Box>
                  <Chart 
                    options={createChartOptions('Feeder Numbers')} 
                    series={feederNumbersSeries} 
                    type="bar" 
                    height="275px" 
                  />
                </Box>
              </CardContent>
            </BlankCard>
          </Grid>
          <Grid item xs={12} sm={4}>
            <BlankCard>
              <CardContent sx={{ p: '20px' }}>
                <Box>
                  <Chart 
                    options={createChartOptions('Load Reading')} 
                    series={loadReadingSeries} 
                    type="bar" 
                    height="275px" 
                  />
                </Box>
              </CardContent>
            </BlankCard>
          </Grid>
          <Grid item xs={12} sm={4}>
            <BlankCard>
              <CardContent sx={{ p: '20px' }}>
                <Box>
                  <Chart 
                    options={createChartOptions('Customer Numbers')} 
                    series={customerNumbersSeries} 
                    type="bar" 
                    height="275px" 
                  />
                </Box>
              </CardContent>
            </BlankCard>
          </Grid>
        </Grid>
      </CardContent>
    </BlankCard>
  );
};

export default TechBreakdownTechnicalSBT;