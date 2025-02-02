import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import { 
  Box, 
  Typography, 
  FormControlLabel, 
  Switch, 
  MenuItem, 
  Select, 
  FormControl, 
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from '@mui/material';
import EnergyComparisonAllStatesDashboardWidgetCard from 'src/components/shared/EnergyComparisonAllStatesDashboardWidgetCard';
import API_URL from '../../config/apiconfig';

const DistributionEnergyBilled = () => {
  const theme = useTheme();
  const textColor = theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.8)' : '#2A3547';
  const borderColor = theme.palette.grey[100];
  const primaryColor = theme.palette.primary.main;

  const [isAnnual, setIsAnnual] = useState(true);
  const [selectedYear, setSelectedYear] = useState(null);
  const [openSubscribeDialog, setOpenSubscribeDialog] = useState(false);
  const [data, setData] = useState([]);
  const [years, setYears] = useState([]);

  const formatNumber = (value) => {
    return new Intl.NumberFormat('en-US').format(Math.round(value));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_URL}/Yearly-Energy-Billed`);
      const sortedData = response.data.sort((a, b) => {
        if (a.Year !== b.Year) return b.Year - a.Year;
        const monthOrder = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        return monthOrder.indexOf(a.Month_Name) - monthOrder.indexOf(b.Month_Name);
      });
      setData(sortedData);
      const uniqueYears = [...new Set(sortedData.map(item => item.Year))].sort((a, b) => a - b);
      setYears(uniqueYears);
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

  const processData = (isAnnualView, selectedYear = null) => {
    if (isAnnualView) {
      const annualData = years.map(year => {
        const yearData = data.filter(item => item.Year === year);
        const total = yearData.reduce((sum, item) => sum + item.YearlyEnergyBilled, 0);
        return {
          year,
          total: Math.round(total)
        };
      });

      return {
        categories: annualData.map(item => item.year),
        series: [{
          name: 'Energy Billed',
          data: annualData.map(item => item.total)
        }]
      };
    } else {
      const monthOrder = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      
      const monthlyData = monthOrder.map(month => {
        const monthData = data.find(item => 
          item.Year === selectedYear && 
          item.Month_Name === month
        );
        return {
          month,
          value: monthData ? Math.round(monthData.YearlyEnergyBilled) : 0
        };
      });

      return {
        categories: monthlyData.map(item => item.month.substring(0, 3)),
        series: [{
          name: 'Energy Billed',
          data: monthlyData.map(item => item.value)
        }]
      };
    }
  };

  const chartData = processData(isAnnual, selectedYear);

  const options = {
    chart: {
      type: 'bar',
      height: 350,
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: '#adb0bb',
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        endingShape: 'rounded',
        borderRadius: 7,
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
        fontSize: '12px',
        colors: [textColor],
      },
      formatter: (val) => `${formatNumber(val)} GWh`,
    },
    xaxis: {
      categories: chartData.categories,
      axisBorder: {
        show: false,
      },
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
        formatter: (val) => `${formatNumber(val)} GWh`,
      },
    },
    tooltip: {
      theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
      y: {
        formatter: (val) => `${formatNumber(val)} GWh`,
      },
    },
    grid: {
      borderColor: borderColor,
    },
    colors: [primaryColor],
    legend: {
      position: 'bottom',
      labels: {
        colors: textColor,
      },
    },
  };

  return (
    <EnergyComparisonAllStatesDashboardWidgetCard
      title="Disco Energy Billed"
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
            control={
              <Switch 
                checked={isAnnual} 
                onChange={handleToggle} 
                name="toggleView" 
                color="primary" 
              />
            }
            label={isAnnual ? 'Annual' : 'Monthly'}
          />
        </Box>
      }
    >
      <Box mt={4}>
        <Chart
          options={options}
          series={chartData.series}
          type="bar"
          height="350px"
        />
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
    </EnergyComparisonAllStatesDashboardWidgetCard>
  );
};

export default DistributionEnergyBilled;