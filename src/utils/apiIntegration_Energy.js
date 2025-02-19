import axios from 'axios';
import API_URL from '../config/apiconfig';

// Utility function to normalize disco names
const normalizeDisco = (disco) => {
  if (!disco) return disco;
  const lower = disco.toLowerCase().replace(/\s/g, '');
  if (lower === 'portharcourt') {
    return 'Port Harcourt';
  }
  return disco;
};

// Helper to decide whether to include a disco’s data
const shouldIncludeDisco = (disco, year) => {
  const discoName = normalizeDisco(disco);
  // Remove PH entirely
  if (discoName === 'PH') return false;
  // For Aba, include data only for 2024
  if (discoName === 'Aba' && parseInt(year) !== 2024) return false;
  return true;
};

const formatDiscoEnergyReceived = (data) => {
  const yearlyGroups = data.reduce((acc, item) => {
    const year = item.Year;
    if (!acc[year]) {
      acc[year] = [];
    }
    const discoName = normalizeDisco(item.Discos);
    if (!shouldIncludeDisco(item.Discos, year)) return acc;
    const energyReceived = parseFloat(item.EnergyRecieved_GWh) || 0;
    acc[year].push({
      disco: discoName,
      energyReceived
    });
    return acc;
  }, {});

  const formattedData = Object.entries(yearlyGroups).map(([year, values]) => {
    const total = values.reduce((sum, item) => sum + item.energyReceived, 0);
    const discoValues = values.reduce((acc, item) => {
      acc[item.disco] = item.energyReceived;
      return acc;
    }, {});
    return {
      year: parseInt(year),
      value: total,
      discos: discoValues
    };
  });

  // Derive unique discos from aggregated data
  const discosFromData = new Set();
  formattedData.forEach(item => {
    Object.keys(item.discos).forEach(disco => discosFromData.add(disco));
  });

  return {
    data: formattedData.sort((a, b) => a.year - b.year),
    discos: Array.from(discosFromData)
  };
};

const formatDiscoEnergyBilled = (data) => {
  const yearlyGroups = data.reduce((acc, item) => {
    const year = item.Year;
    if (!acc[year]) {
      acc[year] = [];
    }
    const discoName = normalizeDisco(item.Discos);
    if (!shouldIncludeDisco(item.Discos, year)) return acc;
    const energyBilled = parseFloat(item.DiscoEnergyBilled) || 0;
    acc[year].push({
      disco: discoName,
      energyBilled
    });
    return acc;
  }, {});

  const formattedData = Object.entries(yearlyGroups).map(([year, values]) => {
    const total = values.reduce((sum, item) => sum + item.energyBilled, 0);
    const discoValues = values.reduce((acc, item) => {
      acc[item.disco] = item.energyBilled;
      return acc;
    }, {});
    return {
      year: parseInt(year),
      value: total,
      discos: discoValues
    };
  });

  const discosFromData = new Set();
  formattedData.forEach(item => {
    Object.keys(item.discos).forEach(disco => discosFromData.add(disco));
  });

  return {
    data: formattedData.sort((a, b) => a.year - b.year),
    discos: Array.from(discosFromData)
  };
};

const formatDiscoRevenueBilled = (data) => {
  const yearlyGroups = data.reduce((acc, item) => {
    const year = item.Year;
    if (!acc[year]) {
      acc[year] = [];
    }
    const discoName = normalizeDisco(item.Discos);
    if (!shouldIncludeDisco(item.Discos, year)) return acc;
    // Keep raw value (in millions) without dividing
    const revenueBilled = parseFloat(item.RevenueBilled_m) || 0;
    acc[year].push({
      disco: discoName,
      revenueBilled
    });
    return acc;
  }, {});

  const formattedData = Object.entries(yearlyGroups).map(([year, values]) => {
    const total = values.reduce((sum, item) => sum + item.revenueBilled, 0);
    const discoValues = values.reduce((acc, item) => {
      acc[item.disco] = item.revenueBilled;
      return acc;
    }, {});
    return {
      year: parseInt(year),
      value: total,
      discos: discoValues
    };
  });

  const discosFromData = new Set();
  formattedData.forEach(item => {
    Object.keys(item.discos).forEach(disco => discosFromData.add(disco));
  });

  return {
    data: formattedData.sort((a, b) => a.year - b.year),
    discos: Array.from(discosFromData)
  };
};

const formatDiscoRevenueCollected = (data) => {
  const yearlyGroups = data.reduce((acc, item) => {
    const year = item.Year;
    if (!acc[year]) {
      acc[year] = [];
    }
    const discoName = normalizeDisco(item.Discos);
    if (!shouldIncludeDisco(item.Discos, year)) return acc;
    // Keep raw value (in millions) without dividing
    const revenueCollected = parseFloat(item.RevenueCollected) || 0;
    acc[year].push({
      disco: discoName,
      revenueCollected
    });
    return acc;
  }, {});

  const formattedData = Object.entries(yearlyGroups).map(([year, values]) => {
    const total = values.reduce((sum, item) => sum + item.revenueCollected, 0);
    const discoValues = values.reduce((acc, item) => {
      acc[item.disco] = item.revenueCollected;
      return acc;
    }, {});
    return {
      year: parseInt(year),
      value: total,
      discos: discoValues
    };
  });

  const discosFromData = new Set();
  formattedData.forEach(item => {
    Object.keys(item.discos).forEach(disco => discosFromData.add(disco));
  });

  return {
    data: formattedData.sort((a, b) => a.year - b.year),
    discos: Array.from(discosFromData)
  };
};

export const fetchMetricsData3 = async () => {
  try {
    const [
      discoEnergyReceivedResponse,
      discoEnergyBilledResponse,
      discoRevenueBilledResponse,
      discoRevenueCollectedResponse
    ] = await Promise.all([
      axios.get(`${API_URL}/Disco-Energy-Recieved`),
      axios.get(`${API_URL}/Disco-Energy-Billed`),
      axios.get(`${API_URL}/Disco-Revenue-Billed`),
      axios.get(`${API_URL}/Disco-Revenue-Collected`)
    ]);

    const discoEnergyReceived = formatDiscoEnergyReceived(discoEnergyReceivedResponse.data);
    const discoEnergyBilled = formatDiscoEnergyBilled(discoEnergyBilledResponse.data);
    const discoRevenueBilled = formatDiscoRevenueBilled(discoRevenueBilledResponse.data);
    const discoRevenueCollected = formatDiscoRevenueCollected(discoRevenueCollectedResponse.data);

    const allYears = [
      ...new Set([
        ...discoEnergyReceived.data.map(item => item.year),
        ...discoEnergyBilled.data.map(item => item.year),
        ...discoRevenueBilled.data.map(item => item.year),
        ...discoRevenueCollected.data.map(item => item.year)
      ])
    ].sort((a, b) => a - b);

    return {
      discoEnergyReceived,
      discoEnergyBilled,
      discoRevenueBilled,
      discoRevenueCollected,
      years: allYears
    };
  } catch (error) {
    console.error('Error fetching energy metrics data:', error);
    throw error;
  }
};

export default {
  fetchMetricsData3
};
