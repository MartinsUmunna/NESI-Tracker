import React, { useState } from 'react';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import { Box, Typography, FormControlLabel, Switch, MenuItem, Select, FormControl, InputLabel, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import DashboardCard from 'src/components/shared/DashboardCard';  // Make sure the import path matches your project structure

const YearlyTransmissionLossFactor = () => {
  const theme = useTheme();
  const textColor = theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.8)' : '#2A3547';
  const borderColor = theme.palette.grey[100];

  const [isAnnual, setIsAnnual] = useState(true);
  const [selectedYear, setSelectedYear] = useState(2023);
  const [openSubscribeDialog, setOpenSubscribeDialog] = useState(false);

  const handleToggle = () => {
    if (isAnnual) {
      setOpenSubscribeDialog(true);
    } else {
      setIsAnnual(true);
    }
  };

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  const handleCloseSubscribeDialog = () => {
    setOpenSubscribeDialog(false);
  };

  const optionsLineChart = {
    chart: {
      type: 'line',
      height: 350,
      toolbar: {
        show: false,
      },
    },
    stroke: {
      width: 7,
      curve: 'smooth',
    },
    dataLabels: {
      enabled: false,
    },
    markers: {
      size: 5,
    },
    xaxis: {
      categories: isAnnual
        ? [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023]
        : ['Dec', 'Nov', 'Oct', 'Sep', 'Aug', 'Jul', 'Jun', 'May', 'Apr', 'Mar', 'Feb', 'Jan'],
      labels: {
        style: {
          colors: textColor,
        },
      },
    },
    yaxis: {
      tickAmount: 3,
      labels: {
        formatter: (val) => `${val}%`,
        style: {
          colors: textColor,
        },
      },
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        type: 'vertical',
        shadeIntensity: 0.9,
        gradientToColors: ['#FF0000', '#0000FF'],
        inverseColors: false,
        opacityFrom: 0.9,
        opacityTo: 0.5,
      },
    },
    tooltip: {
      theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
      y: {
        formatter: (val) => `${val}%`,
      },
    },
    legend: {
      position: 'bottom',
      labels: {
        colors: textColor,
      },
    },
    colors: ['#FF0000', '#0000FF'],
  };

  const seriesLineChart = [
    {
      name: 'Transmission Loss Factor',
      data: isAnnual
        ? [9, 12, 7, 9, 6, 14, 18, 7]
        : {
            2016: [0.6, 0.7, 0.8, 0.7, 0.6, 0.5, 0.6, 0.7, 0.8, 0.7, 0.6, 0.5],
            2017: [0.7, 0.8, 0.9, 0.8, 0.7, 0.6, 0.7, 0.8, 0.9, 0.8, 0.7, 0.6],
            2018: [0.8, 0.9, 1.0, 0.9, 0.8, 0.7, 0.8, 0.9, 1.0, 0.9, 0.8, 0.7],
            2019: [0.9, 1.0, 1.1, 1.0, 0.9, 0.8, 0.9, 1.0, 1.1, 1.0, 0.9, 0.8],
            2020: [1.0, 1.1, 1.2, 1.1, 1.0, 0.9, 1.0, 1.1, 1.2, 1.1, 1.0, 0.9],
            2021: [1.1, 1.2, 1.3, 1.2, 1.1, 1.0, 1.1, 1.2, 1.3, 1.2, 1.1, 1.0],
            2022: [1.2, 1.3, 1.4, 1.3, 1.2, 1.1, 1.2, 1.3, 1.4, 1.3, 1.2, 1.1],
            2023: [1.3, 1.4, 1.5, 1.4, 1.3, 1.2, 1.3, 1.4, 1.5, 1.4, 1.3, 1.2],
          }[selectedYear],
    },
    {
      name: 'MYTO Assumed TLF %',
      data: isAnnual
        ? [10.2, 10.5, 10.8, 11.0, 11.2, 11.5, 11.8, 12.0]
        : {
            2016: [10.2, 10.2, 10.2, 10.2, 10.2, 10.2, 10.2, 10.2, 10.2, 10.2, 10.2, 10.2],
            2017: [10.5, 10.5, 10.5, 10.5, 10.5, 10.5, 10.5, 10.5, 10.5, 10.5, 10.5, 10.5],
            2018: [10.8, 10.8, 10.8, 10.8, 10.8, 10.8, 10.8, 10.8, 10.8, 10.8, 10.8, 10.8],
            2019: [11.0, 11.0, 11.0, 11.0, 11.0, 11.0, 11.0, 11.0, 11.0, 11.0, 11.0, 11.0],
            2020: [11.2, 11.2, 11.2, 11.2, 11.2, 11.2, 11.2, 11.2, 11.2, 11.2, 11.2, 11.2],
            2021: [11.5, 11.5, 11.5, 11.5, 11.5, 11.5, 11.5, 11.5, 11.5, 11.5, 11.5, 11.5],
            2022: [11.8, 11.8, 11.8, 11.8, 11.8, 11.8, 11.8, 11.8, 11.8, 11.8, 11.8, 11.8],
            2023: [12.0, 12.0, 12.0, 12.0, 12.0, 12.0, 12.0, 12.0, 12.0, 12.0, 12.0, 12.0],
          }[selectedYear],
    },
  ];

  return (
    <DashboardCard
      title="Yearly Transmission Loss Factor"
      subtitle="Assessment of transmission loss rates and MYTO assumptions"
      action={
        <Box display="flex" alignItems="center">
          {!isAnnual && (
            <FormControl variant="outlined" sx={{ minWidth: 120, mr: 2 }}>
              <InputLabel id="year-select-label">Year</InputLabel>
              <Select
                labelId="year-select-label"
                value={selectedYear}
                onChange={handleYearChange}
                label="Year"
              >
                {[2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016].map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
          <FormControlLabel
            control={<Switch checked={isAnnual} onChange={handleToggle} name="toggleView" color="primary" />}
            label={isAnnual ? 'Annual' : 'Monthly'}
          />
        </Box>
      }
    >
      <Box mt={4} sx={{ position: 'relative' }}>
        <Chart options={optionsLineChart} series={seriesLineChart} type="line" height="350" />
        {!isAnnual && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              filter: 'blur(5px)',
              pointerEvents: 'none',
            }}
          />
        )}
      </Box>
      <Dialog open={openSubscribeDialog} onClose={handleCloseSubscribeDialog}>
        <DialogTitle>Subscribe to EMRC</DialogTitle>
        <DialogContent>
          <Typography>
            To access monthly data, please subscribe or sign up for EMRC services.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSubscribeDialog}>Cancel</Button>
          <Button onClick={handleCloseSubscribeDialog} color="primary">
            Subscribe
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardCard>
  );
};

export default YearlyTransmissionLossFactor;
