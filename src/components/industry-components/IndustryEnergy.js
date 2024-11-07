import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import EnergyComparisonAllStatesDashboardWidgetCard from 'src/components/shared/EnergyComparisonAllStatesDashboardWidgetCard';
import { Grid, Typography, TextField, MenuItem, Box } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import API_URL from '../../config/apiconfig';

const IndustryEnergy = () => {
  const theme = useTheme();
  const primary = theme.palette.primary.main;

  const [data, setData] = useState([]);
  const [processedData, setProcessedData] = useState(Array(24).fill(0));
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedGenco, setSelectedGenco] = useState('All');
  const [gencos, setGencos] = useState(['All']);
  const [latestDate, setLatestDate] = useState(new Date());
  const [averageEnergy, setAverageEnergy] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [capacityData, setCapacityData] = useState(null);

  const gencoMapping = {
    'OLORUNSOGO (GAS)': 'Olorunsogo',
    'JEBBA (HYDRO)': 'Jebba',
    'OMOTOSHO (GAS)': 'Omotosho',
    'AZURA-EDO IPP (GAS)': 'AZURA-EDO',
    'AFAM IV & V (GAS)': 'AFAM IV-V',
    'DADINKOWA G.S (HYDRO)': 'DADINKOWA',
    'OLORUNSOGO NIPP (GAS)': 'Olorunsogo NIPP',
    'DELTA (GAS)': 'Delta',
    'SAPELE NIPP (GAS)': 'sapele NIPP',
    'IHOVBOR NIPP (GAS)': 'lhovbor NIPP',
    'SAPELE (STEAM)': 'Sapele',
    'OMOKU (GAS)': 'Omoku',
    'ODUKPANI NIPP (GAS)': 'Odukpani',
    'TRANS-AMADI (GAS)': 'Trans Amadi',
    'TRANS AMADI': 'Trans Amadi',
    'Taopex': 'Taopex',
    'Aes': 'Aes',
    'Asco':'Asco',
    'OMOTOSHO NIPP (GAS)': 'Omotosho NIPP',
    'ALAOJI NIPP (GAS)': 'Alaoji NIPP',
    'AFAM VI (GAS/STEAM)': 'Afam VI',
    'RIVERS IPP (GAS)': 'Rivers IPP',
    'PARAS ENERGY (GAS)': 'PARAS ENERGY',
    'SHIRORO (HYDRO)': 'Shiroro',
    'IBOM POWER (GAS)': 'IBOM POWER',
    'GEREGU NIPP (GAS)': 'Geregu NIPP',
    'EGBIN (STEAM)': 'Egbin',
    'KAINJI (HYDRO)': 'Kainji',
    'OKPAI (GAS/STEAM)': 'Okpai',
    'GEREGU (GAS)': 'Geregu',
  };

  useEffect(() => {
    fetchData();
    fetchCapacityData();
  }, [selectedDate, selectedGenco]);

  const fetchCapacityData = async () => {
    try {
      const response = await axios.get(`${API_URL}/installed-vs-available-capacity`);
      setCapacityData(response.data);
    } catch (error) {
      console.error('Error fetching capacity data:', error);
    }
  };

  const matchGenco = (plant, selectedGencoName) => {
    if (selectedGencoName === 'All') return true;
    
    // Get the mapped name from the gencoMapping object
    const mappedGencoName = gencoMapping[selectedGencoName];
    
    // If we have a mapping, use exact match
    if (mappedGencoName) {
      return plant.toLowerCase() === mappedGencoName.toLowerCase();
    }
    
    // Fallback to partial matching if no mapping exists
    const plantName = plant.toLowerCase();
    const selectedName = selectedGencoName.toLowerCase();
    return plantName.includes(selectedName) || selectedName.includes(plantName);
  };

  const getCapacityInfo = () => {
    if (!capacityData) return null;

    const selectedYear = selectedDate.getFullYear();
    const selectedMonth = selectedDate.toLocaleString('en-US', { month: 'long' });

    // Filter data for selected year
    const yearData = capacityData.filter(item => item.Year === selectedYear);
    
    if (selectedGenco === 'All') {
      // For ALL Gencos
      const installedCapacity = yearData.length > 0 ? parseFloat(yearData[0].TotalInstalledCapacity) : 0;
      
      // Sum unique TotalAvailableCapacity values for the year
      const uniqueAvailableCapacities = new Set();
      yearData.forEach(item => {
        uniqueAvailableCapacities.add(parseFloat(item.TotalAvailableCapacity));
      });
      const availableCapacity = Array.from(uniqueAvailableCapacities)
        .reduce((sum, capacity) => sum + capacity, 0);

      return (
        <Typography variant="body1" sx={{ mt: 1, mb: 2 }}>
          Installed Capacity ({selectedYear}) - {installedCapacity.toLocaleString()} MW<br />
          Available Capacity ({selectedYear}) - {availableCapacity.toFixed(2)} MW
        </Typography>
      );
    } else {
      // For specific Genco
      const gencoData = yearData.find(item => 
        matchGenco(item.Plant, selectedGenco) && 
        item.Month_Name === selectedMonth
      );

      if (gencoData) {
        const installedCapacity = parseFloat(gencoData.InstalledCapacity);
        const avgAvailableCapacity = parseFloat(gencoData.AvgAvailableCapacity);

        return (
          <Typography variant="body1" sx={{ mt: 1, mb: 2 }}>
            Installed Capacity ({selectedYear}) - {installedCapacity.toLocaleString()} MW<br />
            Available Capacity ({selectedMonth} {selectedYear}) - {avgAvailableCapacity.toFixed(2)} MW
          </Typography>
        );
      }
      
      // If no data found for the specific month, try to find any data for that year
      const anyGencoData = yearData.find(item => matchGenco(item.Plant, selectedGenco));
      if (anyGencoData) {
        const installedCapacity = parseFloat(anyGencoData.InstalledCapacity);

        return (
          <Typography variant="body1" sx={{ mt: 1, mb: 2 }}>
            Installed Capacity ({selectedYear}) - {installedCapacity.toLocaleString()} MW<br />
            Available Capacity ({selectedMonth} {selectedYear}) - Not Available
          </Typography>
        );
      }
    }
    return null;
  };


  const fetchData = async () => {
    setIsLoading(true);
    try {
      const startDate = selectedDate.toISOString().split('T')[0];
      const genco = selectedGenco !== 'All' ? selectedGenco : undefined;
  
      const response = await axios.get(`${API_URL}/Hourly-Energy-Generated`, {
        params: { startDate, endDate: startDate, genco }
      });
  
      const data = response.data.data;
      setData(data);
  
      const uniqueGencos = [...new Set(data.map(item => item.Gencos))];
      setGencos(['All', ...uniqueGencos]);
  
      processData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setProcessedData(Array(24).fill(0));
      setAverageEnergy(0);
    } finally {
      setIsLoading(false);
    }
  };

  const processData = (fetchedData) => {
    const hourlyData = Array(24).fill(0);
  
    fetchedData.forEach(item => {
      const hour = parseInt(item.Hour.split(':')[0]);
      hourlyData[hour] += parseFloat(item.EnergyGeneratedMWh);
    });
  
    const roundedData = hourlyData.map(value => parseFloat(value.toFixed(2)));
    setProcessedData(roundedData);
  
    const totalEnergy = roundedData.reduce((acc, val) => acc + val, 0);
    setAverageEnergy((totalEnergy / 24).toFixed(2));
  };

  const chartOptions = {
    chart: {
      type: 'area',
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: '#adb0bb',
      toolbar: {
        show: false,
      },
      height: 350,
    },
    stroke: {
      curve: 'smooth',
      width: 2,
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 0,
        opacityFrom: 0.4,
        opacityTo: 0,
        stops: [20, 180],
      },
    },
    dataLabels: {
      enabled: true,
      background: {
        enabled: false
      },
      offsetY: -10,
      style: {
        fontSize: '12px',
      }
    },
    title: {
      text: `Average Energy Generated: ${averageEnergy} MW`,
      align: 'center',
      style: {
        fontSize: '16px',
        fontWeight: 'bold',
        color: theme.palette.text.primary,
      },
    },
    subtitle: {
      text: selectedDate ? selectedDate.toDateString() : '',
      align: 'center',
      style: {
        fontSize: '14px',
        color: theme.palette.text.secondary,
      },
    },
    xaxis: {
      categories: Array.from({ length: 24 }, (_, i) => i),
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: true,
        borderType: 'dotted'
      },
    },
    yaxis: {
      tickAmount: 5,
      labels: {
        formatter: (val) => `${val.toFixed(2)} MW`,
        style: {
          colors: theme.palette.mode === 'dark' ? '#fff' : '#adb0bb',
        },
      },
    },
    tooltip: {
      theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
    },
  };

  return (
    <EnergyComparisonAllStatesDashboardWidgetCard title="Hourly Energy Generated">
      {getCapacityInfo()}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Select Date"
            value={selectedDate}
            onChange={(newValue) => setSelectedDate(newValue)}
            renderInput={(params) => <TextField {...params} sx={{ width: 200, mr: 2 }} />}
            maxDate={latestDate}
            minDate={new Date('2018-01-01')}
          />
        </LocalizationProvider>
        <TextField
          select
          label="Select Genco"
          value={selectedGenco}
          onChange={(e) => setSelectedGenco(e.target.value)}
          sx={{ width: 200 }}
        >
          {gencos.map((genco) => (
            <MenuItem key={genco} value={genco}>
              {genco}
            </MenuItem>
          ))}
        </TextField>
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          {isLoading ? (
            <Typography>Loading...</Typography>
          ) : (
            <Chart
              options={chartOptions}
              series={[{ name: 'Energy Generated (MW)', data: processedData, color: primary }]}
              type="area"
              height="345px"
            />
          )}
        </Grid>
      </Grid>
    </EnergyComparisonAllStatesDashboardWidgetCard>
  );
};

export default IndustryEnergy;