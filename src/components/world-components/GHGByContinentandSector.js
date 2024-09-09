import React, { useState, useMemo } from 'react';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import { CardContent, Typography, Grid, Slider, Stack, Box, FormControl, InputLabel, Select, MenuItem, Chip, Button } from '@mui/material';
import BlankCard from 'src/components/shared/BlankCard';

const GHGByContinentAndSector = () => {
  const theme = useTheme();
  const [yearRange, setYearRange] = useState([2013, 2022]);
  const [selectedContinents, setSelectedContinents] = useState([]);
  const [selectedEmissionType, setSelectedEmissionType] = useState('GWP_100_AR5_CO2');

  const handleChangeYearRange = (event, newValue) => {
    setYearRange(newValue);
  };

  const handleContinentChange = (event) => {
    setSelectedContinents(event.target.value);
  };

  const handleEmissionTypeChange = (type) => {
    setSelectedEmissionType(type);
  };

  const sectors = ['Deforestation', 'Fires', 'Forest Land', 'Other Land', 'Organic Soil'];
  const continents = [
    'Africa', 'Asia-Pacific Developed', 'Eastern Asia', 'Eurasia', 'Europe',
    'Latin America and Caribbean', 'Middle East', 'North America',
    'South-East Asia and developing Pacific', 'Southern Asia'
  ];
  const emissionTypes = ['GWP_100_AR5_CO2', 'GWP_100_AR5_CH4', 'GWP_100_AR5_N2O'];

  // Modified mock data generation function to include emission types
  const generateMockData = () => {
    return Array.from({ length: 2022 - 1990 + 1 }, (_, index) => {
      const year = 1990 + index;
      return continents.flatMap(continent =>
        sectors.flatMap(sector =>
          emissionTypes.map(emissionType => ({
            continent,
            sector,
            emissionType,
            value: Math.random() * 5541.726505 - 2311.035736,
            year
          }))
        )
      );
    }).flat();
  };

  const mockData = useMemo(() => generateMockData(), []);

  const filteredData = useMemo(() => {
    return mockData.filter(d => 
      d.year >= yearRange[0] && d.year <= yearRange[1] &&
      (selectedContinents.length === 0 || selectedContinents.includes(d.continent)) &&
      d.emissionType === selectedEmissionType
    );
  }, [yearRange, selectedContinents, selectedEmissionType, mockData]);

  const chartData = useMemo(() => {
    return sectors.map(sector => ({
      name: sector,
      data: Array.from({ length: yearRange[1] - yearRange[0] + 1 }, (_, index) => {
        const year = yearRange[0] + index;
        const value = filteredData
          .filter(d => d.year === year && d.sector === sector)
          .reduce((sum, d) => sum + d.value, 0);
        return { x: year, y: parseFloat(value.toFixed(2)) };
      })
    }));
  }, [filteredData, yearRange, sectors]);

  const chartOptions = {
    chart: {
      type: 'bar',
      stacked: true,
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
        borderRadius: 10,
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
        }
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
        text: 'GHG Emissions',
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
    ],
  };

  const chartTitle = yearRange[0] === yearRange[1]
    ? `GHG by Continent and Sector in ${yearRange[0]}`
    : `GHG by Continent and Sector from ${yearRange[0]} to ${yearRange[1]}`;

  return (
    <BlankCard>
      <CardContent sx={{ p: '25px', textAlign: 'left' }}>
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
          min={1990}
          max={2022}
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