import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useTheme } from '@mui/material/styles';
import Chart from 'react-apexcharts';
import { Box, Grid, Slider } from '@mui/material';
import EnergyComparisonAllStatesDashboardWidgetCard from 'src/components/shared/EnergyComparisonAllStatesDashboardWidgetCard';
import API_URL from '../../config/apiconfig';

const NGAGDP = () => {
  const theme = useTheme();
  const [data, setData] = useState([]);
  const [yearRange, setYearRange] = useState([0, 0]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_URL}/Nigeria-gdp`);
      setData(response.data);
    } catch (error) {
      console.error('Error fetching GDP data:', error);
    }
  };

  const sortedData = useMemo(() => {
    return data.slice().sort((a, b) => a.Year - b.Year);
  }, [data]);

  useEffect(() => {
    if (sortedData.length > 0) {
      const minYear = sortedData[0].Year;
      const maxYear = sortedData[sortedData.length - 1].Year;
      const defaultMin = Math.max(minYear, maxYear - 14);
      setYearRange([defaultMin, maxYear]);
    }
  }, [sortedData]);

  const filteredData = useMemo(() => {
    return sortedData.filter(
      (item) => item.Year >= yearRange[0] && item.Year <= yearRange[1]
    );
  }, [sortedData, yearRange]);

  // Keep your logic for auto-determining a good min/max for the % axis
  const percentageRange = useMemo(() => {
    if (filteredData.length === 0) return { min: 0, max: 100 };
    const values = filteredData.map((item) => item['Annual_%_Change']);
    const min = Math.floor(Math.min(...values));
    const max = Math.ceil(Math.max(...values));
    return {
      min: Math.min(min - 5, 0),
      max: max + 5,
    };
  }, [filteredData]);

  // Assign yAxisIndex to each series: 0 -> GDP, 1 -> Per Capita, 2 -> % Change
  const series = useMemo(
    () => [
      {
        name: 'GDP (Billions US$)',
        type: 'column',
        yAxisIndex: 0,
        data: filteredData.map((item) => parseFloat(item.GDP_Billions_US$.toFixed(2))),
      },
      {
        name: 'Per Capita (US$)',
        type: 'column',
        yAxisIndex: 1,
        data: filteredData.map((item) => parseFloat(item.Per_Capita_US$.toFixed(2))),
      },
      {
        name: 'Annual % Change',
        type: 'line',
        yAxisIndex: 2,
        data: filteredData.map((item) => parseFloat(item['Annual_%_Change'].toFixed(2))),
      },
    ],
    [filteredData]
  );

  // Provide a separate Y-axis config for each of the three series
  const chartOptions = useMemo(
    () => ({
      chart: {
        animations: { enabled: false },
        stacked: false,
        toolbar: { show: false },
      },
      plotOptions: {
        bar: {
          columnWidth: '50%',
          borderRadius: 4,
        },
      },
      stroke: {
        width: [0, 0, 3],
        curve: 'smooth',
      },
      colors: [
        theme.palette.primary.main,   // for GDP
        theme.palette.secondary.main, // for Per Capita
        theme.palette.error.main,     // for % Change
      ],
      dataLabels: { enabled: false },
      markers: { size: 4 },
      legend: {
        show: true,
        position: 'bottom',
        horizontalAlign: 'center',
        offsetY: 8,
        itemMargin: { horizontal: 16 },
      },
      grid: {
        borderColor: theme.palette.divider,
        strokeDashArray: 3,
        xaxis: { lines: { show: false } },
      },
      // Now we define three y-axis objects, each referencing its series by name or by index
      yaxis: [
        {
          // Axis 0 for GDP
          title: {
            text: 'GDP (Billions US$)',
            style: { color: theme.palette.primary.main },
          },
          labels: {
            style: { colors: theme.palette.primary.main },
            formatter: (val) => val.toFixed(0),
          },
        },
        {
          // Axis 1 for Per Capita
          title: {
            text: 'Per Capita (US$)',
            style: { color: theme.palette.secondary.main },
          },
          labels: {
            style: { colors: theme.palette.secondary.main },
            formatter: (val) => val.toFixed(0),
          },
        },
        {
          // Axis 2 for Annual % Change (put on the right)
          opposite: true,
          title: {
            text: 'Annual % Change',
            style: { color: theme.palette.error.main },
          },
          min: percentageRange.min,
          max: percentageRange.max,
          tickAmount: 6,
          labels: {
            style: { colors: theme.palette.error.main },
            formatter: (val) => `${val.toFixed(1)}%`,
          },
        },
      ],
      xaxis: {
        categories: filteredData.map((item) => item.Year),
        labels: { style: { colors: theme.palette.text.secondary } },
      },
      tooltip: {
        shared: true,
        intersect: false,
        y: {
          formatter: (val, { seriesIndex }) => {
            if (seriesIndex === 2) {
              return `${val.toFixed(2)}%`;
            }
            return val.toFixed(2);
          },
        },
      },
    }),
    [filteredData, theme.palette, percentageRange]
  );

  const handleSliderChange = (event, newValue) => {
    setYearRange(newValue);
  };

  const fullRange = useMemo(() => {
    if (sortedData.length > 0) {
      const minYear = sortedData[0].Year;
      const maxYear = sortedData[sortedData.length - 1].Year;
      return [minYear, maxYear];
    }
    return [0, 0];
  }, [sortedData]);

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
    <EnergyComparisonAllStatesDashboardWidgetCard title="Nigeria GDP Data">
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
            {/* Notice we still use type="line" at the top level, but each series 
                uses its own 'type' field (column/line). */}
            <Chart
              options={chartOptions}
              series={series}
              type="line"
              height={400}
            />
          </Box>
        </Grid>
      </Grid>
    </EnergyComparisonAllStatesDashboardWidgetCard>
  );
};

export default NGAGDP;
