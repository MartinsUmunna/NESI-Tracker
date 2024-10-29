import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import { Box } from '@mui/material';
import DashboardCard from 'src/components/shared/DashboardCard'; // Adjust import path as needed
import API_URL from 'src/config/apiconfig';

const SystemCollapses = () => {
  const theme = useTheme();
  const textColor = theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.8)' : '#2A3547';
  const borderColor = theme.palette.grey[100];

  const [data, setData] = useState({ total: [], partial: [] });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/system-Collapses`);
        const total = [];
        const partial = [];
        response.data.forEach(item => {
          if (item.CollapseType === 'No. of Total System Collapse') {
            total.push(item.TotalCollapse);
          } else if (item.CollapseType === 'No. of Partial System Collapse') {
            partial.push(item.TotalCollapse);
          }
        });
        setData({ total, partial });
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchData();
  }, []);

  const optionsColumnChart = {
    chart: {
      type: 'bar',
      height: 350,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '40%',
        borderRadius: 7,
        dataLabels: {
          position: 'top',
        },
      },
    },
    dataLabels: {
      enabled: true,
      offsetX: 0,
      offsetY: -20,
      style: {
        colors: [textColor],
        fontSize: '16px',
      },
      formatter: (val) => `${val}`,
    },
    xaxis: {
      categories: [2010,2011,2012,2013,2014,2015,2016,2017,2018,2019, 2020, 2021, 2022, 2023],
      labels: {
        style: {
          colors: textColor,
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: textColor,
        },
      },
    },
    tooltip: {
      theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
    },
    grid: {
      borderColor: borderColor,
    },
    colors: [theme.palette.primary.main, theme.palette.secondary.main]
  };

  const seriesColumnChart = [
    {
      name: 'Total System Collapses',
      data: data.total,
    },
    {
      name: 'Partial System Collapses',
      data: data.partial,
    },
  ];

  return (
    <DashboardCard
      title="System Collapses"
      subtitle="Frequency of Grid Failures"
      action={null}
    >
      <Box mt={4}>
        <Chart
          options={optionsColumnChart}
          series={seriesColumnChart}
          type="bar"
          height="350px"
        />
      </Box>
    </DashboardCard>
  );
};

export default SystemCollapses;
