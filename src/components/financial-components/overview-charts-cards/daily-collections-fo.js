import React from 'react';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import { Grid, Box } from '@mui/material';
import DashboardCard from '../../shared/DashboardCard';
import CustomTextField from '../../../components/forms/theme-elements/CustomTextField';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const DailyCollectionFinancialOverview = () => {
  const [month, setMonth] = React.useState('1');
  const [value, setValue] = React.useState(new Date());

  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const secondary = theme.palette.secondary.main;

  const optionscolumnchart = {
    chart: {
      type: 'area',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      foreColor: '#adb0bb',
      toolbar: { show: false },
      height: 370,
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        inverseColors: false,
        opacityFrom: 0.6,
        opacityTo: 0.1,
        stops: [0, 100],
        colorStops: [
          {
            offset: 0,
            color: primary,
            opacity: 0.3
          },
          {
            offset: 100,
            color: secondary,
            opacity: 0
          }
        ]
      },
    },
    stroke: {
      curve: 'smooth',
      width: 2,
    },
    dataLabels: {
      enabled: true,
      formatter: val => `₦${val}M`,
      position: 'top',
      offsetY: -10,
      style: {
        fontSize: '10px',
        fontWeight: 700,
        colors: ['#3b78a7'],
      },
      background: '#fff',
    },
    legend: { show: false },
    grid: {
      borderColor: 'rgba(0,0,0,0.1)',
      strokeDashArray: 3,
      xaxis: { lines: { show: false } },
    },
    yaxis: {
      min: 0,
      tickAmount: 4,
    },
    xaxis: {
      categories: Array.from({ length: 31 }, (_, i) => [`${i + 1}`]),
      labels: { rotate: 0 },
      axisBorder: { show: false },
    },
    tooltip: {
      theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
      fillSeriesColor: false,
    },
  };

  const seriescolumnchart = [
    {
      name: 'Daily Collections',
      data: [15, 27, 22, 36, 15, 10, 15, 27, 22, 36, 15, 27, 22, 36, 15, 10, 15, 27, 22, 36, 15, 27, 22, 15, 36, 15, 27, 22, 15, 36, 15],
    },
  ];

  return (
    <DashboardCard
      title="Daily Collections (₦)"
      subtitle=""
      action={
        <Grid item xs={2}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              renderInput={(props) => (
                <CustomTextField
                  {...props}
                  fullWidth
                  size="small"
                  sx={{
                    '& .MuiSvgIcon-root': {
                      width: '18px',
                      height: '18px',
                    },
                    '& .MuiFormHelperText-root': {
                      display: 'none',
                    },
                  }}
                />
              )}
              placeholder="DatePicker"
              value={value}
              onChange={setValue}
            />
          </LocalizationProvider>
        </Grid>
      }
    >
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box className="rounded-bars">
            <Chart
              options={optionscolumnchart}
              series={seriescolumnchart}
              type="area"
              height="390px"
            />
          </Box>
        </Grid>
      </Grid>
    </DashboardCard>
  );
};

export default DailyCollectionFinancialOverview;
