import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useTheme } from '@mui/material/styles';
import Chart from 'react-apexcharts';
import { Box, Grid, Slider } from '@mui/material';
import EnergyComparisonAllStatesDashboardWidgetCard from 'src/components/shared/EnergyComparisonAllStatesDashboardWidgetCard';
import API_URL from '../../config/apiconfig';

const NigeriaElectricityConsumption = () => {
  const theme = useTheme();
  const [data, setData] = useState([]);
  const [yearRange, setYearRange] = useState([0, 0]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_URL}/Nigeria-Electricity-Consumption`);
      setData(response.data);
    } catch (error) {
      console.error('Error fetching Electricity Consumption data:', error);
    }
  };

  // Sort the data by year
  const sortedData = useMemo(() => {
    return data.slice().sort((a, b) => a.Year - b.Year);
  }, [data]);

  // Set the default year range to the last 15 years (or as many as available)
  useEffect(() => {
    if (sortedData.length > 0) {
      const minYear = sortedData[0].Year;
      const maxYear = sortedData[sortedData.length - 1].Year;
      const defaultMin = Math.max(minYear, maxYear - 14);
      setYearRange([defaultMin, maxYear]);
    }
  }, [sortedData]);

  // Filter data based on the selected year range
  const filteredData = useMemo(() => {
    return sortedData.filter(
      (item) => item.Year >= yearRange[0] && item.Year <= yearRange[1]
    );
  }, [sortedData, yearRange]);

  // Single series for Electricity Consumption
  const series = useMemo(
    () => [
      {
        name: 'Electricity Consumption (Billion kWh)',
        type: 'column',
        data: filteredData.map((item) =>
          parseFloat(item.Electricity_Consumption_Billion_per_Kilwatts_hour.toFixed(2))
        ),
      },
    ],
    [filteredData]
  );

  // Chart options for a single-axis mixed chart
  const chartOptions = useMemo(
    () => ({
      chart: {
        animations: { enabled: false },
        toolbar: { show: false },
      },
      plotOptions: {
        bar: {
          columnWidth: '50%',
          borderRadius: 4,
          dataLabels: {
            position: 'top' // Ensures labels appear at the top of the bars
          },
        },
      },
      stroke: {
        width: 0,
        curve: 'smooth',
      },
      colors: [theme.palette.primary.main],
      dataLabels: {
        enabled: true,
        offsetY: -20, // Adjust the offset as needed
        formatter: (val) => `${val.toFixed(0)} Bn/kWh`,
        style: {
          fontSize: '12px',
          colors: [theme.palette.text.primary],
        },
      },
      
      grid: {
        borderColor: theme.palette.divider,
        strokeDashArray: 3,
        xaxis: { lines: { show: false } },
      },
      yaxis: {
        title: {
          text: 'Electricity Consumption (Billion kWh)',
          style: { color: theme.palette.primary.main },
        },
        labels: {
          style: { colors: theme.palette.primary.main },
          formatter: (val) => val.toFixed(2),
        },
      },
      xaxis: {
        categories: filteredData.map((item) => item.Year),
        labels: { style: { colors: theme.palette.text.secondary } },
      },
      tooltip: {
        shared: false,
        intersect: false,
        y: {
          formatter: (val) => val.toFixed(2),
        },
      },
    }),
    [filteredData, theme.palette]
  );

  // Handle changes from the slider
  const handleSliderChange = (event, newValue) => {
    setYearRange(newValue);
  };

  // Calculate the full range of years from the data
  const fullRange = useMemo(() => {
    if (sortedData.length > 0) {
      const minYear = sortedData[0].Year;
      const maxYear = sortedData[sortedData.length - 1].Year;
      return [minYear, maxYear];
    }
    return [0, 0];
  }, [sortedData]);

  // Create marks for the slider at the beginning and end of the range
  const marks = useMemo(() => {
    if (fullRange[0] !== fullRange[1]) {
      return [
        { value: fullRange[0], label: fullRange[0].toString() },
        { value: fullRange[1], label: fullRange[1].toString() },
      ];
    }
    return [];
  }, [fullRange]);

  return (
    <EnergyComparisonAllStatesDashboardWidgetCard title="Nigeria Electricity Consumption (Bn/kWh)">
      <Grid container spacing={2} direction="column">
        <Grid item>
          <Slider
            value={yearRange}
            onChange={handleSliderChange}
            valueLabelDisplay="auto"
            min={fullRange[0]}
            max={fullRange[1]}
            marks={marks}
            sx={{ color: theme.palette.primary.main }}
          />
        </Grid>
        <Grid item>
          <Box className="rounded-bars">
            <Chart
              options={chartOptions}
              series={series}
              type="bar"
              height={400}
            />
          </Box>
        </Grid>
      </Grid>
    </EnergyComparisonAllStatesDashboardWidgetCard>
  );
};

export default NigeriaElectricityConsumption;
