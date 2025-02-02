import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import { Stack, Typography, Box } from '@mui/material';
import { IconGridDots } from '@tabler/icons';
import { useFilters } from 'src/components/contexts/FilterContext';
import DashboardCard from '../../shared/DashboardCard';

const ATCC = ({ selectedYear, selectedMonth }) => {
  
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const primarylight = theme.palette.grey[100];
  const textColor = theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.8)' : '#2A3547';

  const [atccData, setAtccData] = useState({ current: 0, previous: 0, months: [] });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/On-Grid/overview`, {
          params: {
            year: selectedYear,
            month: selectedMonth
          }
        });
        const data = response.data;

        console.log('API Response:', data);

        if (Array.isArray(data) && data.length > 0) {
          const totalItem = data.find(item => item.IsTotal === 1);
          const monthItems = data.filter(item => item.IsTotal === 0).sort((a, b) => b.MonthNumber - a.MonthNumber);

          if (totalItem && typeof totalItem.ATCC === 'number') {
            const currentMonthATCC = monthItems.length > 0 ? monthItems[0].ATCC : 0;
            const previousMonthATCC = monthItems.length > 1 ? monthItems[1].ATCC : 0;
            
            // Ensure we have 4 months of data
            const monthsData = [];
            for (let i = 0; i < 4; i++) {
              if (monthItems[i]) {
                monthsData.push({
                  month: monthItems[i].MonthName,
                  value: `${monthItems[i].ATCC}%`,
                  color: 'primary' // Customize colors as needed
                });
              } else {
                monthsData.push({
                  month: 'N/A',
                  value: 'N/A',
                  color: 'primary' // Customize colors as needed
                });
              }
            }

            setAtccData({ current: currentMonthATCC, previous: previousMonthATCC, months: monthsData });
          } else {
            console.error('Total ATCC data not found or invalid format:', data);
          }
        } else {
          console.error('Invalid data format or empty array:', data);
        }
      } catch (error) {
        console.error('Error fetching ATCC data:', error);
      }
    };

    fetchData();
  }, [selectedYear, selectedMonth]);

  const optionsdonutchart = {
    chart: {
      type: 'donut',
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      toolbar: {
        show: false,
      },
      height: 275,
    },
    labels: ["ATCC", "Other"],
    colors: [primary, primarylight],
    plotOptions: {
      pie: {
        donut: {
          size: '89%',
          background: 'transparent',
          labels: {
            show: true,
            name: {
              show: true,
              offsetY: 7,
            },
            value: {
              show: false,
            },
            total: {
              show: true,
              color: textColor,
              fontSize: '20px',
              fontWeight: '600',
              label: `${atccData.current}%`,
            },
          },
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: false,
    },
    legend: {
      show: false,
    },
    tooltip: {
      theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
      fillSeriesColor: false,
    },
  };

  const seriesdonutchart = [atccData.current, 100 - atccData.current];

  return (
    <DashboardCard title="ATCC" subtitle={`${atccData.current}%`}>
      <>
        <Box mt={3}>
          <Chart
            options={optionsdonutchart}
            series={seriesdonutchart}
            type="donut"
            height="275px"
          />
        </Box>

        <Stack direction="row" spacing={2} justifyContent="space-between" mt={7}>
          {atccData.months.map((item, index) => (
            <Stack key={index} direction="row" spacing={1} alignItems="center">
              <Box
                width={30}
                height={30}
                bgcolor={`${item.color}.light`}
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Typography
                  color={`${item.color}.main`}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <IconGridDots width={18} />
                </Typography>
              </Box>
              <Box>
                <Typography variant="h6" fontWeight="600" fontSize="0.875rem">
                  {item.value}
                </Typography>
                <Typography variant="subtitle2" color="textSecondary" fontSize="0.75rem">
                  {item.month}
                </Typography>
              </Box>
            </Stack>
          ))}
        </Stack>
      </>
    </DashboardCard>
  );
};

export default ATCC;
