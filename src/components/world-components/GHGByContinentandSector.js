import React, { useState, useEffect, useMemo } from 'react';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import { CardContent, Typography, Grid, Slider, Stack, Box, FormControl, InputLabel, Select, MenuItem, Chip, Button } from '@mui/material';
import BlankCard from 'src/components/shared/BlankCard';
import API_URL from 'src/config/apiconfig';

const GHGByContinentAndSector = () => {
  const theme = useTheme();
  const [data, setData] = useState([]);
  const [yearRange, setYearRange] = useState([]);
  const [selectedContinents, setSelectedContinents] = useState([]);
  const [selectedEmissionType, setSelectedEmissionType] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}/api/GHG-by-Continent-and-Sector`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        setData(result);
        
        // Set default values
        const years = [...new Set(result.map(item => item.Years))].sort((a, b) => b - a);
        const latestYear = years[0];
        setYearRange([latestYear - 4, latestYear]);
        setSelectedEmissionType(result[0].EmissionType);
        
        setIsLoading(false);
      } catch (error) {
        setError(error.message);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChangeYearRange = (event, newValue) => {
    setYearRange(newValue);
  };

  const handleContinentChange = (event) => {
    setSelectedContinents(event.target.value);
  };

  const handleEmissionTypeChange = (type) => {
    setSelectedEmissionType(type);
  };

  const sectors = useMemo(() => [...new Set(data.map(item => item.Sector))], [data]);
  const continents = useMemo(() => [...new Set(data.map(item => item.Continent))], [data]);
  const emissionTypes = useMemo(() => [...new Set(data.map(item => item.EmissionType))], [data]);
  const years = useMemo(() => [...new Set(data.map(item => item.Years))].sort((a, b) => a - b), [data]);

  const filteredData = useMemo(() => {
    return data.filter(d => 
      d.Years >= yearRange[0] && d.Years <= yearRange[1] &&
      (selectedContinents.length === 0 || selectedContinents.includes(d.Continent)) &&
      d.EmissionType === selectedEmissionType
    );
  }, [data, yearRange, selectedContinents, selectedEmissionType]);

  const chartData = useMemo(() => {
    return sectors.map(sector => ({
      name: sector,
      data: Array.from({ length: yearRange[1] - yearRange[0] + 1 }, (_, index) => {
        const year = yearRange[0] + index;
        const value = filteredData
          .filter(d => d.Years === year && d.Sector === sector)
          .reduce((sum, d) => sum + d.GHG, 0);
        return parseFloat(value.toFixed(2));
      })
    }));
  }, [filteredData, yearRange, sectors]);

  const chartOptions = {
    chart: {
      type: 'bar',
      stacked: true,
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: theme.palette.text.primary,
      toolbar: {
        show: false,
      },
    },
    colors: [
      theme.palette.primary.main,
      theme.palette.secondary.main,
      theme.palette.error.main,
      theme.palette.warning.main,
      theme.palette.info.main,
    ],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '50%',
        borderRadius: [6],
        borderRadiusApplication: 'end',
        borderRadiusWhenStacked: 'all',
      },
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: true,
      position: 'bottom',
      labels: {
        colors: theme.palette.text.primary,
      },
    },
    grid: {
      show: false,
    },
    xaxis: {
      categories: Array.from({ length: yearRange[1] - yearRange[0] + 1 }, (_, i) => yearRange[0] + i),
      labels: {
        style: {
          colors: theme.palette.text.primary,
        },
      },
      title: {
        text: 'Year',
        style: {
          color: theme.palette.text.primary,
        },
      },
    },
    yaxis: {
      title: {
        text: 'GHG Emissions',
        style: {
          color: theme.palette.text.primary,
        },
      },
      labels: {
        formatter: function(val) {
          return val.toFixed(2);
        },
        style: {
          colors: theme.palette.text.primary,
        },
      },
    },
    tooltip: {
      theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
      y: {
        formatter: function(val) {
          return val.toFixed(2);
        },
      },
    },
  };

  const chartTitle = yearRange[0] === yearRange[1]
    ? `GHG by Continent and Sector in ${yearRange[0]}`
    : `GHG by Continent and Sector from ${yearRange[0]} to ${yearRange[1]}`;

  if (isLoading) return <Typography>Loading...</Typography>;
  if (error) return <Typography>Error: {error}</Typography>;

  return (
    <BlankCard>
      <CardContent sx={{ p: '25px' }}>
        <Typography variant="h5" gutterBottom>
          {chartTitle}
        </Typography>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Continents</InputLabel>
          <Select
            multiple
            value={selectedContinents}
            onChange={handleContinentChange}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} />
                ))}
              </Box>
            )}
          >
            {continents.map((continent) => (
              <MenuItem key={continent} value={continent}>
                {continent}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap' }}>
          {emissionTypes.map((type) => (
            <Button
              key={type}
              variant={selectedEmissionType === type ? "contained" : "outlined"}
              onClick={() => handleEmissionTypeChange(type)}
              size="small"
            >
              {type}
            </Button>
          ))}
        </Stack>

        <Typography gutterBottom>Year Range: {yearRange[0]} - {yearRange[1]}</Typography>
        <Slider
          value={yearRange}
          onChange={handleChangeYearRange}
          valueLabelDisplay="auto"
          min={years[0]}
          max={years[years.length - 1]}
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

export default GHGByContinentAndSector;