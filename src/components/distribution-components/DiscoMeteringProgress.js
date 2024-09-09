import * as React from 'react';
import { Box, Typography, Paper, IconButton, Tooltip, TextField, MenuItem } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ReactApexChart from 'react-apexcharts';
import InfoIcon from '@mui/icons-material/Info';

const initialData = [
  { genco: 'Abuja', metering: 75, metered: 65 },
  { genco: 'Benin', metering: 80, metered: 70 },
  { genco: 'Eko', metering: 90, metered: 85 },
  { genco: 'Enugu', metering: 78, metered: 72 },
  { genco: 'Ibadan', metering: 84, metered: 76 },
  { genco: 'Ikeja', metering: 91, metered: 87 },
  { genco: 'Jos', metering: 70, metered: 63 },
  { genco: 'Kaduna', metering: 75, metered: 68 },
  { genco: 'Kano', metering: 80, metered: 74 },
  { genco: 'Portharcourt', metering: 85, metered: 80 },
  { genco: 'Yola', metering: 65, metered: 60 },
  // Add other gencos with similar data format
];

const years = ["2023", "2022", "2021", "2020", "2019", "2018", "2017"];

const DiscoMeteringProgress = () => {
  const theme = useTheme();
  const [selectedYear, setSelectedYear] = React.useState('2023');

  const chartData = React.useMemo(() => {
    return initialData.map(item => ({
      disco: item.genco,
      metering: item.metering,
      metered: item.metered,
    }));
  }, []);

  const getChartOptions = () => ({
    chart: {
      type: 'bar',
      height: 350,
      toolbar: {
        show: false
      },
      background: 'transparent',
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: false,
        columnWidth: '40%',
        dataLabels: {
          position: 'top',
        },
      },
    },
    dataLabels: {
      enabled: true,
      offsetX: 0,
      offsetY: -20,
      style: {
        fontSize: '10px',
        colors: [theme.palette.text.primary]
      },
      formatter: (val) => `${val}%`,
    },
    xaxis: {
      categories: chartData.map(item => item.disco),
      labels: {
        style: {
          colors: [theme.palette.text.primary],
        }
      }
    },
    yaxis: {
      tickAmount: 5,
      labels: {
        style: {
          colors: [theme.palette.text.primary],
        }
      }
    },
    grid: {
      show: false
    },
    tooltip: {
      theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
    },
    colors: [theme.palette.primary.main, '#0E8A2C'], 
    legend: {
      show: true,
      position: 'bottom',
      horizontalAlign: 'center'
    }
  });

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2, p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>Disco Metering Status</Typography>
          <TextField
            select
            label="Select Year"
            value={selectedYear}
            onChange={handleYearChange}
            sx={{ marginRight: 2 }}
          >
            {years.map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </TextField>
          <Tooltip title="Select a color to view specific data for Metering and Metered Customers.">
            <IconButton>
              <InfoIcon color="primary" />
            </IconButton>
          </Tooltip>
        </Box>
        <ReactApexChart
          options={getChartOptions()}
          series={[
            { name: 'Metered Customers (%)', data: chartData.map(item => item.metering) },
            { name: 'UnMetered Customers (%)', data: chartData.map(item => item.metered) }
          ]}
          type="bar"
          height={350}
        />
      </Paper>
    </Box>
  );
};

export default DiscoMeteringProgress;
