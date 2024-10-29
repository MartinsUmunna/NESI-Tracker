import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import { CardContent, Typography, Avatar, Grid, Stack, Box } from '@mui/material';
import BlankCard from 'src/components/shared/BlankCard';
import { IconArrowUpRight, IconArrowDownRight, IconMinus } from '@tabler/icons';
import API_URL from 'src/config/apiconfig';

const ElectricityConsumed = () => {
  const theme = useTheme();
  const primary = theme.palette.primary.main;

  const [data, setData] = useState([]);
  const [series, setSeries] = useState([{ name: 'Consumption', data: [] }]);
  const [latestConsumption, setLatestConsumption] = useState(0);
  const [yoyChange, setYoyChange] = useState(0);
  const [arrowIcon, setArrowIcon] = useState(<IconMinus width={16} />);

  // Fetch data dynamically from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}/api/Minigrids-Electricity-consumed`);
        const result = await response.json();

        const consumptionData = result.map((item) => item.ElectricityConsumedMWh);
        const latest = consumptionData[consumptionData.length - 1];
        const previous = consumptionData[consumptionData.length - 2] || 0;

        // Calculate year-over-year change
        const change = previous ? (((latest - previous) / previous) * 100).toFixed(2) : 0;
        setYoyChange(change);
        setLatestConsumption(latest);

        // Determine the arrow icon
        if (change > 0) setArrowIcon(<IconArrowUpRight width={16} color="#4CAF50" />);
        else if (change < 0) setArrowIcon(<IconArrowDownRight width={16} color="#FA896B" />);

        setData(result);
        setSeries([{ name: 'Consumption', data: consumptionData }]);
      } catch (error) {
        console.error('Error fetching electricity consumption data:', error);
      }
    };

    fetchData();
  }, []);

  const optionscolumnchart = {
    chart: {
      type: 'bar',
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: '#adb0bb',
      toolbar: { show: false },
    },
    colors: [primary],
    plotOptions: {
      bar: {
        borderRadius: 3,
        columnWidth: '65%',
        endingShape: 'rounded',
        dataLabels: { position: 'top' },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val) => `${val} MW`,
      style: {
        fontSize: '10px',
        colors: [theme.palette.mode === 'dark' ? '#fff' : '#000'],
      },
      offsetY: -20,
    },
    legend: { show: false },
    grid: { yaxis: { lines: { show: false } } },
    xaxis: {
      categories: data.map((item) => item.Years),
      labels: { style: { fontSize: '9px', fontWeight: 600 } },
    },
    yaxis: { show: false },
    tooltip: {
      theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
      y: { formatter: (val) => `${val} MW` },
    },
    title: {
      text: 'Yearly Trend',
      align: 'center',
      style: {
        fontSize: '14px',
        fontWeight: 600,
        color: theme.palette.mode === 'dark' ? '#fff' : '#000',
      },
    },
  };

  return (
    <BlankCard>
      <CardContent sx={{ p: '25px' }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="h5">Electricity Consumed MWh</Typography>
        </Stack>

        <Grid container spacing={0} mt={2}>
          <Grid item xs={12}>
            <Typography variant="h4" mt={3} fontWeight={600}>
              {latestConsumption} MW
            </Typography>
            <Typography variant="subtitle2" fontSize="10px" color="textSecondary">
              (last year)
            </Typography>
            <Stack direction="row" spacing={1} mt={1} alignItems="center">
              <Avatar sx={{ bgcolor: 'error.light', width: 20, height: 20 }}>
                {arrowIcon}
              </Avatar>
              <Typography variant="subtitle2" color="textSecondary">
                {yoyChange > 0 ? `+${yoyChange}%` : `${yoyChange}%`}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Box mt={2}>
              <Chart options={optionscolumnchart} series={series} type="bar" height="125px" />
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </BlankCard>
  );
};

export default ElectricityConsumed;
