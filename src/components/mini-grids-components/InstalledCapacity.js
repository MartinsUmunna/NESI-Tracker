import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import { CardContent, Typography, Avatar, Grid, Stack, Box } from '@mui/material';
import BlankCard from 'src/components/shared/BlankCard';
import { IconArrowUpRight, IconArrowDownRight } from '@tabler/icons'; // Imported IconArrowDownRight
import axios from 'axios'; // Ensure axios is installed: npm install axios
import API_URL from 'src/config/apiconfig';

const InstalledCapacity = () => {
  const theme = useTheme();
  const primary = theme.palette.primary.main;

  const [data, setData] = useState([]);
  const [percentageChange, setPercentageChange] = useState(0);
  const [latestCapacity, setLatestCapacity] = useState(0);
  const [previousCapacity, setPreviousCapacity] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/Minigrids-Installed-Capacity`);
        const fetchedData = response.data;

        const sortedData = fetchedData.sort((a, b) => a.Years - b.Years);
        const latestYearData = sortedData[sortedData.length - 1];
        const previousYearData = sortedData[sortedData.length - 2];

        setLatestCapacity(latestYearData.InstalledCapacityMWp);
        setPreviousCapacity(previousYearData.InstalledCapacityMWp);

        const change = ((latestYearData.InstalledCapacityMWp - previousYearData.InstalledCapacityMWp) / 
                        previousYearData.InstalledCapacityMWp) * 100;
        setPercentageChange(change);

        setData(sortedData);
      } catch (error) {
        console.error('Error fetching data:', error);
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
      formatter: val => val,
      style: {
        fontSize: '10px',
        colors: [theme.palette.mode === 'dark' ? '#fff' : '#000'],
      },
      offsetY: -20,
    },
    legend: { show: false },
    grid: {
      yaxis: { lines: { show: false } },
    },
    xaxis: {
      categories: data.map(item => item.Years),
      labels: {
        style: { fontSize: '9px', fontWeight: 600 },
      },
    },
    yaxis: { show: false },
    tooltip: {
      theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
      y: {
        formatter: val => `${val} MWp`,
      },
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

  const seriescolumnchart = [
    {
      name: 'Capacity',
      data: data.map(item => item.InstalledCapacityMWp),
    },
  ];

  return (
    <BlankCard>
      <CardContent sx={{ p: '25px' }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="h5">Installed Capacity MWp</Typography>
        </Stack>

        <Grid container spacing={0} mt={2}>
          <Grid item xs={12}>
            <Typography variant="h4" mt={3} fontWeight={600}>
              {latestCapacity} MWp
            </Typography>
            <Typography variant="subtitle2" fontSize="10px" color="textSecondary">
              (last year)
            </Typography>
            <Stack direction="row" spacing={1} mt={1} alignItems="center">
              <Avatar
                sx={{
                  bgcolor: percentageChange >= 0 ? 'success.light' : 'error.light',
                  width: 20,
                  height: 20,
                }}
              >
                {percentageChange >= 0 ? (
                  <IconArrowUpRight width={16} color="#4CAF50" />
                ) : (
                  <IconArrowDownRight width={16} color="#FA896B" />
                )}
              </Avatar>
              <Typography variant="subtitle2" color="textSecondary">
                {percentageChange.toFixed(2)}%
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Box mt={2}>
              <Chart
                options={optionscolumnchart}
                series={seriescolumnchart}
                type="bar"
                height="125px"
              />
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </BlankCard>
  );
};

export default InstalledCapacity;
