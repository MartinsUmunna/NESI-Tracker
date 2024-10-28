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
import DashboardCard from 'src/components/shared/DashboardCard';

const EnergyInjectionandDelivered = () => {
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
      const response = await axios.get('http://localhost:5000/api/energy-injected-and-delivered');
      const sortedData = response.data.sort((a, b) => {
        if (a.Year !== b.Year) return b.Year - a.Year; // Sort years in descending order for processing
        const monthOrder = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        return monthOrder.indexOf(a.Month_Name) - monthOrder.indexOf(b.Month_Name);
      });
      setData(sortedData);
      const uniqueYears = [...new Set(sortedData.map(item => item.Year))].sort((a, b) => a - b); // Sort years in ascending order
      setYears(uniqueYears);
      setSelectedYear(uniqueYears[uniqueYears.length - 1]); // Set to most recent year
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
      // Process annual data in ascending order
      const annualData = years.map(year => {
        const yearData = data.filter(item => item.Year === year);
        
        const injectedTotal = yearData
          .filter(item => item.Energy_injected_and_Delivered === 'Energy Injected into Grid (GWh)')
          .reduce((sum, item) => sum + item.Energy, 0);
          
        const deliveredTotal = yearData
          .filter(item => item.Energy_injected_and_Delivered === 'Energy Delivered to DisCos & Exports (GWh)')
          .reduce((sum, item) => sum + item.Energy, 0);

        return {
          year,
          injected: Math.round(injectedTotal),
          delivered: Math.round(deliveredTotal)
        };
      });

      return {
        categories: annualData.map(item => item.year),
        series: [
          {
            name: 'Energy Injected into Grid (GWh)',
            data: annualData.map(item => item.injected)
          },
          {
            name: 'Energy Delivered to DisCos & Exports (GWh)',
            data: annualData.map(item => item.delivered)
          }
        ]
      };
    } else {
      const monthOrder = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      
      const monthlyData = monthOrder.map(month => {
        const injectedData = data.find(item => 
          item.Year === selectedYear && 
          item.Month_Name === month && 
          item.Energy_injected_and_Delivered === 'Energy Injected into Grid (GWh)'
        );
        
        const deliveredData = data.find(item => 
          item.Year === selectedYear && 
          item.Month_Name === month && 
          item.Energy_injected_and_Delivered === 'Energy Delivered to DisCos & Exports (GWh)'
        );

        return {
          month,
          injected: injectedData ? Math.round(injectedData.Energy) : 0,
          delivered: deliveredData ? Math.round(deliveredData.Energy) : 0
        };
      });

      return {
        categories: monthlyData.map(item => item.month.substring(0, 3)),
        series: [
          {
            name: 'Energy Injected into Grid (GWh)',
            data: monthlyData.map(item => item.injected)
          },
          {
            name: 'Energy Delivered to DisCos & Exports (GWh)',
            data: monthlyData.map(item => item.delivered)
          }
        ]
      };
    }
  };

  const chartData = processData(isAnnual, selectedYear);

  const options = {
    chart: {
      type: 'bar',
      height: 350,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '40%',
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
        colors: [textColor],
        fontSize: '12px',
      },
      formatter: (val) => formatNumber(val),
    },
    xaxis: {
      categories: chartData.categories,
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
        formatter: (val) => formatNumber(val),
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
    colors: [primaryColor, theme.palette.secondary.main],
    legend: {
      position: 'bottom',
      labels: {
        colors: textColor,
      },
    },
  };

  return (
    <DashboardCard
      title="Energy Sent out and Energy Delivered (GWh)"
      subtitle="Tracking of energy flow from generation to distribution"
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
    </DashboardCard>
  );
};

export default EnergyInjectionandDelivered;