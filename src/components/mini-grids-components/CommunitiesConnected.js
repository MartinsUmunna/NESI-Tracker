import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import { CardContent, Typography, Avatar, Grid, Stack, Box } from '@mui/material';
import BlankCard from 'src/components/shared/BlankCard';
import { IconArrowUpRight, IconArrowDownRight } from '@tabler/icons';
import API_URL from '../../config/apiconfig';

const CommunitiesConnected = () => {
  const theme = useTheme();
  const primary = theme.palette.primary.main;

  // State to store fetched data and YoY calculations
  const [data, setData] = useState([]);
  const [yoyChange, setYoyChange] = useState(0);
  const [latestValue, setLatestValue] = useState(0);

  // Fetch data from the API on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}/Minigrids-Communities-connected`);
        const result = await response.json();

        // Sort data by year to ensure the trend is correct
        const sortedData = result.sort((a, b) => a.Years - b.Years);
        setData(sortedData);

        // Calculate YoY change
        const latest = sortedData[sortedData.length - 1];
        const previous = sortedData[sortedData.length - 2];
        setLatestValue(latest.CommunitiesConnected);

        if (previous) {
          const yoy = ((latest.CommunitiesConnected - previous.CommunitiesConnected) / previous.CommunitiesConnected) * 100;
          setYoyChange(yoy.toFixed(2));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Prepare chart data from fetched values
  const categories = data.map((item) => item.Years);
  const seriesData = data.map((item) => item.CommunitiesConnected);

  const optionscolumnchart = {
    chart: {
      type: 'bar',
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: '#adb0bb',
      toolbar: {
        show: false,
      },
    },
    colors: [primary],
    plotOptions: {
      bar: {
        borderRadius: 3,
        columnWidth: '65%',
        endingShape: 'rounded',
        dataLabels: {
          position: 'top',
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val) => val,
      style: {
        fontSize: '10px',
        colors: [theme.palette.mode === 'dark' ? '#fff' : '#000'],
      },
      offsetY: -20,
    },
    legend: {
      show: false,
    },
    grid: {
      yaxis: {
        lines: {
          show: false,
        },
      },
    },
    xaxis: {
      categories: categories,
      labels: {
        style: {
          fontSize: '9px',
          fontWeight: 600,
        },
      },
    },
    yaxis: {
      show: false,
    },
    tooltip: {
      theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
      y: {
        formatter: (val) => `${val}`,
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
      name: 'Communities Connected',
      data: seriesData,
    },
  ];

  return (
    <BlankCard>
      <CardContent sx={{ p: '25px' }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="h5">Communities Connected</Typography>
        </Stack>

        <Grid container spacing={0} mt={2}>
          <Grid item xs={12}>
            <Typography variant="h4" mt={3} fontWeight={600}>
              {latestValue}
            </Typography>
            <Typography variant="subtitle2" fontSize="10px" color="textSecondary">
              (last year)
            </Typography>
            <Stack direction="row" spacing={1} mt={1} alignItems="center">
              <Avatar
                sx={{ bgcolor: yoyChange >= 0 ? 'success.light' : 'error.light', width: 20, height: 20 }}
              >
                {yoyChange >= 0 ? (
                  <IconArrowUpRight width={16} color="#28a745" />
                ) : (
                  <IconArrowDownRight width={16} color="#FA896B" />
                )}
              </Avatar>
              <Typography variant="subtitle2" color="textSecondary">
                {yoyChange >= 0 ? '+' : ''}
                {yoyChange}%
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Box mt={2}>
              <Chart options={optionscolumnchart} series={seriescolumnchart} type="bar" height="125px" />
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </BlankCard>
  );
};

export default CommunitiesConnected;
