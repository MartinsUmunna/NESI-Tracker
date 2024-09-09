import React, { useState, useMemo } from 'react';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import { CardContent, Typography, Grid, Slider, Stack, Box, FormControl, InputLabel, Select, MenuItem, Chip } from '@mui/material';
import BlankCard from 'src/components/shared/BlankCard';

const SolarShareEnergy = () => {
  const theme = useTheme();
  const [yearRange, setYearRange] = useState([2013, 2023]);
  
  const allLocations = [
    'Africa', 'Africa (EI)', 'Algeria', 'Argentina', 'Asia', 'Asia Pacific (EI)', 'Australia', 'Austria',
    'Azerbaijan', 'Bangladesh', 'Belarus', 'Belgium', 'Brazil', 'Bulgaria', 'CIS (EI)', 'Canada',
    'Central America (EI)', 'Chile', 'China', 'Colombia', 'Croatia', 'Czechia', 'Denmark', 'Eastern Africa (EI)',
    'Ecuador', 'Egypt', 'Estonia', 'Europe', 'Europe (EI)', 'European Union (27)', 'Finland', 'France',
    'Germany', 'Greece', 'High-income countries', 'Hong Kong', 'Hungary', 'Iceland', 'India', 'Indonesia',
    'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy', 'Japan', 'Kazakhstan', 'Latvia', 'Lithuania',
    'Lower-middle-income countries', 'Luxembourg', 'Malaysia', 'Mexico', 'Middle Africa (EI)', 'Middle East (EI)',
    'Morocco', 'Netherlands', 'New Zealand', 'Non-OECD (EI)', 'North America', 'North America (EI)',
    'North Macedonia', 'Norway', 'OECD (EI)', 'Oceania', 'Oman', 'Pakistan', 'Peru', 'Philippines', 'Poland',
    'Portugal', 'Romania', 'Russia', 'Saudi Arabia', 'Singapore', 'Slovakia', 'Slovenia', 'South Africa',
    'South America', 'South Korea', 'South and Central America (EI)', 'Spain', 'Sri Lanka', 'Sweden',
    'Switzerland', 'Taiwan', 'Thailand', 'Trinidad and Tobago', 'Turkey', 'Turkmenistan', 'USSR', 'Ukraine',
    'United Kingdom', 'United States', 'Upper-middle-income countries', 'Uzbekistan', 'Venezuela', 'Vietnam',
    'Western Africa (EI)', 'World'
  ];

  const continents = ['Africa', 'Asia', 'Europe', 'North America', 'South America', 'Oceania', 'World'];
  const defaultSelectedContinents = ['Africa', 'Asia', 'Europe', 'North America', 'South America'];
  const [selectedLocations, setSelectedLocations] = useState(defaultSelectedContinents);

  const handleChangeYearRange = (event, newValue) => {
    setYearRange(newValue);
  };

  const handleLocationChange = (event) => {
    setSelectedLocations(event.target.value);
  };

  // Modified mock data generation function
  const generateMockData = () => {
    return Array.from({ length: 2023 - 1965 + 1 }, (_, index) => {
      const year = 1965 + index;
      return allLocations.map(location => ({
        location,
        value: parseFloat((Math.random() * 33 + 2).toFixed(2)), 
        year
      }));
    }).flat();
  };

  const mockData = useMemo(() => generateMockData(), []);

  const filteredData = useMemo(() => {
    return mockData.filter(d => 
      d.year >= yearRange[0] && d.year <= yearRange[1] &&
      selectedLocations.includes(d.location)
    );
  }, [yearRange, selectedLocations, mockData]);

  const chartData = useMemo(() => {
    return selectedLocations.map(location => ({
      name: location,
      data: Array.from({ length: yearRange[1] - yearRange[0] + 1 }, (_, index) => {
        const year = yearRange[0] + index;
        const value = filteredData
          .find(d => d.year === year && d.location === location)?.value || 0;
        return { x: year, y: parseFloat(value.toFixed(2)) };
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
        text: 'Solar Share',
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
    ? `Solar Share by Location in ${yearRange[0]}`
    : `Solar Share by Location from ${yearRange[0]} to ${yearRange[1]}`;

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
          min={1965}
          max={2023}
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

export default SolarShareEnergy;