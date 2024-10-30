import React, { useEffect, useState } from 'react';
import { CardContent, Typography, Avatar, Box, Divider } from '@mui/material';
import BlankCard from 'src/components/shared/BlankCard.js';
import { IconArrowUpRight, IconArrowDownRight } from '@tabler/icons';
import API_URL from '../../config/apiconfig';

const AverageDiscoTariff = () => {
  const [tariffData, setTariffData] = useState({ current: 0, previous: 0, year: '' });

  // Fetch Tariff Data
  const fetchTariffData = async () => {
    try {
      const response = await fetch(`${API_URL}/Yearly-Avg-Tariff`);
      const data = await response.json();

      // Sort by year to get the latest and previous year's values
      const sortedData = data.sort((a, b) => b.Year - a.Year);
      const latest = sortedData[0];
      const previous = sortedData[1];

      setTariffData({
        current: latest?.AVGTariff || 0,
        previous: previous?.AVGTariff || 0,
        year: latest?.Year || '',
      });
    } catch (error) {
      console.error('Error fetching tariff data:', error);
    }
  };

  useEffect(() => {
    fetchTariffData();
  }, []);

  // Helper: Calculate Change Details
  const getChangeDetails = (current, previous) => {
    const change = ((current - previous) / previous) * 100;
    const isPositive = change >= 0;

    return {
      change: change.toFixed(2),
      color: isPositive ? 'success.main' : 'error.light',
      Icon: isPositive ? IconArrowUpRight : IconArrowDownRight,
    };
  };

  const changeDetails = getChangeDetails(tariffData.current, tariffData.previous);

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
          Average Disco Tariff ({tariffData.year})
        </Typography>

        <Typography variant="h3" fontWeight={600} sx={{ my: 2 }}>
          ₦{tariffData.current || '---'}/KWh
        </Typography>

        <Typography variant="subtitle2" color="textSecondary" textAlign="center">
          (Previous Year: ₦{tariffData.previous || '---'}/KWh)
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
              bgcolor: changeDetails.color,
              width: 24,
              height: 24,
              mr: 1,
            }}
          >
            <changeDetails.Icon width={16} />
          </Avatar>
          <Typography variant="subtitle2" color="textSecondary">
            {changeDetails.change}%
          </Typography>
        </Box>
      </CardContent>
    </BlankCard>
  );
};

export default AverageDiscoTariff;