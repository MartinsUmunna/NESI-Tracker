import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import { CardContent, Typography, Avatar, Grid, Stack, Box } from '@mui/material';
import BlankCard from 'src/components/shared/BlankCard';
import { IconArrowUpRight, IconArrowDownRight, IconMinus } from '@tabler/icons';
import axios from 'axios'; // Ensure axios is installed: npm install axios

const TotalInvestment = () => {
  const theme = useTheme();
  const primary = theme.palette.primary.main;

  const [data, setData] = useState([]);
  const [percentageChange, setPercentageChange] = useState(0);
  const [latestInvestment, setLatestInvestment] = useState(0);
  const [previousInvestment, setPreviousInvestment] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/Minigrids-Total-Investment');
        const fetchedData = response.data;

        // Sort data by year to ensure the latest year is correctly identified
        const sortedData = fetchedData.sort((a, b) => a.Year - b.Year);

        const latestYearData = sortedData[sortedData.length - 1];
        const previousYearData = sortedData[sortedData.length - 2];

        setLatestInvestment(parseFloat(latestYearData.Investment_Mn));
        setPreviousInvestment(parseFloat(previousYearData.Investment_Mn));

        // Calculate percentage change
        const change = 
          ((latestYearData.Investment_Mn - previousYearData.Investment_Mn) / 
          previousYearData.Investment_Mn) * 100;
        setPercentageChange(change);

        setData(sortedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const getArrowIcon = () => {
    if (percentageChange > 0) return <IconArrowUpRight width={16} color="#4CAF50" />;
    if (percentageChange < 0) return <IconArrowDownRight width={16} color="#FA896B" />;
    return <IconMinus width={16} color="#757575" />;
  };

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
      formatter: val => `₦${val}m`,
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
      categories: data.map(item => item.Year), // Map dynamic years
      labels: {
        style: { fontSize: '9px', fontWeight: 600 },
      },
    },
    yaxis: { show: false },
    tooltip: {
      theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
      y: {
        formatter: val => `₦${val}m`,
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
      name: 'Investment',
      data: data.map(item => parseFloat(item.Investment_Mn)), // Map investment values
    },
  ];

  return (
    <BlankCard>
      <CardContent sx={{ p: '25px' }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="h5">Total Investment</Typography>
        </Stack>

        <Grid container spacing={0} mt={2}>
          <Grid item xs={12}>
            <Typography variant="h4" mt={3} fontWeight={600}>
              ₦{latestInvestment}m
            </Typography>
            <Typography variant="subtitle2" fontSize="10px" color="textSecondary">
              (last year)
            </Typography>
            <Stack direction="row" spacing={1} mt={1} alignItems="center">
              <Avatar
                sx={{
                  bgcolor:
                    percentageChange > 0
                      ? 'success.light'
                      : percentageChange < 0
                      ? 'error.light'
                      : 'grey.300',
                  width: 20,
                  height: 20,
                }}
              >
                {getArrowIcon()}
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

export default TotalInvestment;
