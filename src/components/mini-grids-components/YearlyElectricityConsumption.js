import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import { Grid, Stack, Typography, Avatar, Box, FormControl, Select, MenuItem } from '@mui/material';
import { IconGridDots } from '@tabler/icons';
import DashboardCard from 'src/components/shared/DashboardCard';
import API_URL from '../../config/apiconfig';
import ResponsiveEl from 'src/components/shared/ResponsiveEl';

const YearlyElectricityConsumption = () => {
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const secondary = theme.palette.secondary.main;
  const error = theme.palette.error.main;
  const warning = theme.palette.warning.main;

  const [selectedYear, setSelectedYear] = useState(null);
  const [chartData, setChartData] = useState({
    commercial: [],
    residential: [],
    productive: [],
    public: [],
    years: [],
  });

  const [yearlyData, setYearlyData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}/MiniGrids-Yearly-Electricity-Consumption`);
        const data = await response.json();

        // Sort data by year in ascending order
        const sortedData = data.sort((a, b) => a.Year - b.Year);

        // Get unique years
        const years = [...new Set(sortedData.map((item) => item.Year))];

        // Initialize consumption data structure
        const consumption = {
          commercial: Array(years.length).fill(0),
          residential: Array(years.length).fill(0),
          productive: Array(years.length).fill(0),
          public: Array(years.length).fill(0),
        };

        // Create yearly data structure
        const yearData = {};
        years.forEach((year) => {
          yearData[year] = {
            commercial: 0,
            residential: 0,
            productive: 0,
            public: 0,
            year: year,
          };
        });

        // Populate consumption data and yearly data
        sortedData.forEach((item) => {
          const yearIndex = years.indexOf(item.Year);
          const type = item.ConsumptionType.toLowerCase();
          if (type in consumption) {
            consumption[type][yearIndex] = item.ConsumptionMWh;
            yearData[item.Year][type] = item.ConsumptionMWh;
          }
        });

        setChartData({
          ...consumption,
          years,
        });

        setYearlyData(yearData);

        // Set initial selected year to latest year
        const latestYear = Math.max(...years);
        setSelectedYear(latestYear);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  const optionscolumnchart = {
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
      title: { text: 'Consumption (MWh)' },
      labels: {
        formatter: function (value) {
          return value.toLocaleString();
        },
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
        formatter: function (value) {
          return value.toLocaleString() + ' MWh';
        },
      },
    },
  };

  const seriescolumnchart = [
    { name: 'Commercial', data: chartData.commercial },
    { name: 'Residential', data: chartData.residential },
    { name: 'Productive', data: chartData.productive },
    { name: 'Public', data: chartData.public },
  ];

  const currentYearData = yearlyData[selectedYear] || {
    commercial: 0,
    residential: 0,
    productive: 0,
    public: 0,
    year: selectedYear,
  };

  const totalConsumption = Object.entries(currentYearData)
    .filter(([key]) => key !== 'year')
    .reduce((acc, [_, value]) => acc + value, 0);

  return (
    <DashboardCard title="">
      <Grid container spacing={3}>
        <Grid item xs={12} sm={12}>
          <Typography variant="h4" gutterBottom>
            Yearly Electricity Consumption
          </Typography>
          <Typography variant="body1" paragraph>
            This chart illustrates the yearly electricity consumption trends across different
            sectors in Nigeria. It showcases the evolving energy needs of commercial, residential,
            productive, and public sectors.
          </Typography>
          <Typography variant="body1" paragraph>
            The data reflects the country's economic growth, urbanization, and increasing
            electrification efforts, highlighting the importance of sustainable energy solutions to
            meet the growing demand.
          </Typography>
        </Grid>
        <Grid item xs={12} sm={12}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <Select
                value={selectedYear || ''}
                onChange={handleYearChange}
                displayEmpty
                sx={{ height: '40px' }}
              >
                {chartData.years.map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Box className="rounded-bars">
            <Chart
              options={optionscolumnchart}
              series={seriescolumnchart}
              type="bar"
              height="370px"
            />
          </Box>
          <ResponsiveEl>
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
                  >
                    <Typography color="primary" variant="h6" display="flex">
                      <IconGridDots width={21} />
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="h3" fontWeight="700">
                      {totalConsumption.toLocaleString()} MWh
                    </Typography>
                    <Typography variant="subtitle2" color="textSecondary">
                      Total Consumption ({selectedYear})
                    </Typography>
                  </Box>
                </Stack>
                <Stack direction="row" spacing={2}>
                  <Avatar
                    sx={{ width: 9, mt: 1, height: 9, bgcolor: primary, svg: { display: 'none' } }}
                  />
                  <Box>
                    <Typography variant="h5">
                      {currentYearData.commercial.toLocaleString()} MWh
                    </Typography>
                    <Typography variant="subtitle1" color="textSecondary">
                      Commercial {selectedYear}
                    </Typography>
                  </Box>
                </Stack>
                <Stack direction="row" spacing={2}>
                  <Avatar
                    sx={{
                      width: 9,
                      mt: 1,
                      height: 9,
                      bgcolor: secondary,
                      svg: { display: 'none' },
                    }}
                  />
                  <Box>
                    <Typography variant="h5">
                      {currentYearData.residential.toLocaleString()} MWh
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
                      {currentYearData.productive.toLocaleString()} MWh
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
                      {currentYearData.public.toLocaleString()} MWh
                    </Typography>
                    <Typography variant="subtitle1" color="textSecondary">
                      Public {selectedYear}
                    </Typography>
                  </Box>
                </Stack>
              </Stack>
            </Box>
          </ResponsiveEl>
        </Grid>
      </Grid>
    </DashboardCard>
  );
};

export default YearlyElectricityConsumption;
