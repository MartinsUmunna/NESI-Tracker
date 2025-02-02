import React, { useState, useEffect } from 'react';
import { CardContent, Typography, Avatar, Box, FormControl, Select, MenuItem } from '@mui/material';
import BlankCard from 'src/components/shared/BlankCard.js';
import { IconArrowUpRight, IconArrowDownRight } from '@tabler/icons';
import API_URL from '../../config/apiconfig';

const AverageBillingEfficiency = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [efficiencyData, setEfficiencyData] = useState([]);
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [currentValues, setCurrentValues] = useState({
    efficiency: null,
    previousEfficiency: null,
    percentageChange: null,
    isIncrease: false
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const [billedResponse, receivedResponse] = await Promise.all([
          fetch(`${API_URL}/yearly-energy-billed`),
          fetch(`${API_URL}/Yearly-Energy-Recieved`)
        ]);

        if (!billedResponse.ok || !receivedResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const billedData = await billedResponse.json();
        const receivedData = await receivedResponse.json();

        // Create sets of years from both datasets
        const billedYears = new Set(billedData.map(item => item.Year));
        const receivedYears = new Set(receivedData.map(item => item.Year));

        // Find years that exist in both datasets
        const validYears = [...billedYears].filter(year => receivedYears.has(year));

        // Calculate yearly totals only for valid years
        const yearlyTotals = {};
        
        validYears.forEach(year => {
          const yearBilledData = billedData.filter(item => item.Year === year);
          const yearReceivedData = receivedData.filter(item => item.Year === year);

          const totalBilled = yearBilledData.reduce((sum, item) => 
            sum + parseFloat(item.YearlyEnergyBilled || 0), 0);
          const totalReceived = yearReceivedData.reduce((sum, item) => 
            sum + parseFloat(item.EnergyRecieved_GWh || 0), 0);

          // Only include years where both values are valid and non-zero
          if (totalBilled > 0 && totalReceived > 0) {
            yearlyTotals[year] = {
              billed: totalBilled,
              received: totalReceived
            };
          }
        });

        // Calculate efficiency for years with valid data
        const efficiencies = Object.entries(yearlyTotals)
          .map(([year, data]) => ({
            year: parseInt(year),
            efficiency: (data.billed / data.received) * 100
          }))
          .sort((a, b) => b.year - a.year);

        // Only proceed if we have valid data
        if (efficiencies.length === 0) {
          throw new Error('No valid efficiency data available');
        }

        const validYearsList = efficiencies.map(item => item.year);
        
        setEfficiencyData(efficiencies);
        setYears(validYearsList);
        setSelectedYear(validYearsList[0]); // Set most recent valid year as default
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

  useEffect(() => {
    if (selectedYear && efficiencyData.length > 0) {
      const currentYearData = efficiencyData.find(item => item.year === selectedYear);
      const previousYearData = efficiencyData.find(item => item.year === selectedYear - 1);

      if (currentYearData) {
        const change = previousYearData 
          ? ((currentYearData.efficiency - previousYearData.efficiency) / previousYearData.efficiency) * 100
          : 0;

        setCurrentValues({
          efficiency: currentYearData.efficiency,
          previousEfficiency: previousYearData?.efficiency || null,
          percentageChange: previousYearData ? change : null,
          isIncrease: change > 0
        });
      }
    }
  }, [selectedYear, efficiencyData]);

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
        <Box 
          sx={{ 
            width: '100%', 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2
          }}
        >
          <Typography variant="h6">
            Average Billing Efficiency
          </Typography>
          <FormControl size="small">
            <Select
              value={selectedYear || ''}
              onChange={(e) => setSelectedYear(e.target.value)}
              sx={{ minWidth: 120 }}
            >
              {years.map((year) => (
                <MenuItem key={year} value={year}>
                  Year {year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Typography variant="h3" fontWeight={600} sx={{ my: 2 }}>
          {currentValues.efficiency?.toFixed(2)}%
        </Typography>

        {currentValues.previousEfficiency !== null && (
          <Typography variant="subtitle2" color="textSecondary" textAlign="center">
            (Previous Year: {currentValues.previousEfficiency?.toFixed(2)}%)
          </Typography>
        )}

        {currentValues.percentageChange !== null && (
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mt: 2
          }}>
            <Avatar sx={{
              bgcolor: currentValues.isIncrease ? 'success.light' : 'error.light',
              width: 24,
              height: 24,
              mr: 1
            }}>
              {currentValues.isIncrease ? (
                <IconArrowUpRight width={16} color="#13DEB9" />
              ) : (
                <IconArrowDownRight width={16} color="#FA896B" />
              )}
            </Avatar>
            <Typography
              variant="subtitle2"
              sx={{ color: currentValues.isIncrease ? 'success.main' : 'error.main' }}
            >
              {Math.abs(currentValues.percentageChange).toFixed(2)}%
            </Typography>
          </Box>
        )}
      </CardContent>
    </BlankCard>
  );
};

export default AverageBillingEfficiency;