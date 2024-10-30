import { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import {
  Grid,
  Stack,
  Typography,
  Button,
  Avatar,
  Box,
  FormControlLabel,
  Switch,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import { IconGridDots } from '@tabler/icons';
import DashboardCard from 'src/components/shared/DashboardCard';
import axios from 'axios';
import API_URL from 'src/config/apiconfig';

const GencoCapacity = () => {
  const [sourceFilter, setSourceFilter] = useState('All');
  const [openSubscribeDialog, setOpenSubscribeDialog] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [selectedGenco, setSelectedGenco] = useState('All');
  const [selectedMonth, setSelectedMonth] = useState('All');
  const [chartData, setChartData] = useState({ series: [], options: {} });
  const [gencos, setGencos] = useState([]);
  const [fetchedData, setFetchedData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isDefaultView, setIsDefaultView] = useState(true);

  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const secondary = theme.palette.secondary.main;

  const months = [
    'All', 'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const formatNumber = (num) => {
    return Math.floor(num).toLocaleString();
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (fetchedData) {
      prepareChartData();
      updateGencosList();
    }
  }, [sourceFilter, selectedGenco, selectedMonth, fetchedData, isDefaultView]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/installed-vs-available-capacity`);
      const data = response.data;
      setFetchedData(data);
      setErrorMessage('');
    } catch (error) {
      console.error('Error fetching genco data:', error);
      setErrorMessage('Failed to load data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const updateGencosList = () => {
    if (!fetchedData) return;

    let filteredData = fetchedData;

    if (sourceFilter !== 'All') {
      filteredData = filteredData.filter(item => item.Source === sourceFilter);
    }

    const uniqueGencos = [...new Set(filteredData.map(item => item.Plant))];
    setGencos(['All', ...uniqueGencos]);

    if (!uniqueGencos.includes(selectedGenco) && selectedGenco !== 'All') {
      setSelectedGenco('All');
    }
  };

  const calculateData = (data) => {
    if (data.length === 0) return { installedCapacity: 0, availableCapacity: 0 };

    // Group by plant to avoid double counting
    const plantGroups = data.reduce((groups, item) => {
      if (!groups[item.Plant]) {
        groups[item.Plant] = [];
      }
      groups[item.Plant].push(item);
      return groups;
    }, {});

    let totalInstalled = 0;
    let totalAvailable = 0;

    Object.values(plantGroups).forEach(plants => {
      // Take the first occurrence for installed capacity as it should be constant
      totalInstalled += plants[0].InstalledCapacity || 0;
      
      // For available capacity, take the unique values only
      const uniqueAvailable = [...new Set(plants.map(p => p.TotalAvailableCapacity))];
      totalAvailable += uniqueAvailable.reduce((sum, val) => sum + (val || 0), 0);
    });

    return {
      installedCapacity: totalInstalled,
      availableCapacity: totalAvailable
    };
  };

  const prepareChartData = () => {
    if (!fetchedData) return;

    let filteredData = [...fetchedData];

    // Apply source filter (Thermal/Hydro)
    if (sourceFilter !== 'All') {
      filteredData = filteredData.filter(item => item.Source === sourceFilter);
    }

    // Apply GENCO filter
    if (selectedGenco !== 'All') {
      filteredData = filteredData.filter(item => item.Plant === selectedGenco);
    }

    // Apply month filter
    if (selectedMonth !== 'All') {
      filteredData = filteredData.filter(item => item.Month_Name === selectedMonth);
    }

    const years = [...new Set(filteredData.map(item => item.Year))].sort((a, b) => a - b);
    
    const yearlyData = years.map(year => {
      const yearData = filteredData.filter(item => item.Year === year);
      return calculateData(yearData);
    });

    setChartData({
      series: [
        {
          name: 'Installed Capacity (MW)',
          type: 'column',
          data: yearlyData.map(data => data.installedCapacity),
        },
        {
          name: 'Available Capacity (MW)',
          type: 'bar',
          data: yearlyData.map(data => data.availableCapacity),
        },
      ],
      options: {
        chart: {
          height: 350,
          type: 'bar',
          stacked: false,
          toolbar: {
            show: false,
          },
          foreColor: theme.palette.mode === 'dark' ? '#fff' : '#000',
        },
        plotOptions: {
          bar: {
            columnWidth: '50%',
            dataLabels: {
              position: 'top',
            },
          },
        },
        dataLabels: {
          enabled: true,
          offsetY: -20,
          style: {
            fontSize: '12px',
            colors: [theme.palette.mode === 'dark' ? '#fff' : '#000']
          },
          formatter: function(val) {
            return formatNumber(val);
          },
          background: {
            enabled: false
          }
        },
        colors: [primary, secondary],
        stroke: {
          width: [0, 4],
        },
        grid: {
          show: false,
        },
        yaxis: {
          title: {
            text: 'Capacity (MW)',
          },
          labels: {
            formatter: function(val) {
              return formatNumber(val);
            },
          },
        },
        xaxis: {
          categories: years,
          title: {
            text: 'Year',
          },
          tickPlacement: 'on',
        },
        tooltip: {
          theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
          shared: true,
          intersect: false,
          y: {
            formatter: function(val) {
              return `${formatNumber(val)} MW`;
            },
          },
        },
      },
    });
  };

  const handleSourceFilterChange = () => {
    setSourceFilter(sourceFilter === 'THERMAL' ? 'HYDRO' : 'THERMAL');
    setSelectedGenco('All');
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const handleCloseSubscribeDialog = () => {
    setOpenSubscribeDialog(false);
  };

  const handleSubscribe = () => {
    setIsSubscribed(true);
    setOpenSubscribeDialog(false);
  };

  const handleGencoChange = (event) => {
    setSelectedGenco(event.target.value);
  };

  const handleViewFullReport = () => {
    if (!isSubscribed) {
      setOpenSubscribeDialog(true);
    }
  };

  const handleToggleView = () => {
    setIsDefaultView(!isDefaultView);
    if (isDefaultView) {
      setSourceFilter('All');
      setSelectedGenco('All');
      setSelectedMonth('All');
    }
  };

  const getLatestYearData = () => {
    if (!fetchedData) return { installedCapacity: 0, availableCapacity: 0 };

    let filteredData = [...fetchedData];

    if (sourceFilter !== 'All') {
      filteredData = filteredData.filter(item => item.Source === sourceFilter);
    }

    if (selectedGenco !== 'All') {
      filteredData = filteredData.filter(item => item.Plant === selectedGenco);
    }

    if (selectedMonth !== 'All') {
      filteredData = filteredData.filter(item => item.Month_Name === selectedMonth);
    }

    const latestYear = Math.max(...filteredData.map(item => item.Year));
    const latestYearData = filteredData.filter(item => item.Year === latestYear);
    
    return calculateData(latestYearData);
  };

  const { installedCapacity, availableCapacity } = getLatestYearData();

  return (
    <DashboardCard title="GENCO Capacity" subtitle="Installed vs Available Capacity">
      <Grid container spacing={3}>
        <Grid item xs={12} md={10}>
          <Stack spacing={3}>
            {isSubscribed && (
              <Stack direction="row" spacing={2} alignItems="center">
                <FormControlLabel
                  control={
                    <Switch
                      checked={!isDefaultView}
                      onChange={handleToggleView}
                      name="viewToggle"
                    />
                  }
                  label={isDefaultView ? "Default View" : "Detailed View"}
                />
                {!isDefaultView && (
                  <>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={sourceFilter === 'THERMAL'}
                          onChange={handleSourceFilterChange}
                          name="sourceFilter"
                        />
                      }
                      label={sourceFilter === 'THERMAL' ? 'Thermal' : 'Hydro'}
                    />
                    <FormControl variant="outlined" size="small" style={{ minWidth: 200 }}>
                      <InputLabel id="genco-select-label">GENCO Plant</InputLabel>
                      <Select
                        labelId="genco-select-label"
                        id="genco-select"
                        value={selectedGenco}
                        onChange={handleGencoChange}
                        label="GENCO Plant"
                      >
                        {gencos.map((genco) => (
                          <MenuItem key={genco} value={genco}>{genco}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl variant="outlined" size="small" style={{ minWidth: 200 }}>
                      <InputLabel id="month-select-label">Month</InputLabel>
                      <Select
                        labelId="month-select-label"
                        id="month-select"
                        value={selectedMonth}
                        onChange={handleMonthChange}
                        label="Month"
                      >
                        {months.map((month) => (
                          <MenuItem key={month} value={month}>{month}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </>
                )}
              </Stack>
            )}

            <Box className="rounded-bars">
              {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="370px">
                  <CircularProgress />
                </Box>
              ) : errorMessage ? (
                <Typography variant="body1" color="error">
                  {errorMessage}
                </Typography>
              ) : (
                <Chart
                  options={chartData.options}
                  series={chartData.series}
                  type="line"
                  height="370px"
                />
              )}
            </Box>
          </Stack>
        </Grid>

        <Grid item xs={12} md={2} container direction="column" justifyContent="space-between">
          <Stack spacing={3}>
            <Box>
              <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                <IconGridDots width={21} color={primary} />
                <Typography variant="subtitle2">
                  Installed this Year
                </Typography>
              </Stack>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ width: 9, height: 9, bgcolor: primary, svg: { display: 'none' } }}></Avatar>
                <Box>
                  <Typography variant="h4" fontWeight="700">
                    {formatNumber(installedCapacity)} MW
                  </Typography>
                  <Typography variant="subtitle2" color="textSecondary">
                    Total Installed Capacity
                  </Typography>
                </Box>
              </Stack>
            </Box>

            <Box>
              <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                <IconGridDots width={21} color={secondary} />
                <Typography variant="subtitle2">
                  Available this Year
                </Typography>
              </Stack>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ width: 9, height: 9, bgcolor: secondary, svg: { display: 'none' } }}></Avatar>
                <Box>
                  <Typography variant="h4" fontWeight="700">
                    {formatNumber(availableCapacity)} MW
                  </Typography>
                  <Typography variant="subtitle2" color="textSecondary">
                    Available Capacity
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Stack>

          <Box mt={3}>
            <Button
              color="primary"
              variant="contained"
              fullWidth
              onClick={handleViewFullReport}
            >
              View Full Report
            </Button>
          </Box>
        </Grid>
      </Grid>

      <Dialog open={openSubscribeDialog} onClose={handleCloseSubscribeDialog}>
        <DialogTitle>Subscribe to EMRC Services</DialogTitle>
        <DialogContent>
          <Typography>
            To access detailed GENCO data and view the full report, please subscribe to EMRC services.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSubscribeDialog}>Cancel</Button>
          <Button onClick={handleSubscribe} color="primary" variant="contained">
            Subscribe
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardCard>
  );
};

export default GencoCapacity;