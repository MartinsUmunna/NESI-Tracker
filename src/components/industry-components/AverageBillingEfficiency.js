import React, { useState, useEffect } from 'react';
import { CardContent, Typography, Avatar, Box } from '@mui/material';
import BlankCard from 'src/components/shared/BlankCard.js';
import { IconArrowUpRight, IconArrowDownRight } from '@tabler/icons';
import API_URL from 'src/config/apiconfig';

const AverageBillingEfficiency = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [latestEfficiency, setLatestEfficiency] = useState(null);
  const [latestYear, setLatestYear] = useState(null);
  const [previousEfficiency, setPreviousEfficiency] = useState(null);
  const [previousYear, setPreviousYear] = useState(null);
  const [percentageChange, setPercentageChange] = useState(null);
  const [isIncrease, setIsIncrease] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch both datasets
        const [billedResponse, receivedResponse] = await Promise.all([
          fetch(`${API_URL}/yearly-energy-billed`),
          fetch(`${API_URL}/Yearly-Energy-Recieved`)
        ]);

        if (!billedResponse.ok || !receivedResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const billedData = await billedResponse.json();
        const receivedData = await receivedResponse.json();

        // Calculate yearly totals
        const yearlyTotals = {};
        
        // Process billed data
        billedData.forEach(item => {
          if (!yearlyTotals[item.Year]) {
            yearlyTotals[item.Year] = {
              billed: 0,
              received: 0
            };
          }
          yearlyTotals[item.Year].billed += parseFloat(item.YearlyEnergyBilled);
        });

        // Process received data
        receivedData.forEach(item => {
          if (!yearlyTotals[item.Year]) {
            yearlyTotals[item.Year] = {
              billed: 0,
              received: 0
            };
          }
          yearlyTotals[item.Year].received += parseFloat(item.EnergyRecieved_GWh);
        });

        // Calculate efficiency for each year
        const efficiencies = Object.entries(yearlyTotals)
          .map(([year, data]) => ({
            year: parseInt(year),
            efficiency: (data.billed / data.received) * 100
          }))
          .filter(item => item.year <= 2023) // Exclude 2024
          .sort((a, b) => b.year - a.year);

        // Get latest (2023) and previous year data
        const currentYear = efficiencies[0];
        const previousYear = efficiencies[1];

        const change = ((currentYear.efficiency - previousYear.efficiency) / previousYear.efficiency) * 100;

        setLatestEfficiency(currentYear.efficiency);
        setLatestYear(currentYear.year);
        setPreviousEfficiency(previousYear.efficiency);
        setPreviousYear(previousYear.year);
        setPercentageChange(change);
        setIsIncrease(change > 0);
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch efficiency data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <BlankCard>
        <CardContent sx={{
          p: '25px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%'
        }}>
          <Typography>Loading...</Typography>
        </CardContent>
      </BlankCard>
    );
  }

  if (error) {
    return (
      <BlankCard>
        <CardContent sx={{
          p: '25px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%'
        }}>
          <Typography color="error">{error}</Typography>
        </CardContent>
      </BlankCard>
    );
  }

  return (
    <BlankCard>
      <CardContent sx={{
        p: '25px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%'
      }}>
        <Typography variant="h6" gutterBottom textAlign="center">
          Average Billing Efficiency ({latestYear})
        </Typography>

        <Typography variant="h3" fontWeight={600} sx={{ my: 2 }}>
          {latestEfficiency?.toFixed(2)}%
        </Typography>

        <Typography variant="subtitle2" color="textSecondary" textAlign="center">
          (Previous Year: {previousEfficiency?.toFixed(2)}%)
        </Typography>

        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mt: 2
        }}>
          <Avatar sx={{
            bgcolor: isIncrease ? 'success.light' : 'error.light',
            width: 24,
            height: 24,
            mr: 1
          }}>
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

export default AverageBillingEfficiency;