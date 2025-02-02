import React, { useEffect, useState } from 'react';
import { 
  CardContent, 
  Typography, 
  Avatar, 
  Box, 
  FormControl,
  Select,
  MenuItem
} from '@mui/material';
import BlankCard from 'src/components/shared/BlankCard.js';
import { IconArrowUpRight, IconArrowDownRight } from '@tabler/icons';
import API_URL from '../../config/apiconfig';

const AverageDiscoTariff = () => {
  const [tariffData, setTariffData] = useState([]);
  const [selectedYear, setSelectedYear] = useState('');
  const [years, setYears] = useState([]);
  const [currentTariff, setCurrentTariff] = useState({ current: 0, previous: 0 });

  // Fetch Tariff Data
  const fetchTariffData = async () => {
    try {
      const response = await fetch(`${API_URL}/Yearly-Avg-Tariff`);
      const data = await response.json();
      
      // Sort by year to get all available years
      const sortedData = data.sort((a, b) => b.Year - a.Year);
      const uniqueYears = [...new Set(sortedData.map(item => item.Year))];
      
      setTariffData(sortedData);
      setYears(uniqueYears);
      setSelectedYear(uniqueYears[0]); // Set most recent year as default
    } catch (error) {
      console.error('Error fetching tariff data:', error);
    }
  };

  useEffect(() => {
    fetchTariffData();
  }, []);

  useEffect(() => {
    if (selectedYear && tariffData.length > 0) {
      const currentYearData = tariffData.find(item => item.Year === selectedYear);
      const previousYearData = tariffData.find(item => item.Year === selectedYear - 1);
      
      setCurrentTariff({
        current: currentYearData?.AVGTariff || 0,
        previous: previousYearData?.AVGTariff || 0
      });
    }
  }, [selectedYear, tariffData]);

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

  const changeDetails = getChangeDetails(currentTariff.current, currentTariff.previous);

  return (
    <BlankCard>
      <CardContent
        sx={{
          p: '25px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          height: '100%',
        }}
      >
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
            Average Disco Tariff
          </Typography>
          <FormControl size="small">
            <Select
              value={selectedYear}
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
          ₦{currentTariff.current || '---'}/KWh
        </Typography>
        <Typography variant="subtitle2" color="textSecondary" textAlign="center">
          (Previous Year: ₦{currentTariff.previous || '---'}/KWh)
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