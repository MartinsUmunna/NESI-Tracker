import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import { 
  CardContent, 
  Typography, 
  Grid, 
  Stack, 
  Box, 
  Avatar,
  Select,
  MenuItem,
  FormControl
} from '@mui/material';
import BlankCard from 'src/components/shared/BlankCard';
import { IconGridDots } from '@tabler/icons';

const NumOfConnections = () => {
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const secondary = theme.palette.secondary.main;
  const error = theme.palette.error.main;
  const warning = theme.palette.warning.main;

  const [chartData, setChartData] = useState({
    years: [],
    commercialData: [],
    residentialData: [],
    productiveData: [],
    publicData: [],
  });
  
  const [selectedYear, setSelectedYear] = useState(null);
  const [yearlyData, setYearlyData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/MiniGrids-Number-of-Connections');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        const yearlyBreakdown = data.reduce((acc, curr) => {
          if (!acc[curr.Year]) {
            acc[curr.Year] = {
              commercial: 0,
              residential: 0,
              productive: 0,
              public: 0,
              year: curr.Year
            };
          }
          
          const type = curr.Type.toLowerCase();
          acc[curr.Year][type] = parseInt(curr.NumofConnections) || 0;
          return acc;
        }, {});

        const processedData = {
          years: [],
          commercialData: [],
          residentialData: [],
          productiveData: [],
          publicData: [],
        };

        const sortedYears = Object.keys(yearlyBreakdown).sort((a, b) => a - b);
        sortedYears.forEach(year => {
          processedData.years.push(year);
          processedData.commercialData.push(yearlyBreakdown[year].commercial);
          processedData.residentialData.push(yearlyBreakdown[year].residential);
          processedData.productiveData.push(yearlyBreakdown[year].productive);
          processedData.publicData.push(yearlyBreakdown[year].public);
        });

        setChartData(processedData);
        setYearlyData(yearlyBreakdown);
        const latestYear = sortedYears[sortedYears.length - 1];
        setSelectedYear(latestYear);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setFetchError(err.message);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  const optionsStackedChart = {
    chart: {
      type: 'bar',
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: '#adb0bb',
      toolbar: { show: false },
      height: 370,
      stacked: true,
    },
    colors: [primary, secondary, error, warning],
    plotOptions: {
      bar: {
        horizontal: false,
        barHeight: '60%',
        columnWidth: '20%',
        borderRadius: [6],
        borderRadiusApplication: 'end',
        borderRadiusWhenStacked: 'all',
      },
    },
    stroke: { show: false },
    dataLabels: { enabled: false },
    legend: { show: true },
    grid: { show: false },
    yaxis: {
      title: { text: 'Number of Connections' },
      labels: {
        formatter: function (value) {
          return value.toLocaleString();
        }
      },
      min: 0,
      forceNiceScale: true,
    },
    xaxis: {
      categories: chartData.years,
      axisBorder: { show: false },
    },
    tooltip: {
      theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
      fillSeriesColor: false,
      y: {
        formatter: function(value) {
          return value.toLocaleString();
        }
      }
    },
  };

  const seriesStackedChart = [
    {
      name: 'Commercial',
      data: chartData.commercialData,
    },
    {
      name: 'Residential',
      data: chartData.residentialData,
    },
    {
      name: 'Productive',
      data: chartData.productiveData,
    },
    {
      name: 'Public',
      data: chartData.publicData,
    },
  ];

  const totalConnections = selectedYear && yearlyData[selectedYear]
    ? Object.entries(yearlyData[selectedYear])
        .filter(([key]) => key !== 'year')
        .reduce((acc, [_, value]) => acc + value, 0)
    : 0;

  if (fetchError) {
    return (
      <BlankCard>
        <CardContent>
          <Typography color="error">Error loading data: {fetchError}</Typography>
        </CardContent>
      </BlankCard>
    );
  }

  if (isLoading) {
    return (
      <BlankCard>
        <CardContent>
          <Typography>Loading...</Typography>
        </CardContent>
      </BlankCard>
    );
  }

  return (
    <BlankCard>
      <CardContent sx={{ p: '25px' }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h4" gutterBottom>
              Number of Connections
            </Typography>
            <Typography variant="body1" paragraph>
              This chart displays the distribution of electrical connections across different sectors in Nigeria, showing the growth and composition of our customer base over time.
            </Typography>
            <Typography variant="body1" paragraph>
              The data demonstrates the expanding reach of our mini-grid network and the diverse range of consumers we serve across commercial, residential, productive, and public sectors.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={8}>
            <Box sx={{ position: 'relative' }}>
              <FormControl 
                sx={{ 
                  position: 'absolute', 
                  right: 0, 
                  top: 0, 
                  width: '120px',
                  zIndex: 1,
                  backgroundColor: theme.palette.background.paper,
                  '& .MuiInputBase-root': {
                    height: '40px',
                    fontSize: '0.875rem',
                  }
                }}
              >
                <Select
                  value={selectedYear || ''}
                  onChange={handleYearChange}
                  displayEmpty
                  variant="outlined"
                  sx={{
                    '& .MuiSelect-select': {
                      paddingY: '8px',
                    }
                  }}
                >
                  {chartData.years.map((year) => (
                    <MenuItem key={year} value={year}>
                      {year}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Box className="rounded-bars">
                <Chart
                  options={optionsStackedChart}
                  series={seriesStackedChart}
                  type="bar"
                  height="370px"
                />
              </Box>
            </Box>
            <Box sx={{ mt: 2 }}>
              <Stack direction="row" spacing={3} justifyContent="space-between">
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box
                    width={40}
                    height={40}
                    bgcolor="primary.light"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    sx={{ borderRadius: '8px' }}
                  >
                    <Typography color="primary" variant="h6" display="flex">
                      <IconGridDots width={21} />
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="h3" fontWeight="700">
                      {totalConnections.toLocaleString()}
                    </Typography>
                    <Typography variant="subtitle2" color="textSecondary">
                      Total Connections ({selectedYear})
                    </Typography>
                  </Box>
                </Stack>
                <Stack direction="row" spacing={2}>
                  <Avatar
                    sx={{ width: 9, mt: 1, height: 9, bgcolor: primary, svg: { display: 'none' } }}
                  />
                  <Box>
                    <Typography variant="h5">
                      {selectedYear && yearlyData[selectedYear]
                        ? yearlyData[selectedYear].commercial.toLocaleString()
                        : '0'}
                    </Typography>
                    <Typography variant="subtitle1" color="textSecondary">
                      Commercial {selectedYear}
                    </Typography>
                  </Box>
                </Stack>
                <Stack direction="row" spacing={2}>
                  <Avatar
                    sx={{ width: 9, mt: 1, height: 9, bgcolor: secondary, svg: { display: 'none' } }}
                  />
                  <Box>
                    <Typography variant="h5">
                      {selectedYear && yearlyData[selectedYear]
                        ? yearlyData[selectedYear].residential.toLocaleString()
                        : '0'}
                    </Typography>
                    <Typography variant="subtitle1" color="textSecondary">
                      Residential {selectedYear}
                    </Typography>
                  </Box>
                </Stack>
                <Stack direction="row" spacing={2}>
                  <Avatar
                    sx={{ width: 9, mt: 1, height: 9, bgcolor: error, svg: { display: 'none' } }}
                  />
                  <Box>
                    <Typography variant="h5">
                      {selectedYear && yearlyData[selectedYear]
                        ? yearlyData[selectedYear].productive.toLocaleString()
                        : '0'}
                    </Typography>
                    <Typography variant="subtitle1" color="textSecondary">
                      Productive {selectedYear}
                    </Typography>
                  </Box>
                </Stack>
                <Stack direction="row" spacing={2}>
                  <Avatar
                    sx={{ width: 9, mt: 1, height: 9, bgcolor: warning, svg: { display: 'none' } }}
                  />
                  <Box>
                    <Typography variant="h5">
                      {selectedYear && yearlyData[selectedYear]
                        ? yearlyData[selectedYear].public.toLocaleString()
                        : '0'}
                    </Typography>
                    <Typography variant="subtitle1" color="textSecondary">
                      Public {selectedYear}
                    </Typography>
                  </Box>
                </Stack>
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </BlankCard>
  );
};

export default NumOfConnections;