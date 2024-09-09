import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Grid, Divider, Stack, MenuItem, FormControl, InputLabel } from '@mui/material';
import { IconArrowUpRight, IconArrowDownLeft } from '@tabler/icons';
import CustomSelect from '../../forms/theme-elements/CustomSelect';
import welcomeImg from 'src/assets/images/backgrounds/overveiw-bg.svg';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import axios from 'axios';
import { useFilters } from 'src/components//contexts/FilterContext';

const WelcomeCard = () => {
  
  const theme = useTheme();
  const primaryLight = theme.palette.primary.light;
  const textColor = theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.8)' : '#2A3547';
  const sparklineTextColor = theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.8)' : '#094780';

  const [year, setYear] = useState('All');
  const [month, setMonth] = useState('All');
  const [metricsData, setMetricsData] = useState([]);
  const [availableMonths, setAvailableMonths] = useState([]);

  const handleYearChange = (event) => {
    setYear(event.target.value);
  };

  const handleMonthChange = (event) => {
    setMonth(event.target.value);
  };

  const years = ['All', '2019', '2020', '2021', '2022', '2023', '2024'];
  const allMonths = ['All', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  useEffect(() => {
    if (year === '2024') {
      const currentMonth = new Date().getMonth();
      setAvailableMonths(['All', ...allMonths.slice(1, currentMonth + 2)]);
    } else {
      setAvailableMonths(allMonths);
    }
  }, [year]);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await axios.get('http://localhost:5006/api/commercial/overview', {
          params: {
            year: year !== 'All' ? year : null,
            month: month !== 'All' ? month : null
          }
        });
        setMetricsData(response.data);
      } catch (error) {
        console.error('Error fetching metrics data:', error);
      }
    };

    fetchMetrics();
  }, [year, month]);

  const totalMetrics = metricsData.find((data) => data.IsTotal === 1) || {};
  const recentMetrics = metricsData.filter((data) => data.IsTotal === 0).slice(0, 4);

  const optionsSparkline = {
    chart: {
      type: 'area',
      height: 15,
      fontFamily: 'inherit',
      foreColor: textColor,
      toolbar: {
        show: false,
      },
      sparkline: {
        enabled: true,
      },
      group: 'sparklines',
    },
    stroke: {
      curve: 'smooth',
      width: 0.5,
    },
    fill: {
      type: 'solid',
      opacity: 0.05,
    },
    markers: {
      size: 0,
    },
    tooltip: {
      theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
      x: {
        show: false,
      },
    },
  };

  const seriesEnergyDelivered = [{ data: recentMetrics.map(m => m.EnergyDeliveredGWh), name: '' }];
  const seriesEnergyBilled = [{ data: recentMetrics.map(m => m.EnergyBilledGWh), name: '' }];
  const seriesEnergyCollected = [{ data: recentMetrics.map(m => m.EnergyCollectedGWh), name: '' }];

  return (
    <Card elevation={0} sx={{ backgroundColor: primaryLight, py: 0 }}>
      <CardContent sx={{ py: 2, px: 2 }}>
        <Grid container justifyContent="space-between">
          <Grid item sm={6} display="flex" alignItems="center">
            <Box>
              <Typography gap="16px" mb={10} variant="h4" whiteSpace="nowrap">
                Welcome back Regis Fortune!
              </Typography>
              <Box
                gap="16px" mb={5}
                sx={{
                  display: {
                    xs: 'block',
                    sm: 'flex',
                  },
                  alignItems: 'center',
                }}
              >
                <Typography variant="h5" whiteSpace="nowrap">
                  Commercial Overview:
                </Typography>
              </Box>

              <Stack spacing={2} direction="row" divider={<Divider orientation="vertical" flexItem />}>
                <Box>
                  <Typography variant="h2" whiteSpace="nowrap">
                    1772{' '}
                    <span>
                      <IconArrowUpRight width={18} color="#39B69A" />
                      <Typography variant="subtitle2" fontWeight="600" component="span">
                        {' '}
                        +9%
                      </Typography>
                      <Typography variant="subtitle2" color="textSecondary" component="span">
                        {' '}
                        last year
                      </Typography>
                    </span>
                  </Typography>
                  <Typography variant="subtitle1" whiteSpace="nowrap">
                    Energy Delivered (GWh)
                  </Typography>
                  <Box mt={1}>
                    <Chart options={optionsSparkline} series={seriesEnergyDelivered} type="area" height={35} />
                    <Typography variant="subtitle2" color={sparklineTextColor}>
                      24% to target
                    </Typography>
                  </Box>
                </Box>
                <Box>
                  <Typography variant="h2" whiteSpace="nowrap">
                    1263
                    <span>
                      <IconArrowUpRight width={18} color="#39B69A" />
                      <Typography variant="subtitle2" fontWeight="600" component="span">
                        {' '}
                        +6%
                      </Typography>
                      <Typography variant="subtitle2" color="textSecondary" component="span">
                        {' '}
                        last year
                      </Typography>
                    </span>
                  </Typography>
                  <Typography variant="subtitle1" whiteSpace="nowrap">
                    Energy Billed (GWh)
                  </Typography>
                  <Box mt={1}>
                    <Chart options={optionsSparkline} series={seriesEnergyBilled} type="area" height={35} />
                    <Typography variant="subtitle2" color={sparklineTextColor}>
                      52% to target
                    </Typography>
                  </Box>
                </Box>
                <Box>
                  <Typography variant="h2" whiteSpace="nowrap">
                    989
                    <span>
                      <IconArrowDownLeft width={18} color="#b63939" />
                      <Typography variant="subtitle2" fontWeight="600" component="span">
                        {' '}
                        -14%
                      </Typography>
                      <Typography variant="subtitle2" color="textSecondary" component="span">
                        {' '}
                        last year
                      </Typography>
                    </span>
                  </Typography>
                  <Typography variant="subtitle1" whiteSpace="nowrap">
                    Energy Collected (GWh)
                  </Typography>
                  <Box mt={1}>
                    <Chart options={optionsSparkline} series={seriesEnergyCollected} type="area" height={35} />
                    <Typography variant="subtitle2" color={sparklineTextColor}>
                      18% to target
                    </Typography>
                  </Box>
                </Box>
              </Stack>
            </Box>
          </Grid>
          <Grid sm={5}>
            <Box mb="-30px" mt="50px">
              <Stack direction="row" spacing={4} sx={{ mb: 2 }}>
                <FormControl size="small" sx={{ minWidth: 200 }}>
                  <InputLabel
                    id="year-label"
                    sx={{ color: theme.palette.mode === 'dark' ? 'white' : 'black' }}
                  >
                    Year
                  </InputLabel>
                  <CustomSelect
                    labelId="year-label"
                    id="year-select"
                    value={year}
                    onChange={handleYearChange}
                    label="Year"
                    sx={{
                      backgroundColor: theme.palette.mode === 'dark' ? '#424242' : 'white',
                      color: theme.palette.mode === 'dark' ? 'white' : 'black',
                    }}
                  >
                    {years.map((y) => (
                      <MenuItem
                        key={y}
                        value={y}
                        sx={{ color: theme.palette.mode === 'dark' ? 'white' : 'black' }}
                      >
                        {y}
                      </MenuItem>
                    ))}
                  </CustomSelect>
                </FormControl>
                <FormControl size="small" sx={{ minWidth: 200 }}>
                  <InputLabel
                    id="month-label"
                    sx={{ color: theme.palette.mode === 'dark' ? 'white' : 'black' }}
                  >
                    Month
                  </InputLabel>
                  <CustomSelect
                    labelId="month-label"
                    id="month-select"
                    value={month}
                    onChange={handleMonthChange}
                    label="Month"
                    sx={{
                      backgroundColor: theme.palette.mode === 'dark' ? '#424242' : 'white',
                      color: theme.palette.mode === 'dark' ? 'white' : 'black',
                    }}
                  >
                    {availableMonths.map((m) => (
                      <MenuItem
                        key={m}
                        value={m}
                        sx={{ color: theme.palette.mode === 'dark' ? 'white' : 'black' }}
                      >
                        {m}
                      </MenuItem>
                    ))}
                                    </CustomSelect>
                </FormControl>
              </Stack>
              <img src={welcomeImg} alt="Welcome Background" width={'400px'} />
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default WelcomeCard;

