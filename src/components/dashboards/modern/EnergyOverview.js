import React from 'react';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import EnergyComparisonAllStatesDashboardWidgetCard from '../../shared/EnergyComparisonAllStatesDashboardWidgetCard';
import { Box, Button, Grid, Typography } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

const EnergyOverview = () => {
  const theme = useTheme();
  const primary = theme.palette.primary.main;

  const energyData = [
    { title: 'Delivered', value: 1772, change: 9, color: 'primary' },
    { title: 'Billed', value: 1263, change: 6, color: 'primary' },
    { title: 'Collected', value: 989, change: -14, color: 'primary' },
  ];

  const chartData = [
    {
      name: 'Delivered (GWh)',
      data: [124, 150, 200, 225],
    },
    {
      name: 'Billed (GWh)',
      data: [76, 55, 80, 160],
    },
    {
      name: 'Collected (GWh)',
      data: [46, 35, 50, 120],
    },
  ];

  const createChartOptions = (title) => ({
    chart: {
      type: 'bar',
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: '#adb0bb',
      toolbar: {
        show: false,
      },
      height: 350,
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: '45%',
        endingShape: 'rounded',
        dataLabels: {
          position: 'top'
        }
      },
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: '8px',
        colors: [theme.palette.mode === 'dark' ? '#fff' : '#000'],
      },
      offsetY: -20,
      formatter: function (val) {
        return val.toFixed(0);
      },
    },
    title: {
      text: title,
      align: 'center',
      style: {
        fontSize: '16px',
        fontWeight: 'bold',
        color: theme.palette.text.primary,
      },
    },
    xaxis: {
      categories: ['Mar', 'Apr', 'May', 'Jun'],
      axisBorder: {
        show: false,
      },
    },
    yaxis: {
      tickAmount: 3,
      labels: {
        style: {
          colors: theme.palette.mode === 'dark' ? '#fff' : '#adb0bb',
        },
      },
    },
    tooltip: {
      theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
    },
  });

  return (
    <EnergyComparisonAllStatesDashboardWidgetCard title="Energy Comparison">
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {energyData.map((item, index) => (
          <Grid item xs={12} sm={4} key={index}>
            <Button
              variant="contained"
              fullWidth
              sx={{
                bgcolor: theme.palette[item.color].light,
                color: theme.palette[item.color].main,
                '&:hover': {
                  bgcolor: theme.palette[item.color].main,
                  color: theme.palette[item.color].contrastText,
                },
                borderRadius: '50px',
                py: 1,
                textTransform: 'none',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <Typography variant="subtitle2">
                  {item.title}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="h6" fontWeight={600} mr={1}>
                    {item.value}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {item.change > 0 ? (
                      <TrendingUpIcon sx={{ color: theme.palette.success.main, fontSize: 16 }} />
                    ) : (
                      <TrendingDownIcon sx={{ color: theme.palette.error.main, fontSize: 16 }} />
                    )}
                    <Typography
                      variant="caption"
                      sx={{ color: item.change > 0 ? theme.palette.success.main : theme.palette.error.main, ml: 0.5 }}
                    >
                      {Math.abs(item.change)}%
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Button>
          </Grid>
        ))}
      </Grid>
      <Grid container spacing={2}>
        {chartData.map((data, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Chart
              options={createChartOptions(data.name)}
              series={[{ name: data.name, data: data.data, color: primary }]}
              type="bar"
              height="345px"
            />
          </Grid>
        ))}
      </Grid>
    </EnergyComparisonAllStatesDashboardWidgetCard>
  );
};

export default EnergyOverview;