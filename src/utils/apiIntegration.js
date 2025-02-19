import axios from 'axios';
import API_URL from '../config/apiconfig';

const formatShareOfAvailability = (data) => {
  const yearlyGroups = data.reduce((acc, item) => {
    const year = item.Year;
    if (!acc[year]) {
      acc[year] = [];
    }
    const roundedValue = Math.ceil(parseFloat(item.ShareofAvailability));
    acc[year].push({
      plant: item.Plant,
      value: roundedValue
    });
    return acc;
  }, {});
  const formattedData = Object.entries(yearlyGroups).map(([year, values]) => {
    const sumOfValues = values.reduce((sum, item) => sum + item.value, 0);
    const avg = sumOfValues / values.length;
    const yearlyAverage = Math.ceil(avg);
    const plantValues = values.reduce((acc, item) => {
      acc[item.plant] = item.value;
      return acc;
    }, {});
    return {
      year: parseInt(year),
      value: yearlyAverage,
      plants: plantValues
    };
  });
  const uniquePlants = [...new Set(data.map(item => item.Plant))];
  return {
    data: formattedData,
    plants: uniquePlants
  };
};

const formatForexData = (data) => {
  const monthOrder = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const monthlyData = data.map(item => {
    const usd = Math.ceil(item.Dollar);
    const gbp = Math.ceil(item.Pounds);
    const euro = Math.ceil(item.Euro);
    const monthIndex = monthOrder.indexOf(item.Month);
    const monthValue = monthIndex === -1 ? item.Month : monthIndex;
    return {
      year: item.Year,
      month: monthValue,
      values: {
        'Dollar (USD)': usd,
        'Pounds (GBP)': gbp,
        'EUROS': euro
      }
    };
  });
  const tempYearMap = data.reduce((acc, item) => {
    const year = item.Year;
    if (!acc[year]) {
      acc[year] = {
        year,
        values: {
          'Dollar (USD)': 0,
          'Pounds (GBP)': 0,
          'EUROS': 0
        },
        count: 0
      };
    }
    acc[year].values['Dollar (USD)'] += Math.ceil(item.Dollar);
    acc[year].values['Pounds (GBP)'] += Math.ceil(item.Pounds);
    acc[year].values['EUROS'] += Math.ceil(item.Euro);
    acc[year].count++;
    return acc;
  }, {});
  const yearlyData = Object.values(tempYearMap).map(yearly => {
    const { year, values, count } = yearly;
    const newVals = {};
    Object.entries(values).forEach(([key, val]) => {
      const avg = val / count;
      newVals[key] = Math.ceil(avg);
    });
    return {
      year,
      values: newVals
    };
  });
  const currencyPairs = ['Dollar (USD)', 'Pounds (GBP)', 'EUROS'];
  return {
    monthly: monthlyData,
    yearly: yearlyData,
    currencyPairs
  };
};

const formatInflationData = (data) => {
  return data.map(item => {
    const val = parseFloat(item.CORE_INFLATION_RATE.replace('%', ''));
    const rounded = Math.ceil(val);
    return {
      year: item.YEAR,
      value: rounded
    };
  });
};

const formatDiscoTariffData = (data) => {
  const yearlyGroups = data.reduce((acc, item) => {
    const year = item.Year;
    if (!acc[year]) {
      acc[year] = [];
    }
    const roundedTariff = Math.ceil(item.Tariff);
    acc[year].push({
      disco: item.Discos,
      tariff: roundedTariff
    });
    return acc;
  }, {});
  const formattedData = Object.entries(yearlyGroups).map(([year, values]) => {
    const sumTariffs = values.reduce((sum, item) => sum + item.tariff, 0);
    const avg = sumTariffs / values.length;
    const yearlyAverage = Math.ceil(avg);
    const discoValues = values.reduce((acc, item) => {
      acc[item.disco] = item.tariff;
      return acc;
    }, {});
    return {
      year: parseInt(year),
      value: yearlyAverage,
      discos: discoValues
    };
  });
  const uniqueDiscos = [...new Set(data.map(item => item.Discos))];
  return {
    data: formattedData,
    discos: uniqueDiscos
  };
};

const formatTransmissionLossData = (data) => {
  const monthlyData = data.map(item => ({
    year: item.YEAR,
    month: item.Month_Name,
    values: {
      'Transmission Loss Factor': Math.ceil(item.TransmissionLossFactor),
      'MYTO Assumed TLF': Math.ceil(item.MYTOAssumedTLF)
    }
  }));
  const tempYearMap = data.reduce((acc, item) => {
    const year = item.YEAR;
    if (!acc[year]) {
      acc[year] = {
        year,
        values: {
          'Transmission Loss Factor': 0,
          'MYTO Assumed TLF': 0
        },
        count: 0
      };
    }
    acc[year].values['Transmission Loss Factor'] += Math.ceil(item.TransmissionLossFactor);
    acc[year].values['MYTOAssumedTLF'] += Math.ceil(item.MYTOAssumedTLF);
    acc[year].count++;
    return acc;
  }, {});
  const yearlyData = Object.values(tempYearMap).map(yearly => {
    const { year, values, count } = yearly;
    const final = {};
    Object.entries(values).forEach(([k, v]) => {
      const avg = v / count;
      final[k] = Math.ceil(avg);
    });
    return {
      year,
      values: final
    };
  });
  return {
    monthly: monthlyData,
    yearly: yearlyData,
    types: ['Transmission Loss Factor', 'MYTO Assumed TLF']
  };
};

const formatLoadOfftakeData = (data) => {
  const yearlyGroups = data.reduce((acc, item) => {
    const year = item.Years;
    const type = item.Offtake_Type;
    if (!acc[year]) {
      acc[year] = {
        MYTO: [],
        Actuals: []
      };
    }
    const val = parseFloat(item.Load_Offtake.replace('%', ''));
    const rounded = Math.ceil(val);
    if (type === 'MYTO') {
      acc[year].MYTO.push({
        disco: item.Discos,
        value: rounded
      });
    } else {
      acc[year].Actuals.push({
        disco: item.Discos,
        value: rounded
      });
    }
    return acc;
  }, {});
  const formattedData = Object.entries(yearlyGroups).map(([year, types]) => {
    const mytoArr = types.MYTO;
    const actualArr = types.Actuals;
    const mytoAvg = mytoArr.length > 0
      ? Math.ceil(mytoArr.reduce((sum, item) => sum + item.value, 0) / mytoArr.length)
      : null;
    const actualsAvg = actualArr.length > 0
      ? Math.ceil(actualArr.reduce((sum, item) => sum + item.value, 0) / actualArr.length)
      : null;
    const discoValues = {
      MYTO: mytoArr.reduce((acc, item) => {
        acc[item.disco] = item.value;
        return acc;
      }, {}),
      Actuals: actualArr.reduce((acc, item) => {
        acc[item.disco] = item.value;
        return acc;
      }, {})
    };
    return {
      year: parseInt(year),
      values: {
        'MYTO Assumed': mytoAvg,
        'Actual Load Offtake': actualsAvg
      },
      discos: discoValues
    };
  });
  const uniqueDiscos = [...new Set(data.map(item => item.Discos))];
  return {
    data: formattedData,
    discos: uniqueDiscos,
    types: ['MYTO Assumed', 'Actual Load Offtake']
  };
};

export const fetchMetricsData = async () => {
  try {
    const [
      shareOfAvailabilityResponse,
      forexResponse,
      inflationResponse,
      discoTariffResponse,
      transmissionLossResponse,
      loadOfftakeResponse
    ] = await Promise.all([
      axios.get(`${API_URL}/share-of-generation-Capacity`),
      axios.get(`${API_URL}/Foreign-Exchange-Rate`),
      axios.get(`${API_URL}/Core-Inflation-Rate`),
      axios.get(`${API_URL}/Yearly-Disco-Tariff`),
      axios.get(`${API_URL}/Transmission-Loss-Factor`),
      axios.get(`${API_URL}/Disco-Load-Offtake`)
    ]);
    const shareOfAvailability = formatShareOfAvailability(shareOfAvailabilityResponse.data);
    const forex = formatForexData(forexResponse.data);
    const inflation = formatInflationData(inflationResponse.data);
    const discoTariff = formatDiscoTariffData(discoTariffResponse.data);
    const transmissionLoss = formatTransmissionLossData(transmissionLossResponse.data);
    const loadOfftake = formatLoadOfftakeData(loadOfftakeResponse.data);
    const allYears = [
      ...new Set([
        ...shareOfAvailability.data.map(item => item.year),
        ...forex.monthly.map(item => item.year),
        ...forex.yearly.map(item => item.year),
        ...inflation.map(item => item.year),
        ...discoTariff.data.map(item => item.year),
        ...transmissionLoss.monthly.map(item => item.year),
        ...transmissionLoss.yearly.map(item => item.year),
        ...loadOfftake.data.map(item => item.year)
      ])
    ].sort((a, b) => a - b);
    return {
      shareOfAvailability,
      forex,
      inflation,
      discoTariff,
      transmissionLoss,
      loadOfftake,
      years: allYears
    };
  } catch (error) {
    console.error('Error fetching metrics data:', error);
    throw error;
  }
};

export default {
  fetchMetricsData
};
