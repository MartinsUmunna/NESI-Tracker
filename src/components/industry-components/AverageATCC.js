import React, { useState, useEffect } from 'react';
import { CardContent, Typography, Avatar, Box, FormControl, Select, MenuItem } from '@mui/material';
import BlankCard from 'src/components/shared/BlankCard.js';
import { IconArrowUpRight, IconArrowDownRight } from '@tabler/icons';
import API_URL from '../../config/apiconfig';

const AverageATCC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [atccData, setAtccData] = useState([]);
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [currentValues, setCurrentValues] = useState({
    atcc: null,
    previousAtcc: null,
    percentageChange: null,
    isIncrease: false
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/Yearly-AVG-ATCC`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        // Filter out any entries with invalid ATCC values
        const validData = data
          .filter(item => {
            const atccValue = parseFloat(item.ATCC);
            return !isNaN(atccValue) && isFinite(atccValue) && atccValue > 0;
          })
          .map(item => ({
            year: parseInt(item.Year),
            atcc: parseFloat(item.ATCC)
          }))
          .sort((a, b) => b.year - a.year);

        if (validData.length === 0) {
          throw new Error('No valid ATCC data available');
        }

        const validYears = validData.map(item => item.year);
        
        setAtccData(validData);
        setYears(validYears);
        setSelectedYear(validYears[0]); // Set most recent valid year as default
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

  useEffect(() => {
    if (selectedYear && atccData.length > 0) {
      const currentYearData = atccData.find(item => item.year === selectedYear);
      const previousYearData = atccData.find(item => item.year === selectedYear - 1);

      if (currentYearData) {
        const change = previousYearData 
          ? ((currentYearData.atcc - previousYearData.atcc) / previousYearData.atcc) * 100
          : 0;

        setCurrentValues({
          atcc: currentYearData.atcc,
          previousAtcc: previousYearData?.atcc || null,
          percentageChange: previousYearData ? change : null,
          isIncrease: change > 0
        });
      }
    }
  }, [selectedYear, atccData]);

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
            Average ATCC
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
          {currentValues.atcc?.toFixed(2)}%
        </Typography>

        {currentValues.previousAtcc !== null && (
          <Typography variant="subtitle2" color="textSecondary" textAlign="center">
            (Previous Year: {currentValues.previousAtcc?.toFixed(2)}%)
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

export default AverageATCC;