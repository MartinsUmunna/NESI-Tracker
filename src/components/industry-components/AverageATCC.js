import React, { useState, useEffect } from 'react';
import { CardContent, Typography, Avatar, Box, Divider } from '@mui/material';
import BlankCard from 'src/components/shared/BlankCard.js';
import { IconArrowUpRight, IconArrowDownRight } from '@tabler/icons';
import API_URL from 'src/config/apiconfig';

const AverageATCC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [latestATCC, setLatestATCC] = useState(null);
  const [latestYear, setLatestYear] = useState(null);
  const [previousATCC, setPreviousATCC] = useState(null);
  const [previousYear, setPreviousYear] = useState(null);
  const [percentageChange, setPercentageChange] = useState(null);
  const [isIncrease, setIsIncrease] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/Yearly-AVG-ATCC`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const sortedData = data.sort((a, b) => parseInt(b.Year) - parseInt(a.Year));

        const currentYear = sortedData[0];
        const previousYear = sortedData[1];

        const latestValue = parseFloat(currentYear.ATCC);
        const previousValue = parseFloat(previousYear.ATCC);
        const change = ((latestValue - previousValue) / previousValue) * 100;

        setLatestATCC(latestValue);
        setLatestYear(currentYear.Year);
        setPreviousATCC(previousValue);
        setPreviousYear(previousYear.Year);
        setPercentageChange(change);
        setIsIncrease(change > 0);
        setError(null);
      } catch (err) {
        console.error('Error fetching ATCC data:', err);
        setError('Failed to fetch ATCC data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <BlankCard>
        <CardContent
          sx={{
            p: '25px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
          }}
        >
          <Typography>Loading...</Typography>
        </CardContent>
      </BlankCard>
    );
  }

  if (error) {
    return (
      <BlankCard>
        <CardContent
          sx={{
            p: '25px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
          }}
        >
          <Typography color="error">{error}</Typography>
        </CardContent>
      </BlankCard>
    );
  }

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
        <Typography variant="h6" gutterBottom textAlign="center">
          Average ATCC ({latestYear})
        </Typography>

        <Typography variant="h3" fontWeight={600} sx={{ my: 2 }}>
          {latestATCC?.toFixed(2)}%
        </Typography>

        

        <Typography variant="subtitle2" color="textSecondary" textAlign="center">
          (Previous Year: {previousATCC?.toFixed(2)}%)
        </Typography>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mt: 2,
          }}
        >
          <Avatar
            sx={{
              bgcolor: isIncrease ? 'success.light' : 'error.light',
              width: 24,
              height: 24,
              mr: 1,
            }}
          >
            {isIncrease ? (
              <IconArrowUpRight width={16} color="#13DEB9" />
            ) : (
              <IconArrowDownRight width={16} color="#FA896B" />
            )}
          </Avatar>
          <Typography
            variant="subtitle2"
            sx={{ color: isIncrease ? 'success.main' : 'error.main' }}
          >
            {Math.abs(percentageChange).toFixed(2)}%
          </Typography>
        </Box>
      </CardContent>
    </BlankCard>
  );
};

export default AverageATCC;
