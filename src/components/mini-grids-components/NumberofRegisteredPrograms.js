import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import { CardContent, Typography, Grid, Stack, Box } from '@mui/material';
import BlankCard from 'src/components/shared/BlankCard';
import API_URL from 'src/config/apiconfig';

const NumberofRegisteredPrograms = () => {
  const theme = useTheme();
  const primary = theme.palette.primary.main;

  const [data, setData] = useState([]);

  // Fetch data from the API on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/MiniGrids-Num-of-Communities-ByRegistered-Programs`
        );
        const result = await response.json();

        // Sort data by 'Number' in descending order
        const sortedData = result.sort((a, b) => b.Number - a.Number);
        setData(sortedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Prepare chart data
  const categories = data.map((item) => item.Program);
  const seriesData = data.map((item) => item.Number);

  const optionscolumnchart = {
    chart: {
      type: 'bar',
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: '#adb0bb',
      toolbar: { show: false },
      offsetX: 0, // Adjust horizontal alignment
      offsetY: 0, // Prevent unnecessary padding from the top/bottom
    },
    colors: [primary],
    plotOptions: {
      bar: {
        borderRadius: 3,
        columnWidth: '50%',
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
      offsetY: -15, // Fine-tune to position labels above the bars
    },
    xaxis: {
      categories: categories,
      labels: {
        style: {
          fontSize: '12px',
          fontWeight: 600,
        },
        rotate: 0, // Ensure labels are not slanted
        offsetY: 5, // Adjust space between labels and axis
      },
      tickPlacement: 'on',
    },
    yaxis: {
      tickAmount: 2,
      labels: {
        style: {
          fontSize: '10px',
        },
      },
    },
    grid: {
      show: false, // Remove gridlines
    },
    tooltip: {
      theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
    },
  };

  const seriescolumnchart = [
    {
      name: 'Number of Minigrids',
      data: seriesData,
    },
  ];

  return (
    <BlankCard>
      <CardContent sx={{ p: 2 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="h5">Number of Minigrids by Registered Programs</Typography>
        </Stack>
        <Grid container spacing={2} mt={2}>
          <Grid item xs={12}>
            <Box mt={1}>
              <Chart
                options={optionscolumnchart}
                series={seriescolumnchart}
                type="bar"
                height={220} // Adjust height for better alignment
              />
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </BlankCard>
  );
};

export default NumberofRegisteredPrograms;
