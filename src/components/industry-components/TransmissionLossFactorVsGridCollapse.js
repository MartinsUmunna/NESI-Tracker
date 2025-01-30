import React, { useEffect, useState } from 'react';
import { 
  CardContent, 
  Typography, 
  Avatar, 
  Box, 
  Divider,
  FormControl,
  Select,
  MenuItem
} from '@mui/material';
import BlankCard from 'src/components/shared/BlankCard.js';
import { IconArrowUpRight, IconArrowDownRight } from '@tabler/icons';
import API_URL from '../../config/apiconfig';

// API URLs
const TLF_API_URL = `${API_URL}/transmission-Loss-Factor`;
const COLLAPSE_API_URL = `${API_URL}/system-collapses`;

const TransmissionLossFactorVsGridCollapse = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  
  const [tlfData, setTlfData] = useState({
    yearlyData: {},
    current: null,
    previous: null,
    year: ''
  });

  const [collapseData, setCollapseData] = useState({
    yearlyData: {},
    current: { partial: 0, total: 0, year: '' },
    previous: { partial: 0, total: 0 }
  });

  // Fetch Transmission Loss Factor Data
  const fetchTLFData = async () => {
    try {
      const response = await fetch(TLF_API_URL);
      if (!response.ok) throw new Error('Failed to fetch TLF data');
      const data = await response.json();

      // Process yearly data
      const yearlyData = data.reduce((acc, item) => {
        acc[item.YEAR] = acc[item.YEAR] || [];
        acc[item.YEAR].push(parseFloat(item.TransmissionLossFactor));
        return acc;
      }, {});

      setTlfData(prev => ({
        ...prev,
        yearlyData
      }));

      return Object.keys(yearlyData).map(Number);
    } catch (error) {
      console.error('Error fetching TLF data:', error);
      setError('Failed to fetch transmission loss factor data');
      return [];
    }
  };

  // Fetch Grid Collapse Data
  const fetchCollapseData = async () => {
    try {
      const response = await fetch(COLLAPSE_API_URL);
      if (!response.ok) throw new Error('Failed to fetch collapse data');
      const data = await response.json();

      // Process yearly data
      const yearlyData = data.reduce((acc, item) => {
        const year = item.Year;
        acc[year] = acc[year] || { partial: 0, total: 0 };
        
        const totalCollapseValue = Number(item.TotalCollapse) || 0;
        if (item.CollapseType.includes('Partial')) {
          acc[year].partial += totalCollapseValue;
        } else {
          acc[year].total += totalCollapseValue;
        }
        
        return acc;
      }, {});

      setCollapseData(prev => ({
        ...prev,
        yearlyData
      }));

      return Object.keys(yearlyData).map(Number);
    } catch (error) {
      console.error('Error fetching collapse data:', error);
      setError('Failed to fetch grid collapse data');
      return [];
    }
  };

  // Initial data fetch
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        const [tlfYears, collapseYears] = await Promise.all([
          fetchTLFData(),
          fetchCollapseData()
        ]);

        // Combine all years from both datasets
        const allYears = [...new Set([...tlfYears, ...collapseYears])];
        const sortedYears = allYears.sort((a, b) => b - a);

        setYears(sortedYears);
        setSelectedYear(sortedYears[0]); // Set most recent year as default
      } catch (error) {
        console.error('Error in initial data fetch:', error);
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // Update displayed data when year changes
  useEffect(() => {
    if (!selectedYear) return;

    // Update TLF data for selected year
    const currentYearTLF = tlfData.yearlyData[selectedYear] || [];
    const previousYearTLF = tlfData.yearlyData[selectedYear - 1] || [];

    const currentAvgTLF = currentYearTLF.length ? 
      (currentYearTLF.reduce((a, b) => a + b, 0) / currentYearTLF.length).toFixed(2) : null;
    const previousAvgTLF = previousYearTLF.length ?
      (previousYearTLF.reduce((a, b) => a + b, 0) / previousYearTLF.length).toFixed(2) : null;

    setTlfData(prev => ({
      ...prev,
      current: currentAvgTLF,
      previous: previousAvgTLF,
      year: selectedYear
    }));

    // Update Collapse data for selected year
    const currentYearCollapse = collapseData.yearlyData[selectedYear] || { partial: 0, total: 0 };
    const previousYearCollapse = collapseData.yearlyData[selectedYear - 1] || { partial: 0, total: 0 };

    setCollapseData(prev => ({
      ...prev,
      current: { ...currentYearCollapse, year: selectedYear },
      previous: previousYearCollapse
    }));
  }, [selectedYear, tlfData.yearlyData, collapseData.yearlyData]);

  // Helper: Get Percentage Change and Arrow Details
  const getChangeDetails = (current, previous) => {
    if (!previous || previous === 0 || current === null) return { change: null, color: 'primary.main', Icon: IconArrowUpRight };
    
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
        {/* Year Selection */}
        <Box sx={{ 
          width: '100%', 
          display: 'flex', 
          justifyContent: 'flex-end',
          mb: 2 
        }}>
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

        {/* Transmission Loss Factor */}
        <Typography variant="h6" gutterBottom textAlign="center">
          Transmission Loss Factor
        </Typography>

        <Typography variant="h3" fontWeight={600} sx={{ my: 2 }}>
          {tlfData.current !== null ? `${tlfData.current}%` : '-'}
        </Typography>

        <Typography variant="subtitle2" color="textSecondary" textAlign="center">
          (Previous Year: {tlfData.previous !== null ? `${tlfData.previous}%` : '-'})
        </Typography>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mt: 1,
          }}
        >
          {tlfChange.change !== null && (
            <>
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
            </>
          )}
        </Box>

        <Divider sx={{ width: '100%', my: 2 }} />

        {/* Grid Collapses */}
        <Typography variant="h6" gutterBottom textAlign="center">
          Grid Collapses
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
          {collapseChange.change !== null && (
            <>
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
            </>
          )}
        </Box>
      </CardContent>
    </BlankCard>
  );
};

export default TransmissionLossFactorVsGridCollapse;