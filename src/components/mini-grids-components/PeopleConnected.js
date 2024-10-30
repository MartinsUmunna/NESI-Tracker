import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import { CardContent, Typography, Avatar, Grid, Stack, Box } from '@mui/material';
import BlankCard from 'src/components/shared/BlankCard';
import { IconArrowUpRight, IconArrowDownRight } from '@tabler/icons';
import API_URL from 'src/config/apiconfig';

const PeopleConnected = () => {
  const theme = useTheme();
  const primary = theme.palette.primary.main;

  const [data, setData] = useState([]);
  const [percentageChange, setPercentageChange] = useState(0);

  // Fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}/Minigrids-People-Connected`);
        const result = await response.json();

        // Sort data by years to ensure the latest year comes last
        const sortedData = result.sort((a, b) => a.Years - b.Years);
        setData(sortedData);

        // Calculate percentage change between the last two years
        if (sortedData.length >= 2) {
          const latest = parseInt(sortedData[sortedData.length - 1].PeopleConnected, 10);
          const previous = parseInt(sortedData[sortedData.length - 2].PeopleConnected, 10);
          const change = ((latest - previous) / previous) * 100;
          setPercentageChange(change);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Extract years and connected people for the chart
  const years = data.map((item) => item.Years);
  const peopleConnected = data.map((item) => parseInt(item.PeopleConnected, 10));

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
      categories: years,
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
        formatter: (val) => val,
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
      name: 'People Connected',
      data: peopleConnected,
    },
  ];

  const ArrowIcon = percentageChange >= 0 ? IconArrowUpRight : IconArrowDownRight;
  const arrowColor = percentageChange >= 0 ? 'success.light' : 'error.light';

  return (
    <BlankCard>
      <CardContent sx={{ p: '25px' }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="h5">People Connected</Typography>
        </Stack>

        <Grid container spacing={0} mt={2}>
          <Grid item xs={12}>
            <Typography variant="h4" mt={3} fontWeight={600}>
              {peopleConnected[peopleConnected.length - 1] || 0}
            </Typography>
            <Typography variant="subtitle2" fontSize="10px" color="textSecondary">
              (Last year)
            </Typography>
            <Stack direction="row" spacing={1} mt={1} alignItems="center">
              <Avatar sx={{ bgcolor: arrowColor, width: 20, height: 20 }}>
                <ArrowIcon width={16} color={arrowColor === 'success.light' ? '#4CAF50' : '#FA896B'} />
              </Avatar>
              <Typography variant="subtitle2" color="textSecondary">
                {percentageChange.toFixed(2)}%
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

export default PeopleConnected;
