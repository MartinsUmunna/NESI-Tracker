import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, Paper, IconButton, Tooltip, TextField, MenuItem } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ReactApexChart from 'react-apexcharts';
import InfoIcon from '@mui/icons-material/Info';

const DiscoMeteringProgress = () => {
  const theme = useTheme();
  const [data, setData] = useState([]);
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/Disco-Metering-Status');
      const sortedData = response.data.sort((a, b) => b.Years - a.Years);
      setData(sortedData);
      const uniqueYears = [...new Set(sortedData.map(item => item.Years))].sort((a, b) => b - a);
      setYears(uniqueYears);
      setSelectedYear(uniqueYears[0]);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const chartData = React.useMemo(() => {
    return data
      .filter(item => item.Years === selectedYear)
      .map(item => ({
        disco: item.Discos,
        meteredCustomers: item.MeteredCustomers,
        meteringGap: item.MeteringGap
      }))
      .sort((a, b) => b.meteredCustomers - a.meteredCustomers);
  }, [data, selectedYear]);

  const getChartOptions = () => ({
    chart: {
      type: 'bar',
      height: 500, // Increased height
      stacked: true,
      stackType: '100%',
      toolbar: {
        show: false
      },
      background: 'transparent',
    },
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 6, // Slightly rounded bars
        dataLabels: {
          total: {
            enabled: false // Removed total sum
          }
        },
        barHeight: '70%', // Adjust this value to control the width of the bars
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val) => `${val.toFixed(1)}%`,
      style: {
        fontSize: '12px',
        fontWeight: 600,
        colors: [theme.palette.getContrastText(theme.palette.primary.main)]
      }
    },
    xaxis: {
      categories: chartData.map(item => item.disco),
      labels: {
        style: {
          colors: Array(chartData.length).fill(theme.palette.text.primary),
          fontSize: '13px'
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: [theme.palette.text.primary],
          fontSize: '13px'
        }
      }
    },
    grid: {
      xaxis: {
        lines: {
          show: false
        }
      },
      yaxis: {
        lines: {
          show: false
        }
      }
    },
    tooltip: {
      theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
      y: {
        formatter: (val) => `${val.toFixed(1)}%`
      }
    },
    colors: [theme.palette.primary.main, theme.palette.secondary.main],
    legend: {
      position: 'bottom',
      horizontalAlign: 'center',
      fontSize: '14px',
      markers: {
        radius: 12,
      },
      itemMargin: {
        horizontal: 10
      }
    },
    responsive: [{
      breakpoint: 480,
      options: {
        legend: {
          position: 'bottom',
          offsetY: 0
        }
      }
    }]
  });

  const handleYearChange = (event) => {
    setSelectedYear(Number(event.target.value));
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2, p: 3, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Disco Metering Status</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <TextField
              select
              label="Select Year"
              value={selectedYear || ''}
              onChange={handleYearChange}
              sx={{ marginRight: 2, minWidth: 120 }}
              size="small"
            >
              {years.map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </TextField>
            <Tooltip title="View the distribution of metered customers and metering gap for each Disco.">
              <IconButton>
                <InfoIcon color="primary" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        <ReactApexChart
          options={getChartOptions()}
          series={[
            { name: 'Metered Customers (%)', data: chartData.map(item => item.meteredCustomers) },
            { name: 'Metering Gap (%)', data: chartData.map(item => item.meteringGap) }
          ]}
          type="bar"
          height={500} // Increased height
        />
      </Paper>
    </Box>
  );
};

export default DiscoMeteringProgress;