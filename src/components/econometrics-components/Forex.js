import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useTheme } from '@mui/material/styles';
import Chart from 'react-apexcharts';
import {
  Grid,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  styled,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import EnergyComparisonAllStatesDashboardWidgetCard from 'src/components/shared/EnergyComparisonAllStatesDashboardWidgetCard';
import API_URL from '../../config/apiconfig';
import ResponsiveEl from 'src/components/shared/ResponsiveEl';

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  minWidth: 120,
  marginRight: theme.spacing(2),
}));

const Forex = () => {
  const theme = useTheme();
  const [data, setData] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [viewMode, setViewMode] = useState('yearly');
  const [openSubscribeDialog, setOpenSubscribeDialog] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_URL}/Foreign-Exchange-Rate`);
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const years = useMemo(() => {
    return [...new Set(data.map((item) => item.Year))].sort((a, b) => b - a); // Sort in descending order
  }, [data]);

  const processedData = useMemo(() => {
    const assets = ['Ifem_usd', 'bdc_usd', 'GB_Pounds', 'Euro'];
    const assetNames = ['IFEM (USD)', 'BDC (USD)', 'GB Pounds', 'EURO'];

    if (viewMode === 'yearly') {
      return assets.map((asset, index) => ({
        name: assetNames[index],
        data: years.map((year) => {
          const yearData = data.filter((item) => item.Year === year);
          const average = yearData.reduce((sum, item) => sum + item[asset], 0) / yearData.length;
          return parseFloat(average.toFixed(2));
        }),
      }));
    } else {
      const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ];
      return assets.map((asset, index) => ({
        name: assetNames[index],
        data: months.map((month) => {
          const monthData = data.find((item) => item.Year === selectedYear && item.Month === month);
          return monthData ? parseFloat(monthData[asset].toFixed(2)) : null;
        }),
      }));
    }
  }, [data, selectedYear, viewMode, years]);

  const chartOptions = {
    chart: {
      type: 'bar',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      foregroundColor: theme.palette.text.secondary,
      toolbar: {
        show: false,
      },
      height: 370,
    },
    colors: [
      theme.palette.primary.main,
      theme.palette.secondary.main,
      theme.palette.error.main,
      theme.palette.warning.main,
    ],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '40%',
        borderRadius: 7,
      },
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: true,
      position: 'top',
    },
    grid: {
      borderColor: theme.palette.divider,
      strokeDashArray: 3,
      xaxis: { lines: { show: false } },
    },
    yaxis: {
      title: {
        text: 'Exchange Rate (₦)',
      },
      labels: {
        formatter: (value) => value.toFixed(2),
      },
    },
    xaxis: {
      categories:
        viewMode === 'yearly'
          ? years
          : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    },
    tooltip: {
      theme: theme.palette.mode,
      y: {
        formatter: (val) => `₦${val.toFixed(2)}`,
      },
    },
  };

  const handleViewModeChange = (event) => {
    if (event.target.checked) {
      // Set the selected year to the latest year when switching to monthly view
      setSelectedYear(years[0]);
      setOpenSubscribeDialog(true);
    } else {
      setViewMode('yearly');
    }
  };

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  const handleCloseSubscribeDialog = () => {
    setOpenSubscribeDialog(false);
  };

  const handleSubscribe = () => {
    setViewMode('monthly');
    setOpenSubscribeDialog(false);
  };

  return (
    <EnergyComparisonAllStatesDashboardWidgetCard title="Foreign Exchange Rates">
      <Grid container spacing={2} justifyContent="flex-end" alignItems="center">
        <Grid item>
          <StyledFormControl size="small">
            <InputLabel>Year</InputLabel>
            <Select
              value={selectedYear}
              label="Year"
              onChange={handleYearChange}
              disabled={viewMode === 'yearly'}
            >
              {years.map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </StyledFormControl>
        </Grid>
        <Grid item>
          <FormControlLabel
            control={
              <Switch
                checked={viewMode === 'monthly'}
                onChange={handleViewModeChange}
                color="primary"
              />
            }
            label="Monthly View"
          />
        </Grid>
        <Grid item xs={12}>
          <Box className="rounded-bars">
            <ResponsiveEl>
              <Chart options={chartOptions} series={processedData} type="bar" height="400" />
            </ResponsiveEl>
            s
          </Box>
        </Grid>
      </Grid>

      <Dialog open={openSubscribeDialog} onClose={handleCloseSubscribeDialog}>
        <DialogTitle>Subscribe to EMRC Services</DialogTitle>
        <DialogContent>To access monthly data, please subscribe to EMRC Services.</DialogContent>
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

export default Forex;
