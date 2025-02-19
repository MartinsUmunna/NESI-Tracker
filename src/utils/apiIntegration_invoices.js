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

const formatGencoInvoiceData = (data) => {
  const yearMonthGroups = data.reduce((acc, item) => {
    const year = item.Year;
    const month = item.Month || 'Total';
    const key = `${year}-${month}`;
    
    if (!acc[key]) {
      acc[key] = [];
    }
    const amount = Math.round(parseFloat(item.Amount) || 0);
    acc[key].push({
      genco: item.Genco,
      amount
    });
    return acc;
  }, {});

  const formattedData = Object.entries(yearMonthGroups).map(([yearMonth, values]) => {
    const [year, month] = yearMonth.split('-');
    const total = values.reduce((sum, item) => sum + item.amount, 0);
    const gencoValues = values.reduce((acc, item) => {
      acc[item.genco] = (acc[item.genco] || 0) + item.amount;
      return acc;
    }, {});

    return {
      year: parseInt(year),
      month,
      value: total,
      gencos: Object.fromEntries(Object.entries(gencoValues).map(([k, v]) => [k, Math.round(v)]))
    };
  });

  const uniqueGencos = [...new Set(data.map(item => item.Genco))];
  return {
    data: formattedData,
    gencos: uniqueGencos
  };
};

const formatNBETPaymentData = (data) => {
  const yearMonthGroups = data.reduce((acc, item) => {
    const year = item.Year;
    const month = item.Month || 'Total';
    const key = `${year}-${month}`;
    
    if (!acc[key]) {
      acc[key] = [];
    }
    const amount = Math.round(parseFloat(item.Amount) || 0);
    acc[key].push({
      genco: item.Genco,
      amount
    });
    return acc;
  }, {});

  const formattedData = Object.entries(yearMonthGroups).map(([yearMonth, values]) => {
    const [year, month] = yearMonth.split('-');
    const total = values.reduce((sum, item) => sum + item.amount, 0);
    const gencoValues = values.reduce((acc, item) => {
      acc[item.genco] = (acc[item.genco] || 0) + item.amount;
      return acc;
    }, {});

    return {
      year: parseInt(year),
      month,
      value: total,
      gencos: Object.fromEntries(Object.entries(gencoValues).map(([k, v]) => [k, Math.round(v)]))
    };
  });

  const uniqueGencos = [...new Set(data.map(item => item.Genco))];
  return {
    data: formattedData,
    gencos: uniqueGencos
  };
};

const formatNBETOutstandingData = (data) => {
  const yearMonthGroups = data.reduce((acc, item) => {
    const year = item.Year;
    const month = item.Month || 'Total';
    const key = `${year}-${month}`;
    
    if (!acc[key]) {
      acc[key] = [];
    }
    const amount = Math.round(parseFloat(item.Amount) || 0);
    acc[key].push({
      genco: item.Genco,
      amount
    });
    return acc;
  }, {});

  const formattedData = Object.entries(yearMonthGroups).map(([yearMonth, values]) => {
    const [year, month] = yearMonth.split('-');
    const total = values.reduce((sum, item) => sum + item.amount, 0);
    const gencoValues = values.reduce((acc, item) => {
      acc[item.genco] = (acc[item.genco] || 0) + item.amount;
      return acc;
    }, {});

    return {
      year: parseInt(year),
      month,
      value: total,
      gencos: Object.fromEntries(Object.entries(gencoValues).map(([k, v]) => [k, Math.round(v)]))
    };
  });

  const uniqueGencos = [...new Set(data.map(item => item.Genco))];
  return {
    data: formattedData,
    gencos: uniqueGencos
  };
};

const formatDiscoNBETTransactions = (data) => {
  // Group by year-month and disco
  const yearMonthGroups = data.reduce((acc, item) => {
    const year = item.Year;
    const month = item.Month_Name;
    const key = `${year}-${month}`;
    
    if (!acc[key]) {
      acc[key] = [];
    }
    
    const invoice = Math.round(parseFloat(item.InvoiceFromNBET_Bn) || 0);
    const remittance = Math.round(parseFloat(item.RemittancetoNBET_Bn) || 0);
    
    acc[key].push({
      disco: normalizeDisco(item.Disco),
      invoice,
      remittance
    });
    return acc;
  }, {});

  // Process monthly data with totals
  const monthlyData = Object.entries(yearMonthGroups).map(([yearMonth, values]) => {
    const [year, month] = yearMonth.split('-');
    const totalInvoice = values.reduce((sum, item) => sum + item.invoice, 0);
    const totalRemittance = values.reduce((sum, item) => sum + item.remittance, 0);
    
    const discoValues = values.reduce((acc, item) => {
      if (!acc[item.disco]) {
        acc[item.disco] = { invoice: 0, remittance: 0 };
      }
      acc[item.disco].invoice += item.invoice;
      acc[item.disco].remittance += item.remittance;
      return acc;
    }, {});

    return {
      year: parseInt(year),
      month,
      values: {
        'Invoice from NBET': totalInvoice,
        'Remittance to NBET': totalRemittance
      },
      discos: Object.fromEntries(
        Object.entries(discoValues).map(([disco, values]) => [
          disco,
          {
            invoice: Math.round(values.invoice),
            remittance: Math.round(values.remittance)
          }
        ])
      )
    };
  });

  // Group by year for yearly totals
  const yearlyGroups = data.reduce((acc, item) => {
    const year = item.Year;
    if (!acc[year]) {
      acc[year] = [];
    }
    const invoice = parseFloat(item.InvoiceFromNBET_Bn) || 0;
    const remittance = parseFloat(item.RemittancetoNBET_Bn) || 0;
    acc[year].push({
      disco: normalizeDisco(item.Disco),
      invoice,
      remittance
    });
    return acc;
  }, {});

  // Process yearly data
  const yearlyData = Object.entries(yearlyGroups).map(([year, values]) => {
    const totalInvoice = values.reduce((sum, item) => sum + item.invoice, 0);
    const totalRemittance = values.reduce((sum, item) => sum + item.remittance, 0);
    
    const discoValues = values.reduce((acc, item) => {
      if (!acc[item.disco]) {
        acc[item.disco] = { invoice: 0, remittance: 0 };
      }
      acc[item.disco].invoice += item.invoice;
      acc[item.disco].remittance += item.remittance;
      return acc;
    }, {});

    return {
      year: parseInt(year),
      values: {
        'Invoice from NBET': Math.round(totalInvoice),
        'Remittance to NBET': Math.round(totalRemittance)
      },
      discos: Object.fromEntries(
        Object.entries(discoValues).map(([disco, values]) => [
          disco,
          {
            invoice: Math.round(values.invoice),
            remittance: Math.round(values.remittance)
          }
        ])
      )
    };
  }).sort((a, b) => a.year - b.year);

  const uniqueDiscos = [...new Set(data.map(item => normalizeDisco(item.Disco)))];
  
  return {
    monthly: monthlyData.sort((a, b) => a.year - b.year || a.month.localeCompare(b.month)),
    yearly: yearlyData,
    discos: uniqueDiscos,
    types: ['Invoice from NBET', 'Remittance to NBET']
  };
};

const formatDiscoMOTransactions = (data) => {
  // Group by year-month and disco
  const yearMonthGroups = data.reduce((acc, item) => {
    const year = item.Year;
    const month = item.Month_Name;
    const key = `${year}-${month}`;
    
    if (!acc[key]) {
      acc[key] = [];
    }
    
    const invoice = Math.round(parseFloat(item.InvoicefromMO_Bn) || 0);
    const remittance = Math.round(parseFloat(item.RemittancetoMO_Bn) || 0);
    
    acc[key].push({
      disco: normalizeDisco(item.Discos),
      invoice,
      remittance
    });
    return acc;
  }, {});

  // Process monthly data with totals
  const monthlyData = Object.entries(yearMonthGroups).map(([yearMonth, values]) => {
    const [year, month] = yearMonth.split('-');
    const totalInvoice = values.reduce((sum, item) => sum + item.invoice, 0);
    const totalRemittance = values.reduce((sum, item) => sum + item.remittance, 0);
    
    const discoValues = values.reduce((acc, item) => {
      if (!acc[item.disco]) {
        acc[item.disco] = { invoice: 0, remittance: 0 };
      }
      acc[item.disco].invoice += item.invoice;
      acc[item.disco].remittance += item.remittance;
      return acc;
    }, {});

    return {
      year: parseInt(year),
      month,
      values: {
        'Invoice from MO': totalInvoice,
        'Remittance to MO': totalRemittance
      },
      discos: Object.fromEntries(
        Object.entries(discoValues).map(([disco, values]) => [
          disco,
          {
            invoice: Math.round(values.invoice),
            remittance: Math.round(values.remittance)
          }
        ])
      )
    };
  });

  // Group by year for yearly totals
  const yearlyGroups = data.reduce((acc, item) => {
    const year = item.Year;
    if (!acc[year]) {
      acc[year] = [];
    }
    const invoice = parseFloat(item.InvoicefromMO_Bn) || 0;
    const remittance = parseFloat(item.RemittancetoMO_Bn) || 0;
    acc[year].push({
      disco: normalizeDisco(item.Discos),
      invoice,
      remittance
    });
    return acc;
  }, {});

  // Process yearly data
  const yearlyData = Object.entries(yearlyGroups).map(([year, values]) => {
    const totalInvoice = values.reduce((sum, item) => sum + item.invoice, 0);
    const totalRemittance = values.reduce((sum, item) => sum + item.remittance, 0);
    
    const discoValues = values.reduce((acc, item) => {
      if (!acc[item.disco]) {
        acc[item.disco] = { invoice: 0, remittance: 0 };
      }
      acc[item.disco].invoice += item.invoice;
      acc[item.disco].remittance += item.remittance;
      return acc;
    }, {});

    return {
      year: parseInt(year),
      values: {
        'Invoice from MO': Math.round(totalInvoice),
        'Remittance to MO': Math.round(totalRemittance)
      },
      discos: Object.fromEntries(
        Object.entries(discoValues).map(([disco, values]) => [
          disco,
          {
            invoice: Math.round(values.invoice),
            remittance: Math.round(values.remittance)
          }
        ])
      )
    };
  }).sort((a, b) => a.year - b.year);

  const uniqueDiscos = [...new Set(data.map(item => normalizeDisco(item.Discos)))];
  
  return {
    monthly: monthlyData.sort((a, b) => a.year - b.year || a.month.localeCompare(b.month)),
    yearly: yearlyData,
    discos: uniqueDiscos,
    types: ['Invoice from MO', 'Remittance to MO']
  };
};

export const fetchMetricsData2 = async () => {
  try {
    const [
      gencoInvoiceResponse,
      nbetPaymentResponse,
      nbetOutstandingResponse,
      discoNBETResponse,
      discoMOResponse
    ] = await Promise.all([
      axios.get(`${API_URL}/Genco-Invoice-toNBET`),
      axios.get(`${API_URL}/NBET-Payment-toGenco`),
      axios.get(`${API_URL}/NBET-Outstanding-Balance-toGenco`),
      axios.get(`${API_URL}/Disco-NBET-Remmitances-Invoice`),
      axios.get(`${API_URL}/Disco-MO-Remmitances-Invoice`)
    ]);

    const gencoInvoice = formatGencoInvoiceData(gencoInvoiceResponse.data);
    const nbetPayment = formatNBETPaymentData(nbetPaymentResponse.data);
    const nbetOutstanding = formatNBETOutstandingData(nbetOutstandingResponse.data);
    const discoNBET = formatDiscoNBETTransactions(discoNBETResponse.data);
    const discoMO = formatDiscoMOTransactions(discoMOResponse.data);

    const allYears = [
      ...new Set([
        ...gencoInvoice.data.map(item => item.year),
        ...nbetPayment.data.map(item => item.year),
        ...nbetOutstanding.data.map(item => item.year),
        ...discoNBET.yearly.map(item => item.year),
        ...discoMO.yearly.map(item => item.year)
      ])
    ].sort((a, b) => a - b);

    return {
      gencoInvoice,
      nbetPayment,
      nbetOutstanding,
      discoNBET,
      discoMO,
      years: allYears
    };
  } catch (error) {
    console.error('Error fetching invoice metrics data:', error);
    throw error;
  }
};

export default {
  fetchMetricsData2
};