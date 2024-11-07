import React, { useEffect, useState } from 'react';
import { CardContent, Typography, Avatar, Box, Divider } from '@mui/material';
import BlankCard from 'src/components/shared/BlankCard.js';
import { IconArrowUpRight, IconArrowDownRight } from '@tabler/icons';
import API_URL from '../../config/apiconfig';

// API URLs
const TLF_API_URL = `${API_URL}/transmission-Loss-Factor`;
const COLLAPSE_API_URL = `${API_URL}/system-collapses`;

const TransmissionLossFactorVsGridCollapse = () => {
  const [tlfData, setTlfData] = useState({ current: 0, previous: 0, year: '' });
  const [collapseData, setCollapseData] = useState({
    current: { partial: 0, total: 0, year: '' },
    previous: { partial: 0, total: 0 },
  });

  // Fetch Transmission Loss Factor Data
  const fetchTLFData = async () => {
    const response = await fetch(TLF_API_URL);
    const data = await response.json();

    const yearlyData = data.reduce((acc, item) => {
      acc[item.YEAR] = acc[item.YEAR] || [];
      acc[item.YEAR].push(item.TransmissionLossFactor);
      return acc;
    }, {});

    const years = Object.keys(yearlyData).map(Number).sort((a, b) => b - a);
    const latestYear = years[0];
    const previousYear = years[1];

    const avgLatestYear = (
      yearlyData[latestYear].reduce((a, b) => a + b, 0) / yearlyData[latestYear].length
    ).toFixed(2);
    const avgPreviousYear = (
      yearlyData[previousYear].reduce((a, b) => a + b, 0) / yearlyData[previousYear].length
    ).toFixed(2);

    setTlfData({ current: avgLatestYear, previous: avgPreviousYear, year: latestYear });
  };

  // Fetch Grid Collapse Data
  // Fetch Grid Collapse Data
const fetchCollapseData = async () => {
  const response = await fetch(COLLAPSE_API_URL);
  const data = await response.json();

  const collapseByYear = data.reduce((acc, item) => {
    acc[item.Year] = acc[item.Year] || { partial: 0, total: 0 };

    // Ensure TotalCollapse is treated as a number
    const totalCollapseValue = Number(item.TotalCollapse) || 0;

    acc[item.Year][
      item.CollapseType.includes('Partial') ? 'partial' : 'total'
    ] += totalCollapseValue;

    return acc;
  }, {});

  const collapseYears = Object.keys(collapseByYear).map(Number).sort((a, b) => b - a);
  const latestYear = collapseYears[0];
  const previousYear = collapseYears[1];

  const latestCollapse = collapseByYear[latestYear];
  const previousCollapse = collapseByYear[previousYear];

  setCollapseData({
    current: { ...latestCollapse, year: latestYear },
    previous: previousCollapse,
  });
};

  useEffect(() => {
    fetchTLFData();
    fetchCollapseData();
  }, []);

  // Helper: Get Percentage Change and Arrow Details
  const getChangeDetails = (current, previous) => {
    const change = ((current - previous) / previous) * 100;
    const isPositive = change >= 0;

    return {
      change: change.toFixed(2),
      color: isPositive ? 'success.main' : 'error.light',
      Icon: isPositive ? IconArrowUpRight : IconArrowDownRight,
    };
  };

  const tlfChange = getChangeDetails(tlfData.current, tlfData.previous);
  const collapseChange = getChangeDetails(
    collapseData.current.partial + collapseData.current.total,
    collapseData.previous.partial + collapseData.previous.total
  );

  return (
    <BlankCard>
      <CardContent
        sx={{
          p: '25px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
        }}
      >
        {/* Transmission Loss Factor */}
        <Typography variant="h6" gutterBottom textAlign="center">
          Transmission Loss Factor ({tlfData.year})
        </Typography>

        <Typography variant="h3" fontWeight={600} sx={{ my: 2 }}>
          {tlfData.current}%
        </Typography>

        <Typography variant="subtitle2" color="textSecondary" textAlign="center">
          (Previous Year: {tlfData.previous}%)
        </Typography>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mt: 1,
          }}
        >
          <Avatar
            sx={{
              bgcolor: tlfChange.color,
              width: 24,
              height: 24,
              mr: 1,
            }}
          >
            <tlfChange.Icon width={16} />
          </Avatar>
          <Typography variant="subtitle2" color="textSecondary">
            {tlfChange.change}%
          </Typography>
        </Box>

        <Divider sx={{ width: '100%', my: 2 }} />

        {/* Grid Collapses */}
        <Typography variant="h6" gutterBottom textAlign="center">
          Grid Collapses ({collapseData.current.year})
        </Typography>

        <Typography variant="h3" fontWeight={600} sx={{ my: 2 }}>
          {collapseData.current.partial + collapseData.current.total}
        </Typography>

        <Typography variant="subtitle2" color="textSecondary" textAlign="center">
          (Previous Year: {collapseData.previous.partial + collapseData.previous.total})
        </Typography>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mt: 1,
          }}
        >
          <Avatar
            sx={{
              bgcolor: collapseChange.color,
              width: 24,
              height: 24,
              mr: 1,
            }}
          >
            <collapseChange.Icon width={16} />
          </Avatar>
          <Typography variant="subtitle2" color="textSecondary">
            {collapseChange.change}%
          </Typography>
        </Box>
      </CardContent>
    </BlankCard>
  );
};

export default TransmissionLossFactorVsGridCollapse;
