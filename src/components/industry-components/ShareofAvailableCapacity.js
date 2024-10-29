import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import { 
  Box, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem 
} from '@mui/material';
import DashboardCard from 'src/components/shared/DashboardCard';
import API_URL from 'src/config/apiconfig';

const ShareofAvailableCapacity = () => {
  const theme = useTheme();
  const textColor = theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.8)' : '#2A3547';
  const primaryColor = theme.palette.primary.main;

  const [data, setData] = useState([]);
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/share-of-generation-Capacity`);
      const sortedData = response.data.sort((a, b) => b.Year - a.Year);
      setData(sortedData);
      const uniqueYears = [...new Set(sortedData.map(item => item.Year))].sort((a, b) => b - a);
      setYears(uniqueYears);
      setSelectedYear(uniqueYears[0]);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  const processData = (year) => {
    const filteredData = data.filter(item => item.Year === year);
    // Group by Plant and take average of ShareofAvailability
    const plantGroups = filteredData.reduce((acc, curr) => {
      if (!acc[curr.Plant]) {
        acc[curr.Plant] = {
          sum: curr.ShareofAvailability,
          count: 1
        };
      } else {
        acc[curr.Plant].sum += curr.ShareofAvailability;
        acc[curr.Plant].count += 1;
      }
      return acc;
    }, {});

    const averagedData = Object.entries(plantGroups).map(([plant, data]) => ({
      Plant: plant,
      ShareofAvailability: data.sum / data.count
    }));

    const sortedByShare = averagedData.sort((a, b) => b.ShareofAvailability - a.ShareofAvailability);

    return {
      categories: sortedByShare.map(item => item.Plant),
      series: [
        {
          name: 'Share of Available Capacity (%)',
          data: sortedByShare.map(item => item.ShareofAvailability),
        },
      ],
    };
  };

  const chartData = selectedYear ? processData(selectedYear) : { categories: [], series: [] };

  const options = {
    chart: {
      type: 'bar',
      height: 350,
      toolbar: { show: false },
      parentHeightOffset: 0,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '65%',
        borderRadius: 4,
        dataLabels: {
          position: 'top'
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val) => `${Number(val).toFixed(2)}%`,
      offsetY: -20,
      style: {
        colors: [textColor],
        fontSize: '12px'
      },
    },
    xaxis: {
      categories: chartData.categories,
      labels: {
        style: {
          colors: textColor,
          fontSize: '10px'
        },
        rotate: -45,
        rotateAlways: true,
        trim: false,
        hideOverlappingLabels: true,
        maxHeight: 150
      },
      tickPlacement: 'on',
      axisBorder: {
        show: true
      },
      axisTicks: {
        show: true
      }
    },
    yaxis: {
      min: 0,
      max: Math.max(...(chartData.series[0]?.data || [0])) * 1.1, // Add 10% padding
      labels: {
        style: { colors: textColor },
        formatter: (val) => `${val.toFixed(0)}%`
      },
      title: {
        text: 'Share of Available Capacity (%)',
        style: { color: textColor }
      }
    },
    tooltip: {
      theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
      y: { 
        formatter: (val) => `${Number(val).toFixed(2)}%`,
        title: {
          formatter: () => 'Share:'
        }
      }
    },
    grid: {
      borderColor: theme.palette.grey[100],
      padding: {
        bottom: 20
      }
    },
    colors: [primaryColor],
    legend: { show: false }
  };

  return (
    <DashboardCard 
      title="Share of Available Capacity (%)" 
      subtitle="Distribution of available capacity across power plants"
    >
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <FormControl 
          variant="outlined" 
          sx={{ minWidth: 120 }}
          size="small"
        >
          <InputLabel id="year-select-label">Year</InputLabel>
          <Select
            labelId="year-select-label"
            value={selectedYear || ''}
            onChange={handleYearChange}
            label="Year"
          >
            {years.map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box mt={4} sx={{ height: '300px' }}>
        <Chart 
          options={options} 
          series={chartData.series} 
          type="bar" 
          height="100%" 
        />
      </Box>
    </DashboardCard>
  );
};

export default ShareofAvailableCapacity;