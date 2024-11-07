import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import { 
  Stack, 
  Typography, 
  Box, 
  Divider,
  Select,
  MenuItem,
  FormControl
} from '@mui/material';
import DashboardCard from 'src/components/shared/DashboardCard.js';
import API_URL from '../../config/apiconfig';

const CapacityIndustry = () => {
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const secondary = theme.palette.secondary.main;

  const [data, setData] = useState([]);
  const [selectedYear, setSelectedYear] = useState('');
  const [years, setYears] = useState([]);
  const [installedSeries, setInstalledSeries] = useState([]);
  const [availableSeries, setAvailableSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (data.length > 0 && selectedYear) {
      processData();
    }
  }, [data, selectedYear]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/Capacity-Industry-Percentage`);
      const jsonData = await response.json();
      
      if (Array.isArray(jsonData) && jsonData.length > 0) {
        setData(jsonData);
        
        const uniqueYears = [...new Set(jsonData.map(item => item.Year))];
        setYears(uniqueYears);
        setSelectedYear(uniqueYears[uniqueYears.length - 1]);
        setError('');
      } else {
        setError('No data available.');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const processData = () => {
    const yearData = data.filter(item => item.Year === selectedYear);
    
    if (yearData.length === 0) {
      setInstalledSeries([0, 0]);
      setAvailableSeries([0, 0]);
      return;
    }

    const installed = yearData.filter(item => item.CapacityType === 'Installed');
    const available = yearData.filter(item => item.CapacityType === 'Available');

    const installedPercentages = [
      parseFloat(installed.find(item => item.Source === 'HYDRO')?.CapacityPercentage) || 0,
      parseFloat(installed.find(item => item.Source === 'THERMAL')?.CapacityPercentage) || 0
    ];

    const availablePercentages = [
      parseFloat(available.find(item => item.Source === 'HYDRO')?.CapacityPercentage) || 0,
      parseFloat(available.find(item => item.Source === 'THERMAL')?.CapacityPercentage) || 0
    ];

    setInstalledSeries(installedPercentages);
    setAvailableSeries(availablePercentages);
  };

  const optionsDonut = (type) => ({
    chart: {
      type: 'donut',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      toolbar: {
        show: false,
      },
    },
    labels: ["Renewable Energy", "Non-Renewable Energy"],
    colors: [secondary, primary], 
    plotOptions: {
      pie: {
        startAngle: -90,
        endAngle: 270,
        donut: {
          size: '90%',
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: '14px',
              offsetY: -10,
            },
            value: {
              show: true,
              fontSize: '20px',
              fontWeight: 'bold',
              formatter: function(val) {
                return val ? val.toFixed(1) + '%' : '0%';
              }
            },
            total: {
              show: true,
              label: 'Total',
              fontSize: '12px',
              formatter: function(w) {
                return w.globals.seriesTotals.reduce((a, b) => a + b, 0).toFixed(1) + '%';
              }
            }
          }
        }
      }
    },
    dataLabels: {
      enabled: true,
      formatter: function(val, opts) {
        return opts.w.config.labels[opts.seriesIndex] + '\n' + (val ? val.toFixed(1) + '%' : '0%');
      },
      textAnchor: 'middle',
      distributed: false,
      offsetX: 0,
      offsetY: 0,
      style: {
        fontSize: '12px',
        fontFamily: 'Plus Jakarta Sans, sans-serif',
        colors: ['#000']
      },
      dropShadow: {
        enabled: true,
        color: '#000',
        top: 2,
        left: 0,
        blur: 3,
        opacity: 0.2
      }
    },
    legend: {
      show: false,
    },
    stroke: {
      width: 0
    },
    tooltip: {
      enabled: true,
      y: {
        formatter: function(val) {
          return val ? val.toFixed(1) + '%' : '0%';
        }
      }
    }
  });

  return (
    <DashboardCard 
      title="Industry Capacity Distribution"
      action={
        <FormControl size="small">
          <Select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            sx={{ minWidth: 120 }}
          >
            {years.map((year) => (
              <MenuItem key={year} value={year}>
                Year {year}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      }
    >
      {loading ? (
        <Typography variant="body1" align="center">Loading data...</Typography>
      ) : error ? (
        <Typography variant="body1" color="error" align="center">{error}</Typography>
      ) : (
        <Stack direction="row" spacing={2} justifyContent="space-between" mt={3}>
          <Box width="48%">
            <Typography variant="h6" color="textSecondary" gutterBottom align="center">
              Installed Capacity
            </Typography>
            <Chart
              options={optionsDonut('installed')}
              series={installedSeries}
              type="donut"
              height="300px"
            />
            <Stack direction="row" justifyContent="center" spacing={2} mt={2}>
              <Box display="flex" alignItems="center">
                <Box width={10} height={10} bgcolor={secondary} borderRadius="50%" mr={1} />
                <Typography variant="caption">Renewable Energy</Typography>
              </Box>
              <Box display="flex" alignItems="center">
                <Box width={10} height={10} bgcolor={primary} borderRadius="50%" mr={1} />
                <Typography variant="caption">Non-Renewable Energy</Typography>
              </Box>
            </Stack>
          </Box>
          <Divider orientation="vertical" flexItem />
          <Box width="48%">
            <Typography variant="h6" color="textSecondary" gutterBottom align="center">
              Available Capacity 
            </Typography>
            <Chart
              options={optionsDonut('available')}
              series={availableSeries}
              type="donut"
              height="300px"
            />
            <Stack direction="row" justifyContent="center" spacing={2} mt={2}>
              <Box display="flex" alignItems="center">
                <Box width={10} height={10} bgcolor={secondary} borderRadius="50%" mr={1} />
                <Typography variant="caption">Renewable Energy</Typography>
              </Box>
              <Box display="flex" alignItems="center">
                <Box width={10} height={10} bgcolor={primary} borderRadius="50%" mr={1} />
                <Typography variant="caption">Non-Renewable Energy</Typography>
              </Box>
            </Stack>
          </Box>
        </Stack>
      )}
    </DashboardCard>
  );
};

export default CapacityIndustry;
