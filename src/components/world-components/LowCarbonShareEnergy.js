import React, { useState, useEffect, useMemo } from 'react';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import { CardContent, Typography, Grid, Slider, Stack, Box, FormControl, InputLabel, Select, MenuItem, Chip } from '@mui/material';
import BlankCard from 'src/components/shared/BlankCard';

const LowCarbonShareEnergy = () => {
  const theme = useTheme();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [yearRange, setYearRange] = useState([0, 0]);

  const allLocations = useMemo(() => [...new Set(data.map(item => item.Entity))], [data]);
  const continents = ['Africa', 'Asia', 'Europe', 'North America', 'South America', 'Oceania', 'World'];
  const defaultSelectedContinents = ['Africa', 'Asia', 'Europe', 'North America', 'South America'];
  const [selectedLocations, setSelectedLocations] = useState(defaultSelectedContinents);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/Low-Carbon-Share');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const jsonData = await response.json();
        setData(jsonData);

        // Set the initial year range to the last 5 years
        const years = [...new Set(jsonData.map(item => item.Year))];
        const sortedYears = years.sort((a, b) => b - a);
        const latestYear = sortedYears[0];
        const startYear = sortedYears[4] || sortedYears[sortedYears.length - 1]; 
        setYearRange([startYear, latestYear]);

      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChangeYearRange = (event, newValue) => {
    setYearRange(newValue);
  };

  const handleLocationChange = (event) => {
    setSelectedLocations(event.target.value);
  };

  const filteredData = useMemo(() => {
    return data.filter(d => 
      d.Year >= yearRange[0] && d.Year <= yearRange[1] &&
      selectedLocations.includes(d.Entity)
    );
  }, [yearRange, selectedLocations, data]);

  const chartData = useMemo(() => {
    return selectedLocations.map(location => ({
      name: location,
      data: Array.from({ length: yearRange[1] - yearRange[0] + 1 }, (_, index) => {
        const year = yearRange[0] + index;
        const value = filteredData
          .find(d => d.Year === year && d.Entity === location)?.Low_carbon_energy_equivalent_primary_energy || 0;
        return { x: year, y: Math.round(value * 100) / 100 };
      })
    }));
  }, [filteredData, yearRange, selectedLocations]);

  const chartOptions = {
    chart: {
      type: 'bar',
      stacked: false,
      toolbar: {
        show: false
      },
      foreColor: theme.palette.text.primary
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        endingShape: 'rounded',
        borderRadius: 7,
      },
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    xaxis: {
      type: 'category',
      categories: Array.from({ length: yearRange[1] - yearRange[0] + 1 }, (_, i) => yearRange[0] + i),
      title: {
        text: 'Year',
        style: {
          color: theme.palette.text.primary
        }
      },
      labels: {
        style: {
          colors: theme.palette.text.primary
        },
        rotateAlways: false,
        rotate: 0,
        trim: false
      },
      axisBorder: {
        color: theme.palette.divider
      },
      axisTicks: {
        color: theme.palette.divider
      }
    },
    yaxis: {
      title: {
        text: 'Low Carbon Share',
        style: {
          color: theme.palette.text.primary
        }
      },
      labels: {
        formatter: function (val) {
          return val.toFixed(2);
        },
        style: {
          colors: theme.palette.text.primary
        }
      }
    },
    grid: {
      show: true,
      borderColor: theme.palette.divider,
      xaxis: {
        lines: {
          show: true
        }
      },
      yaxis: {
        lines: {
          show: false
        }
      }
    },
    fill: {
      opacity: 1
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val.toFixed(2);
        }
      },
      theme: theme.palette.mode
    },
    legend: {
      position: 'bottom',
      horizontalAlign: 'center',
      offsetX: 40,
      labels: {
        colors: theme.palette.text.primary
      }
    },
    colors: [
      theme.palette.primary.main,
      theme.palette.secondary.main,
      theme.palette.error.main,
      theme.palette.warning.main,
      theme.palette.info.main,
      theme.palette.success.main,
      theme.palette.grey[500]
    ],
  };

  const chartTitle = yearRange[0] === yearRange[1]
    ? `Low Carbon Share by Location in ${yearRange[0]}`
    : `Low Carbon Share by Location from ${yearRange[0]} to ${yearRange[1]}`;

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography>Error: {error}</Typography>;

  return (
    <BlankCard>
      <CardContent sx={{ p: '25px', textAlign: 'left' }}>
        <Typography variant="h5" gutterBottom>
          {chartTitle}
        </Typography>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Locations</InputLabel>
          <Select
            multiple
            value={selectedLocations}
            onChange={handleLocationChange}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} />
                ))}
              </Box>
            )}
          >
            {allLocations.map((location) => (
              <MenuItem key={location} value={location}>
                {location}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Typography gutterBottom>Year Range: {yearRange[0]} - {yearRange[1]}</Typography>
        <Slider
          value={yearRange}
          onChange={handleChangeYearRange}
          valueLabelDisplay="auto"
          min={Math.min(...data.map(item => item.Year))}
          max={Math.max(...data.map(item => item.Year))}
          sx={{ mb: 4 }}
        />

        <Box sx={{ height: 500 }}>
          <Chart
            options={chartOptions}
            series={chartData}
            type="bar"
            height="100%"
          />
        </Box>
      </CardContent>
    </BlankCard>
  );
};

export default LowCarbonShareEnergy;