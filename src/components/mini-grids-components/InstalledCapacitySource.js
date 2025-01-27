import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import {
  Grid,
  Stack,
  Typography,
  Avatar,
  Box,
  FormControl,
  Select,
  MenuItem,
  useMediaQuery,
} from '@mui/material';
import { IconGridDots } from '@tabler/icons';
import DashboardCard from 'src/components/shared/DashboardCard';
import API_URL from '../../config/apiconfig';
import ResponsiveEl from 'src/components/shared/ResponsiveEl';

const InstalledCapacitySource = () => {
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const secondary = theme.palette.secondary.main;
  const error = theme.palette.error.main;
  const warning = theme.palette.warning.main;
  const info = theme.palette.info.main;

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  const [selectedYear, setSelectedYear] = useState(null);
  const [capacityData, setCapacityData] = useState({
    years: [],
    sources: {},
    totals: {},
    latestYear: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}/MiniGrids-Installed-Capacity-Source`);
        const data = await response.json();

        // Get unique years and sources
        const years = [...new Set(data.map((item) => item.Year))].sort();
        const sources = [...new Set(data.map((item) => item.Source))];

        // Initialize data structure
        const sourceData = {};
        sources.forEach((source) => {
          sourceData[source] = years.map((year) => {
            const entry = data.find((d) => d.Year === year && d.Source === source);
            return entry ? entry.InstalledCapacityMW : 0;
          });
        });

        // Calculate totals for each source
        const totals = {};
        sources.forEach((source) => {
          totals[source] = sourceData[source].reduce((a, b) => a + b, 0);
        });

        setCapacityData({
          years: years.map(String),
          sources: sourceData,
          totals: totals,
          latestYear: Math.max(...years),
        });

        // Set initial selected year to latest year
        setSelectedYear(Math.max(...years).toString());
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
    colors: [primary, secondary, error, warning, info],
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
      title: { text: 'Capacity (MWp)' },
      labels: {
        formatter: function (value) {
          return value.toLocaleString();
        },
      },
      min: 0,
      forceNiceScale: true,
    },
    xaxis: {
      categories: capacityData.years,
      axisBorder: { show: false },
    },
    tooltip: {
      theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
      fillSeriesColor: false,
      y: {
        formatter: function (value) {
          return value.toLocaleString() + ' MWp';
        },
      },
    },
  };

  const seriescolumnchart = Object.entries(capacityData.sources).map(([source, data]) => ({
    name: source,
    data: data,
  }));

  // Calculate total capacity based on selected year
  const totalCapacity = selectedYear
    ? Object.values(capacityData.sources).reduce((total, data) => {
        const yearIndex = capacityData.years.indexOf(selectedYear);
        return total + (yearIndex !== -1 ? data[yearIndex] : 0);
      }, 0)
    : Object.values(capacityData.totals).reduce((a, b) => a + b, 0);

  // Get colors for each source
  const getSourceColor = (index) => {
    const colors = [primary, secondary, error, warning, info];
    return colors[index % colors.length];
  };

  return (
    <DashboardCard title="">
      <Grid container spacing={3}>
        <Grid item lg={6} sm={12}>
          <Typography variant="h4" gutterBottom>
            Installed Capacity by Source
          </Typography>
          <Typography variant="body1" paragraph>
            Nigeria has been diversifying its energy mix, focusing on renewable sources to
            complement conventional power generation. This chart shows the installed capacity trends
            for various energy sources over the years.
          </Typography>
          <Typography variant="body1" paragraph>
            The growth in renewable energy capacity reflects Nigeria's commitment to sustainable
            energy development and improved access to electricity across the country.
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
                {capacityData.years.map((year) => (
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
              <Stack direction="row" spacing={3} justifyContent="space-between" flexWrap="wrap">
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
                      {totalCapacity.toLocaleString()} MWp
                    </Typography>
                    <Typography variant="subtitle2" color="textSecondary">
                      Total Capacity {selectedYear ? `(${selectedYear})` : ''}
                    </Typography>
                  </Box>
                </Stack>
                {Object.entries(capacityData.sources).map(([source, data], index) => {
                  const yearIndex = selectedYear
                    ? capacityData.years.indexOf(selectedYear)
                    : data.length - 1;
                  return (
                    <Stack direction="row" spacing={2} key={source}>
                      <Avatar
                        sx={{
                          width: 9,
                          mt: 1,
                          height: 9,
                          bgcolor: getSourceColor(index),
                          svg: { display: 'none' },
                        }}
                      />
                      <Box>
                        <Typography variant="h5">{data[yearIndex].toLocaleString()} MWp</Typography>
                        <Typography variant="subtitle1" color="textSecondary">
                          {source} {selectedYear || capacityData.latestYear}
                        </Typography>
                      </Box>
                    </Stack>
                  );
                })}
              </Stack>
            </Box>
          </ResponsiveEl>
        </Grid>
      </Grid>
    </DashboardCard>
  );
};

export default InstalledCapacitySource;
