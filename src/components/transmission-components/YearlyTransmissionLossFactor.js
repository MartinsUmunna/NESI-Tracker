import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import { Box, Typography, FormControlLabel, Switch, MenuItem, Select, FormControl, InputLabel, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import DashboardCard from 'src/components/shared/DashboardCard';
import API_URL from '../../config/apiconfig';

const YearlyTransmissionLossFactor = () => {
  const theme = useTheme();
  const textColor = theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.8)' : '#2A3547';

  const [isAnnual, setIsAnnual] = useState(true);
  const [selectedYear, setSelectedYear] = useState(null);
  const [openSubscribeDialog, setOpenSubscribeDialog] = useState(false);
  const [data, setData] = useState([]);
  const [years, setYears] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_URL}/Transmission-Loss-Factor`);
      const sortedData = response.data.sort((a, b) => {
        if (a.YEAR !== b.YEAR) return b.YEAR - a.YEAR;
        const monthOrder = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        return monthOrder.indexOf(a.Month_Name) - monthOrder.indexOf(b.Month_Name);
      });
      setData(sortedData);
      const uniqueYears = [...new Set(sortedData.map(item => item.YEAR))].sort((a, b) => a - b);
      setYears(uniqueYears.slice(-5));
      setSelectedYear(uniqueYears[uniqueYears.length - 1]);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

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

  const handleSubscribe = () => {
    setIsAnnual(false);
    setOpenSubscribeDialog(false);
  };

  const getMonthlyData = (year, dataType) => {
    const monthOrder = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const yearData = data.filter(item => item.YEAR === year);
    return monthOrder.map(month => {
      const monthData = yearData.find(item => item.Month_Name === month);
      return monthData ? monthData[dataType] : null;
    });
  };

  const getAnnualData = (dataType) => {
    return years.map(year => {
      const yearData = data.filter(item => item.YEAR === year);
      if (yearData.length > 0) {
        const sum = yearData.reduce((acc, curr) => acc + curr[dataType], 0);
        return parseFloat((sum / yearData.length).toFixed(2));
      }
      return null;
    });
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
        ? years
        : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
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
        formatter: (val) => val !== null ? `${val}%` : 'No data',
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
        ? getAnnualData('TransmissionLossFactor')
        : getMonthlyData(selectedYear, 'TransmissionLossFactor'),
    },
    {
      name: 'MYTO Assumed TLF %',
      data: isAnnual
        ? getAnnualData('MYTOAssumedTLF')
        : getMonthlyData(selectedYear, 'MYTOAssumedTLF'),
    },
  ];

  return (
    <DashboardCard
      title="Transmission Loss Factor"
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
                {years.map((year) => (
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
      <Box mt={4}>
        <Chart options={optionsLineChart} series={seriesLineChart} type="line" height="350" />
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
          <Button onClick={handleSubscribe} color="primary">
            Subscribe
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardCard>
  );
};

export default YearlyTransmissionLossFactor;