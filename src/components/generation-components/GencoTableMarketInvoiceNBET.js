import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Switch,
  FormControlLabel,
  MenuItem,
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  useMediaQuery,
} from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import ReactApexChart from 'react-apexcharts';
import API_URL from '../../config/apiconfig';
import ResponsiveEl from 'src/components/shared/ResponsiveEl';

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: 0,
  '&:first-of-type': {
    borderTopLeftRadius: theme.shape.borderRadius,
    borderBottomLeftRadius: theme.shape.borderRadius,
  },
  '&:last-of-type': {
    borderTopRightRadius: theme.shape.borderRadius,
    borderBottomRightRadius: theme.shape.borderRadius,
  },
  '&:not(:first-of-type)': {
    marginLeft: '-1px',
  },
  '&.Mui-selected': {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.getContrastText(theme.palette.secondary.main),
    '&:hover': {
      backgroundColor: theme.palette.secondary.dark,
    },
  },
}));

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

const formatNumber = (value) => {
  const billionValue = value / 1_000_000_000;
  return `₦${billionValue.toFixed(0)}b`;
};

const GencoTableMarketInvoiceNBET = () => {
  const theme = useTheme();
  const [data, setData] = useState([]);
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState('January');
  const [view, setView] = useState('invoice');
  const [compare, setCompare] = useState(false);
  const [isAnnual, setIsAnnual] = useState(true);
  const [openSubscribeDialog, setOpenSubscribeDialog] = useState(false);

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  // New state for fuel type filter
  const [selectedFuelType, setSelectedFuelType] = useState('ALL');
  const [fuelTypes, setFuelTypes] = useState(['ALL']);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_URL}/Genco-NBET-Remittances-Invoice`);
      const sortedData = response.data.sort((a, b) => {
        if (a.Year !== b.Year) return b.Year - a.Year;
        return months.indexOf(a.Month_Name) - months.indexOf(b.Month_Name);
      });
      setData(sortedData);

      // Extract unique years and fuel types
      const uniqueYears = [...new Set(sortedData.map((item) => item.Year))].sort((a, b) => b - a);
      const uniqueFuelTypes = ['ALL', ...new Set(sortedData.map((item) => item.Fuel_type))];

      setYears(uniqueYears);
      setFuelTypes(uniqueFuelTypes);
      setSelectedYear(uniqueYears[0]);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const processData = () => {
    if (!data.length) return { categories: [], series: [] };

    // Filter data based on year and fuel type
    const filteredData = data.filter(
      (item) =>
        item.Year === selectedYear &&
        (selectedFuelType === 'ALL' || item.Fuel_type === selectedFuelType),
    );

    if (isAnnual) {
      // Process annual data
      const annualData = {};
      filteredData.forEach((item) => {
        if (!annualData[item.Genco]) {
          annualData[item.Genco] = {
            invoice: 0,
            remittance: 0,
          };
        }
        annualData[item.Genco].invoice += item.GencoNbetInvoice;
        annualData[item.Genco].remittance += item.NBETPaymenttoGenco;
      });

      const gencos = Object.keys(annualData);
      return {
        categories: gencos,
        series: getSeriesData(
          gencos.map((genco) => ({
            invoice: annualData[genco].invoice,
            remittance: annualData[genco].remittance,
          })),
        ),
      };
    } else {
      // Process monthly data
      const monthlyData = {};
      filteredData.forEach((item) => {
        if (item.Month_Name === selectedMonth) {
          monthlyData[item.Genco] = {
            invoice: item.GencoNbetInvoice,
            remittance: item.NBETPaymenttoGenco,
          };
        }
      });

      const gencos = Object.keys(monthlyData);
      return {
        categories: gencos,
        series: getSeriesData(
          gencos.map((genco) => ({
            invoice: monthlyData[genco].invoice,
            remittance: monthlyData[genco].remittance,
          })),
        ),
      };
    }
  };

  const getSeriesData = (data) => {
    if (compare) {
      return [
        {
          name: 'Invoice',
          data: data.map((item) => item.invoice),
        },
        {
          name: 'Remittance',
          data: data.map((item) => item.remittance),
        },
      ];
    } else {
      return [
        {
          name: view === 'invoice' ? 'Invoice' : 'Remittance',
          data: data.map((item) => (view === 'invoice' ? item.invoice : item.remittance)),
        },
      ];
    }
  };

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const handleFuelTypeChange = (event) => {
    setSelectedFuelType(event.target.value);
  };

  const handleToggleCompare = () => {
    setCompare((prev) => !prev);
  };

  const handleToggleView = () => {
    if (isAnnual) {
      setOpenSubscribeDialog(true);
    } else {
      setIsAnnual(true);
    }
  };

  const handleCloseSubscribeDialog = () => {
    setOpenSubscribeDialog(false);
  };

  const handleSubscribe = () => {
    setIsAnnual(false);
    setOpenSubscribeDialog(false);
  };

  const chartData = processData();

  const getChartOptions = () => ({
    chart: {
      type: 'bar',
      height: isMobile ? 250 : 350,
      toolbar: { show: false },
      background: 'transparent',
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: isMobile, // Switch to horizontal on mobile
        columnWidth: isMobile ? '80%' : '40%',
        dataLabels: { position: isMobile ? 'right' : 'top' },
      },
    },
    dataLabels: {
      enabled: true,
      offsetX: isMobile ? 10 : 0,
      offsetY: isMobile ? 0 : -20,
      style: {
        fontSize: isMobile ? '8px' : '10px',
        colors: [theme.palette.text.primary],
      },
      formatter: (val) => formatNumber(val),
    },
    xaxis: {
      categories: chartData.categories,
      labels: {
        style: {
          colors: Array(chartData.categories.length).fill(theme.palette.text.primary),
        },
      },
    },
    yaxis: {
      tickAmount: 5,
      labels: {
        style: { colors: [theme.palette.text.primary] },
        formatter: (val) => formatNumber(val),
      },
    },
    grid: { show: false },
    tooltip: {
      theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
      y: { formatter: (val) => formatNumber(val) },
    },
    colors: compare
      ? [theme.palette.primary.main, theme.palette.secondary.main]
      : [view === 'invoice' ? theme.palette.primary.main : theme.palette.secondary.main],
    legend: { show: compare },
  });

  return (
    <Box
      sx={{
        p: isMobile ? 1 : 2,
        width: '100%',
        overflowX: 'auto',
      }}
    >
      {isMobile ? (
        <Stack spacing={2}>
          {/* Mobile Layout */}
          <Typography variant="h6" align="center" gutterBottom>
            Genco NBET Remittances and Invoice
          </Typography>

          {/* View Selection (Buttons) */}
          <Stack direction="row" spacing={1} justifyContent="center">
            <StyledButton
              fullWidth
              variant={view === 'invoice' ? 'contained' : 'outlined'}
              onClick={() => {
                setView('invoice');
                setCompare(false);
              }}
            >
              Genco Invoice
            </StyledButton>
            <StyledButton
              fullWidth
              variant={view === 'remittance' ? 'contained' : 'outlined'}
              onClick={() => {
                setView('remittance');
                setCompare(false);
              }}
            >
              Genco Remittance
            </StyledButton>
          </Stack>

          {/* Filters */}
          <Stack spacing={2}>
            <FormControl variant="outlined" size="small" fullWidth>
              <InputLabel>Year</InputLabel>
              <Select value={selectedYear || ''} onChange={handleYearChange} label="Year">
                {years.map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {!isAnnual && (
              <FormControl variant="outlined" size="small" fullWidth>
                <InputLabel>Month</InputLabel>
                <Select value={selectedMonth} onChange={handleMonthChange} label="Month">
                  {months.map((month) => (
                    <MenuItem key={month} value={month}>
                      {month}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            <FormControl variant="outlined" size="small" fullWidth>
              <InputLabel>Fuel Type</InputLabel>
              <Select value={selectedFuelType} onChange={handleFuelTypeChange} label="Fuel Type">
                {fuelTypes.map((fuelType) => (
                  <MenuItem key={fuelType} value={fuelType}>
                    {fuelType}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Toggles */}
            <Stack direction="column" spacing={1}>
              <FormControlLabel
                control={
                  <Switch checked={isAnnual} onChange={handleToggleView} name="viewToggle" />
                }
                label={isAnnual ? 'Annual' : 'Monthly'}
                sx={{ m: 0 }}
              />
              <FormControlLabel
                control={
                  <Switch checked={compare} onChange={handleToggleCompare} name="compareToggle" />
                }
                label="Compare"
                sx={{ m: 0 }}
              />
            </Stack>
          </Stack>
        </Stack>
      ) : (
        <Stack
          direction={isMobile ? 'column' : 'row'}
          justifyContent="space-between"
          alignItems="center"
          spacing={isMobile ? 2 : 0}
          mb={2}
        >
          <Typography
            variant="h6"
            align={isMobile ? 'center' : 'left'}
            gutterBottom
            sx={{ width: isMobile ? '100%' : 'auto' }}
          >
            Genco NBET Remittances and Invoice
          </Typography>

          <Stack
            direction={isMobile ? 'column' : 'row'}
            spacing={2}
            alignItems="center"
            sx={{ width: isMobile ? '100%' : 'auto' }}
          >
            <Stack direction="row" spacing={1} sx={{ width: isMobile ? '100%' : 'auto' }}>
              <StyledButton
                fullWidth={isMobile}
                variant={view === 'invoice' ? 'contained' : 'outlined'}
                onClick={() => {
                  setView('invoice');
                  setCompare(false);
                }}
              >
                Genco Invoice
              </StyledButton>
              <StyledButton
                fullWidth={isMobile}
                variant={view === 'remittance' ? 'contained' : 'outlined'}
                onClick={() => {
                  setView('remittance');
                  setCompare(false);
                }}
              >
                Genco Remittance
              </StyledButton>
            </Stack>

            <Stack
              direction={isMobile ? 'column' : 'row'}
              spacing={1}
              sx={{ width: isMobile ? '100%' : 'auto' }}
            >
              <FormControl variant="outlined" size="small" fullWidth={isMobile}>
                <InputLabel>Year</InputLabel>
                <Select value={selectedYear || ''} onChange={handleYearChange} label="Year">
                  {years.map((year) => (
                    <MenuItem key={year} value={year}>
                      {year}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {!isAnnual && (
                <FormControl variant="outlined" size="small" fullWidth={isMobile}>
                  <InputLabel>Month</InputLabel>
                  <Select value={selectedMonth} onChange={handleMonthChange} label="Month">
                    {months.map((month) => (
                      <MenuItem key={month} value={month}>
                        {month}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}

              <FormControl variant="outlined" size="small" fullWidth={isMobile}>
                <InputLabel>Fuel Type</InputLabel>
                <Select value={selectedFuelType} onChange={handleFuelTypeChange} label="Fuel Type">
                  {fuelTypes.map((fuelType) => (
                    <MenuItem key={fuelType} value={fuelType}>
                      {fuelType}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Stack
                direction={isMobile ? 'column' : 'row'}
                spacing={1}
                sx={{ width: isMobile ? '100%' : 'auto' }}
              >
                <FormControlLabel
                  control={
                    <Switch checked={isAnnual} onChange={handleToggleView} name="viewToggle" />
                  }
                  label={isAnnual ? 'Annual' : 'Monthly'}
                  sx={{ m: 0 }}
                />
                <FormControlLabel
                  control={
                    <Switch checked={compare} onChange={handleToggleCompare} name="compareToggle" />
                  }
                  label="Compare"
                  sx={{ m: 0 }}
                />
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      )}

      <ResponsiveEl>
        <ReactApexChart
          options={getChartOptions()}
          series={chartData.series}
          type="bar"
          height={isMobile ? 250 : 350}
        />
      </ResponsiveEl>

      {/* Dialog remains the same */}
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
    </Box>
  );
};

export default GencoTableMarketInvoiceNBET;
