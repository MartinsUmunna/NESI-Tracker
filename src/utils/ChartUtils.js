import { alpha } from '@mui/material/styles';
import { fetchMetricsDataCustomers } from 'src/utils/apiIntegration_Customers'; // <-- We import our new integration here

// Existing normalizeDisco function
const normalizeDisco = (disco) => {
  if (!disco) return disco;
  const lower = disco.toLowerCase().replace(/\s/g, '');
  if (lower === 'portharcourt') {
    return 'Port Harcourt';
  }
  return disco;
};

// Existing metrics object with added entries for our new metrics.
// NOTE: We are NOT removing or altering any of your existing metrics. We simply append the new ones.
export const metrics = {
  share_availability: {
    name: 'Share of Availability',
    unit: '%',
    view: 'both',
    filters: ['plant']
  },
  forex: {
    name: 'Forex Rate',
    unit: '₦/$',
    view: 'both',
    filters: ['currency_pair']
  },
  inflation: {
    name: 'Inflation Rate',
    unit: '%',
    view: 'both',
    filters: []
  },
  disco_tariff: {
    name: 'Disco Tariff',
    unit: '₦/kWh',
    view: 'both',
    filters: ['disco']
  },
  transmission_loss: {
    name: 'Transmission Loss Factor',
    unit: '%',
    view: 'both',
    filters: ['loss_factor_type']
  },
  load_offtake: {
    name: 'Load Offtake',
    unit: '%',
    view: 'both',
    filters: ['disco', 'offtake_type']
  },
  genco_invoice: {
    name: 'Genco Invoice to NBET',
    unit: '₦b',
    view: 'both',
    filters: ['genco']
  },
  nbet_payment: {
    name: 'NBET Payment to Genco',
    unit: '₦b',
    view: 'both',
    filters: ['genco']
  },
  nbet_outstanding: {
    name: 'NBET Outstanding Balance to Genco',
    unit: '₦b',
    view: 'both',
    filters: ['genco']
  },
  disco_nbet: {
    name: 'Disco NBET Transactions',
    unit: '₦/b',
    view: 'both',
    filters: ['disco'],
    variants: {
      default: 'Invoice from NBET',
      options: ['Invoice from NBET', 'Remittance to NBET']
    }
  },
  disco_mo: {
    name: 'Disco MO Transactions',
    unit: '₦/b',
    view: 'both',
    filters: ['disco'],
    variants: {
      default: 'Invoice from MO',
      options: ['Invoice from MO', 'Remittance to MO']
    }
  },
  energy_received: {
    name: 'Disco Energy Received',
    unit: 'GWh',
    view: 'both',
    filters: ['disco']
  },
  energy_billed: {
    name: 'Disco Energy Billed',
    unit: 'GWh',
    view: 'both',
    filters: ['disco']
  },
  revenue_billed: {
    name: 'Disco Revenue Billed',
    unit: '₦/m',
    view: 'both',
    filters: ['disco']
  },
  revenue_collected: {
    name: 'Disco Revenue Collected',
    unit: '₦/m',
    view: 'both',
    filters: ['disco']
  },
  capacity: {
    name: 'Genco Capacity (Mw)',
    unit: 'MW',
    view: 'both',
    filters: ['plant', 'capacity_type', 'source'],
    variants: {
      default: 'Installed Capacity (Mw)',
      options: ['Installed Capacity (Mw)', 'Avg. Available Capacity (Mw)']
    }
  },
  energySent: {
    name: 'Energy Sent out (MWh)',
    unit: 'MWh',
    view: 'both',
    filters: ['energy_source']
  },
  gencoEnergy: {
    name: 'Genco Energy Generated (MWh)',
    unit: 'MWh',
    view: 'yearly',
    filters: ['genco']
  },

  // ----------------- NEW METRICS FOR THE CUSTOMER INTEGRATION ------------------

  system_collapses: {
    name: 'System Collapses',
    unit: 'Count',
    view: 'yearly', // This metric only has yearly data
    filters: ['collapse_type'],
    variants: {
      default: 'All',
      options: [
        'All',
        'No. of Partial System Collapse',
        'No. of Total System Collapse'
      ]
    }
  },
  disco_metering_status: {
    name: 'Disco Metering Status (%)',
    unit: '%',
    view: 'yearly', // Yearly only
    filters: ['disco', 'meter_status_variant'], // single Disco, single variant
    variants: {
      default: 'MeteredCustomers',
      options: ['MeteredCustomers', 'MeteringGap']
    }
  },
  total_customer_population: {
    name: 'Total Customer Population',
    unit: 'Count',
    view: 'yearly', // Yearly only
    filters: ['disco', 'customer_type'] // single Disco, can also pick All or a single Customer Type
  },
  service_band_customers: {
    name: 'Customer Population by Service Band',
    unit: 'Count',
    view: 'both', // Has yearly & monthly data
    filters: ['disco', 'band_notation'],
    variants: {
      default: 'Band A',
      options: [
        'Band A',
        'Band B',
        'Band C',
        'Band D',
        'Band E',
        'Lifeline'
      ]
    }
  }
};

// Existing function for formatting values
export const formatValue = (value, unit) => {
  if (value === undefined || value === null || isNaN(value)) return '--';
  const formatCurrencyValue = (val) => {
    if (val >= 1000000000000) {
      return '₦' + (val / 1000000000000).toFixed(2) + 't';
    } else if (val >= 1000000000) {
      return '₦' + (val / 1000000000).toFixed(2) + 'b';
    } else if (val >= 1000000) {
      return '₦' + (val / 1000000).toFixed(2) + 'm';
    } else if (val >= 1000) {
      return '₦' + Math.round(val).toLocaleString();
    } else {
      return '₦' + Math.round(val).toLocaleString();
    }
  };
  if (unit === 'GWh') {
    return value.toFixed(0) + ' GWh';
  }
  if (unit === '%') {
    return Math.round(value) + '%';
  }
  if (unit === 'B' || unit === '₦b' || unit === '₦/b' || unit.includes('₦')) {
    return formatCurrencyValue(value);
  }
  return Math.round(value).toString();
};

// Existing function that returns chart options
export const getChartOptions = (selectedMetrics, metricsConfig, theme, customizer, chartType, showDataLabels = true, splitView = false, metricIndex = 0, chartSubType = 'standard', viewMode = 'yearly', activeFilters = {}) => {
  const safeSelectedMetrics = Array.isArray(selectedMetrics) ? selectedMetrics : [];
  const textColor = theme.palette.text.primary;
  const isDarkMode = customizer.activeMode === 'dark';
  const colorSequence = [
    theme.palette.primary.main,
    '#FF6B6B',
    '#4ECDC4',
    '#FFB900',
    '#7E57C2',
    '#26C6DA',
    '#2196F3',
    '#66BB6A',
    '#EC407A',
    '#AB47BC',
    '#F44336',
    '#00BCD4'
  ];
  const getMetricColor = (index) => colorSequence[index % colorSequence.length];

  const adjustedMetricsConfig = { ...metricsConfig };
  if (safeSelectedMetrics.includes('forex')) {
    const currency = activeFilters.currency_pair || 'Dollar (USD)';
    if (currency === 'POUNDS (GBP') {
      adjustedMetricsConfig.forex.unit = '₦/£';
    } else if (currency === 'EUROS') {
      adjustedMetricsConfig.forex.unit = '₦/€';
    } else {
      adjustedMetricsConfig.forex.unit = '₦/$';
    }
  }

  const strokeConfig = {
    curve: 'smooth',
    width: chartType === 'mixed' ? [3, 0] : chartType === 'line' ? 3 : chartType === 'area' ? 2 : 0,
    lineCap: 'round'
  };
  const fillConfig = {
    type: chartType === 'area' ? 'gradient' : 'solid',
    gradient: {
      shadeIntensity: 1,
      inverseColors: false,
      opacityFrom: chartType === 'area' ? 0.45 : 0.25,
      opacityTo: 0.05,
      stops: [0, 100]
    },
    opacity: chartType === 'bar' ? 0.85 : 1
  };

  const unitSet = [];
  safeSelectedMetrics.forEach((mKey) => {
    const unit = adjustedMetricsConfig[mKey]?.unit || '';
    if (!unitSet.includes(unit)) {
      unitSet.push(unit);
    }
  });

  const barConfig = {
    horizontal: false,
    columnWidth: '65%',
    borderRadius: 8,
    dataLabels: { position: 'top', offsetY: -20 }
  };
  if (chartType === 'bar' && chartSubType !== 'standard') {
    barConfig.stacked = chartSubType === 'stacked';
    if (chartSubType === 'clustered') {
      barConfig.columnWidth = '45%';
      barConfig.groups = safeSelectedMetrics.map((_, i) => `group-${i}`);
    }
  }

  return {
    chart: {
      type: chartType === 'mixed' ? 'line' : chartType,
      height: splitView ? 250 : 350,
      fontFamily: theme.typography.fontFamily,
      foreColor: textColor,
      toolbar: { show: false },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
        animateGradually: { enabled: true, delay: 150 },
        dynamicAnimation: { enabled: true, speed: 350 }
      },
      background: 'transparent'
    },
    colors: splitView ? [getMetricColor(metricIndex)] : safeSelectedMetrics.map((_, i) => getMetricColor(i)),
    stroke: strokeConfig,
    fill: fillConfig,
    plotOptions: { bar: barConfig },
    dataLabels: {
      enabled: showDataLabels,
      offsetY: -20,
      style: { fontSize: '12px', fontFamily: theme.typography.fontFamily, fontWeight: '600', colors: [textColor] },
      background: { enabled: false },
      formatter: (val, { seriesIndex }) => {
        const mKey = safeSelectedMetrics[seriesIndex];
        const unit = adjustedMetricsConfig[mKey]?.unit || '';
        return formatValue(val, unit);
      }
    },
    xaxis: {
      type: 'category',
      labels: { style: { colors: theme.palette.text.secondary, fontSize: '12px' }, rotate: -45 },
      axisBorder: { show: true, color: theme.palette.divider },
      axisTicks: { show: true, color: theme.palette.divider }
    },
    yaxis: unitSet.map((unit, idx) => ({
      title: { text: unit, style: { color: textColor, fontSize: '13px', fontFamily: theme.typography.fontFamily } },
      labels: {
        style: { colors: theme.palette.text.secondary, fontSize: '12px' },
        formatter: (val) => formatValue(val, unit)
      },
      opposite: idx % 2 === 1,
      forceNiceScale: true,
      tickAmount: 4
    })),
    grid: { show: false },
    legend: {
      show: !splitView,
      position: 'bottom',
      horizontalAlign: 'center',
      floating: false,
      fontSize: '13px',
      fontFamily: theme.typography.fontFamily,
      offsetY: 7,
      markers: { width: 8, height: 8, strokeWidth: 0, radius: 12, offsetX: 0, offsetY: 0 },
      itemMargin: { horizontal: 10, vertical: 5 }
    },
    tooltip: {
      enabled: true,
      shared: true,
      followCursor: true,
      intersect: false,
      theme: isDarkMode ? 'dark' : 'light',
      style: { fontSize: '12px', fontFamily: theme.typography.fontFamily },
      y: {
        formatter: (val, { seriesIndex }) => {
          const mKey = safeSelectedMetrics[seriesIndex];
          const unit = adjustedMetricsConfig[mKey]?.unit || '';
          return formatValue(val, unit);
        }
      }
    }
  };
};

// Existing function to prepare chart series
export const prepareSeries = (selectedMetrics, metricsConfig, chartData, chartType, chartSubType = 'standard', viewMode = 'yearly') => {
  if (!Array.isArray(chartData) || chartData.length === 0) return [];
  const safeSelectedMetrics = Array.isArray(selectedMetrics) ? selectedMetrics : [];
  return safeSelectedMetrics
    .map((metricKey, index) => {
      const metric = metricsConfig[metricKey];
      if (!metric) return null;
      const seriesType = chartType === 'mixed' ? (index % 2 === 0 ? 'line' : 'bar') : chartType;
      const dataArr = chartData.map(item => {
        const val = item[metricKey] !== undefined ? item[metricKey] : null;
        return { x: item.x, y: val };
      });
      return { name: metric.name, type: seriesType, data: dataArr };
    })
    .filter(Boolean);
};

// Existing function to generate yearly data
export const generateYearlyData = (allFetchedData, selectedMetrics, filters = {}) => {
  const safeSelectedMetrics = Array.isArray(selectedMetrics) ? selectedMetrics : [];
  const yearMap = {};
  const ensureYearEntry = (year) => {
    if (!yearMap[year]) { yearMap[year] = { x: year.toString() }; }
    return yearMap[year];
  };

  // share_availability
  if (safeSelectedMetrics.includes('share_availability') && allFetchedData.shareOfAvailability && Array.isArray(allFetchedData.shareOfAvailability.data)) {
    allFetchedData.shareOfAvailability.data.forEach(item => {
      const { year, value, plants } = item;
      const row = ensureYearEntry(year);
      let finalValue = value;
      if (filters.plant && plants[filters.plant] !== undefined) { finalValue = plants[filters.plant]; }
      row['share_availability'] = finalValue;
    });
  }

  // forex
  if (safeSelectedMetrics.includes('forex') && allFetchedData.forex) {
    if (Array.isArray(allFetchedData.forex.yearly)) {
      allFetchedData.forex.yearly.forEach(item => {
        const row = ensureYearEntry(item.year);
        const allPairs = item.values;
        const chosenPair = filters.currency_pair ? filters.currency_pair : 'Dollar (USD)';
        row['forex'] = allPairs[chosenPair] !== undefined ? allPairs[chosenPair] : null;
      });
    }
  }

  // inflation
  if (safeSelectedMetrics.includes('inflation') && Array.isArray(allFetchedData.inflation)) {
    allFetchedData.inflation.forEach(item => {
      const row = ensureYearEntry(item.year);
      row['inflation'] = item.value;
    });
  }

  // disco_tariff
  if (safeSelectedMetrics.includes('disco_tariff') && allFetchedData.discoTariff && Array.isArray(allFetchedData.discoTariff.data)) {
    allFetchedData.discoTariff.data.forEach(item => {
      const { year, value, discos } = item;
      const row = ensureYearEntry(item.year);
      let finalValue = value;
      if (filters.disco && discos[normalizeDisco(filters.disco)] !== undefined) {
        finalValue = discos[normalizeDisco(filters.disco)];
      }
      row['disco_tariff'] = finalValue;
    });
  }

  // transmission_loss
  if (safeSelectedMetrics.includes('transmission_loss') && allFetchedData.transmissionLoss) {
    if (Array.isArray(allFetchedData.transmissionLoss.yearly)) {
      allFetchedData.transmissionLoss.yearly.forEach(item => {
        const row = ensureYearEntry(item.year);
        const tFactor = item.values['Transmission Loss Factor'];
        const myto = item.values['MYTO Assumed TLF'];
        const chosen = filters.loss_factor_type ? filters.loss_factor_type : 'Transmission Loss Factor';
        row['transmission_loss'] = chosen === 'Transmission Loss Factor' ? tFactor : myto;
      });
    }
  }

  // load_offtake
  if (safeSelectedMetrics.includes('load_offtake') && allFetchedData.loadOfftake && Array.isArray(allFetchedData.loadOfftake.data)) {
    allFetchedData.loadOfftake.data.forEach(item => {
      const row = ensureYearEntry(item.year);
      const chosen = filters.offtake_type ? filters.offtake_type : 'Actual Load Offtake';
      if (filters.disco && item.discos) {
        let discoValue;
        const normDisco = normalizeDisco(filters.disco);
        if (chosen === 'Actual Load Offtake' && item.discos.Actuals && item.discos.Actuals[normDisco] !== undefined) {
          discoValue = item.discos.Actuals[normDisco];
        } else if (chosen === 'MYTO Assumed' && item.discos.MYTO && item.discos.MYTO[normDisco] !== undefined) {
          discoValue = item.discos.MYTO[normDisco];
        }
        row['load_offtake'] = discoValue !== undefined
          ? discoValue
          : (chosen === 'Actual Load Offtake' ? item.values['Actual Load Offtake'] : item.values['MYTO Assumed']);
      } else {
        row['load_offtake'] = chosen === 'Actual Load Offtake'
          ? item.values['Actual Load Offtake']
          : item.values['MYTO Assumed'];
      }
    });
  }

  // genco_invoice
  if (safeSelectedMetrics.includes('genco_invoice') && allFetchedData.gencoInvoice && Array.isArray(allFetchedData.gencoInvoice.data)) {
    allFetchedData.gencoInvoice.data.forEach(item => {
      const row = ensureYearEntry(item.year);
      let finalValue = item.value;
      if (filters.genco && item.gencos[filters.genco] !== undefined) { finalValue = item.gencos[filters.genco]; }
      row['genco_invoice'] = finalValue;
    });
  }

  // nbet_payment
  if (safeSelectedMetrics.includes('nbet_payment') && allFetchedData.nbetPayment && Array.isArray(allFetchedData.nbetPayment.data)) {
    allFetchedData.nbetPayment.data.forEach(item => {
      const row = ensureYearEntry(item.year);
      let finalValue = item.value;
      if (filters.genco && item.gencos[filters.genco] !== undefined) { finalValue = item.gencos[filters.genco]; }
      row['nbet_payment'] = finalValue;
    });
  }

  // nbet_outstanding
  if (safeSelectedMetrics.includes('nbet_outstanding') && allFetchedData.nbetOutstanding && Array.isArray(allFetchedData.nbetOutstanding.data)) {
    allFetchedData.nbetOutstanding.data.forEach(item => {
      const row = ensureYearEntry(item.year);
      let finalValue = item.value;
      if (filters.genco && item.gencos[filters.genco] !== undefined) { finalValue = item.gencos[filters.genco]; }
      row['nbet_outstanding'] = finalValue;
    });
  }

  // disco_nbet
  if (safeSelectedMetrics.includes('disco_nbet') && allFetchedData.discoNBET) {
    allFetchedData.discoNBET.yearly.forEach(item => {
      const row = ensureYearEntry(item.year);
      const variant = filters.disco_nbet_type || 'Invoice from NBET';
      if (filters.disco && item.discos) {
        const normDisco = normalizeDisco(filters.disco);
        if (item.discos[normDisco] && item.discos[normDisco][variant === 'Invoice from NBET' ? 'invoice' : 'remittance'] !== undefined) {
          row['disco_nbet'] = Number(item.discos[normDisco][variant === 'Invoice from NBET' ? 'invoice' : 'remittance']);
        } else {
          row['disco_nbet'] = item.values[variant] !== undefined ? Number(item.values[variant]) : null;
        }
      } else {
        row['disco_nbet'] = item.values[variant] !== undefined ? Number(item.values[variant]) : null;
      }
      row['disco_nbet_invoice'] = Number(item.values['Invoice from NBET']);
      row['disco_nbet_remittance'] = Number(item.values['Remittance to NBET']);
    });
  }

  // disco_mo
  if (safeSelectedMetrics.includes('disco_mo') && allFetchedData.discoMO) {
    allFetchedData.discoMO.yearly.forEach(item => {
      const row = ensureYearEntry(item.year);
      const variant = filters.disco_mo_type || 'Invoice from MO';
      if (filters.disco && item.discos) {
        const normDisco = normalizeDisco(filters.disco);
        if (item.discos[normDisco] && item.discos[normDisco][variant === 'Invoice from MO' ? 'invoice' : 'remittance'] !== undefined) {
          row['disco_mo'] = Number(item.discos[normDisco][variant === 'Invoice from MO' ? 'invoice' : 'remittance']);
        } else {
          row['disco_mo'] = item.values[variant] !== undefined ? Number(item.values[variant]) : null;
        }
      } else {
        row['disco_mo'] = item.values[variant] !== undefined ? Number(item.values[variant]) : null;
      }
      row['disco_mo_invoice'] = Number(item.values['Invoice from MO']);
      row['disco_mo_remittance'] = Number(item.values['Remittance to MO']);
    });
  }

  // energy_received
  if (safeSelectedMetrics.includes('energy_received') && allFetchedData.energyData && allFetchedData.energyData.discoEnergyReceived && Array.isArray(allFetchedData.energyData.discoEnergyReceived.data)) {
    allFetchedData.energyData.discoEnergyReceived.data.forEach(item => {
      const { year, value, discos } = item;
      const row = ensureYearEntry(year);
      let finalValue = value;
      if (filters.disco && discos[normalizeDisco(filters.disco)] !== undefined) {
        finalValue = discos[normalizeDisco(filters.disco)];
      }
      row['energy_received'] = finalValue;
    });
  }

  // energy_billed
  if (safeSelectedMetrics.includes('energy_billed') && allFetchedData.energyData && allFetchedData.energyData.discoEnergyBilled && Array.isArray(allFetchedData.energyData.discoEnergyBilled.data)) {
    allFetchedData.energyData.discoEnergyBilled.data.forEach(item => {
      const { year, value, discos } = item;
      const row = ensureYearEntry(year);
      let finalValue = value;
      if (filters.disco && discos[normalizeDisco(filters.disco)] !== undefined) {
        finalValue = discos[normalizeDisco(filters.disco)];
      }
      row['energy_billed'] = finalValue;
    });
  }

  // revenue_billed
  if (safeSelectedMetrics.includes('revenue_billed') && allFetchedData.energyData && allFetchedData.energyData.discoRevenueBilled && Array.isArray(allFetchedData.energyData.discoRevenueBilled.data)) {
    allFetchedData.energyData.discoRevenueBilled.data.forEach(item => {
      const row = ensureYearEntry(item.year);
      let finalValue = item.value;
      if (filters.disco && item.discos && item.discos[normalizeDisco(filters.disco)] !== undefined) {
        finalValue = item.discos[normalizeDisco(filters.disco)];
      }
      row['revenue_billed'] = finalValue;
    });
  }

  // revenue_collected
  if (safeSelectedMetrics.includes('revenue_collected') && allFetchedData.energyData && allFetchedData.energyData.discoRevenueCollected && Array.isArray(allFetchedData.energyData.discoRevenueCollected.data)) {
    allFetchedData.energyData.discoRevenueCollected.data.forEach(item => {
      const row = ensureYearEntry(item.year);
      let finalValue = item.value;
      if (filters.disco && item.discos && item.discos[normalizeDisco(filters.disco)] !== undefined) {
        finalValue = item.discos[normalizeDisco(filters.disco)];
      }
      row['revenue_collected'] = finalValue;
    });
  }

  // capacity
  if (safeSelectedMetrics.includes('capacity') && allFetchedData.capacity && allFetchedData.capacity.monthly) {
    allFetchedData.capacity.yearly.forEach(item => {
      const row = ensureYearEntry(item.year);
      const variant = filters.capacity_type || 'Installed Capacity (Mw)';
      if (filters.plant) {
        if (item.byPlant[filters.plant]) {
          row['capacity'] = variant === 'Installed Capacity (Mw)'
            ? item.byPlant[filters.plant].installed
            : item.byPlant[filters.plant].available;
        } else {
          row['capacity'] = null;
        }
      } else if (filters.source && allFetchedData.capacity.bySource && allFetchedData.capacity.bySource.yearly && allFetchedData.capacity.bySource.yearly[filters.source] && Array.isArray(allFetchedData.capacity.bySource.yearly[filters.source])) {
        const sourceData = allFetchedData.capacity.bySource.yearly[filters.source];
        const rec = sourceData.find(r => r.year === item.year);
        row['capacity'] = rec
          ? (variant === 'Installed Capacity (Mw)' ? rec.overall.installed : rec.overall.available)
          : (variant === 'Installed Capacity (Mw)' ? item.overall.installed : item.overall.available);
      } else {
        row['capacity'] = variant === 'Installed Capacity (Mw)'
          ? item.overall.installed
          : item.overall.available;
      }
    });
  }

  // energySent
  if (safeSelectedMetrics.includes('energySent') && allFetchedData.energySent) {
    if (Array.isArray(allFetchedData.energySent.yearly)) {
      allFetchedData.energySent.yearly.forEach(item => {
        const row = ensureYearEntry(item.year);
        const source = filters.energy_source || allFetchedData.energySent.defaultSource;
        row['energySent'] = item.values[source] !== undefined ? item.values[source] : null;
      });
    }
  }

  // gencoEnergy
  if (safeSelectedMetrics.includes('gencoEnergy') && allFetchedData.gencoEnergy && Array.isArray(allFetchedData.gencoEnergy.yearly)) {
    allFetchedData.gencoEnergy.yearly.forEach(item => {
      const row = ensureYearEntry(item.year);
      let finalValue = item.total;
      if (filters.genco && item.gencos[filters.genco] !== undefined) { finalValue = item.gencos[filters.genco]; }
      row['gencoEnergy'] = finalValue;
    });
  }

  // ----------------- NEW METRICS FROM CUSTOMERS START HERE ------------------

  // system_collapses
  if (safeSelectedMetrics.includes('system_collapses') && allFetchedData.systemCollapses) {
    allFetchedData.systemCollapses.yearly.forEach(item => {
      const row = ensureYearEntry(item.year);
      const chosen = filters.collapse_type || 'All';
      // "values" structure: { All, No. of Partial System Collapse, No. of Total System Collapse }
      const val = item.values[chosen] !== undefined ? item.values[chosen] : null;
      row['system_collapses'] = val;
    });
  }

  // disco_metering_status
  if (safeSelectedMetrics.includes('disco_metering_status') && allFetchedData.discoMeteringStatus) {
    allFetchedData.discoMeteringStatus.yearly.forEach(item => {
      const row = ensureYearEntry(item.year);
      const variant = filters.meter_status_variant || 'MeteredCustomers';
      // "values" structure: { MeteredCustomers, MeteringGap }
      if (filters.disco && item.discos) {
        const normDisco = normalizeDisco(filters.disco);
        if (item.discos[normDisco] && item.discos[normDisco][variant] !== undefined) {
          row['disco_metering_status'] = item.discos[normDisco][variant];
        } else {
          row['disco_metering_status'] = item.values[variant] !== undefined ? item.values[variant] : null;
        }
      } else {
        row['disco_metering_status'] = item.values[variant] !== undefined ? item.values[variant] : null;
      }
    });
  }

  // total_customer_population
  if (safeSelectedMetrics.includes('total_customer_population') && allFetchedData.totalCustomerPopulation) {
    allFetchedData.totalCustomerPopulation.yearly.forEach(item => {
      const row = ensureYearEntry(item.year);
      const cType = filters.customer_type || 'All';
      // "values": { All, 'Metered Customer', 'Unmetered Customer' }
      if (filters.disco && item.discos) {
        const normDisco = normalizeDisco(filters.disco);
        if (item.discos[normDisco] && item.discos[normDisco][cType] !== undefined) {
          row['total_customer_population'] = item.discos[normDisco][cType];
        } else {
          row['total_customer_population'] = item.values[cType] !== undefined ? item.values[cType] : null;
        }
      } else {
        row['total_customer_population'] = item.values[cType] !== undefined ? item.values[cType] : null;
      }
    });
  }

  // service_band_customers
  if (safeSelectedMetrics.includes('service_band_customers') && allFetchedData.serviceBandCustomers) {
    allFetchedData.serviceBandCustomers.yearly.forEach(item => {
      const row = ensureYearEntry(item.year);
      const band = filters.band_notation || 'Band A';
      if (filters.disco && item.discos) {
        const normDisco = normalizeDisco(filters.disco);
        if (item.discos[normDisco] && item.discos[normDisco][band] !== undefined) {
          row['service_band_customers'] = item.discos[normDisco][band];
        } else {
          row['service_band_customers'] = item.values[band] !== undefined ? item.values[band] : null;
        }
      } else {
        row['service_band_customers'] = item.values[band] !== undefined ? item.values[band] : null;
      }
    });
  }

  // ----------------- NEW METRICS FROM CUSTOMERS END ------------------

  return Object.keys(yearMap)
    .map(year => yearMap[year])
    .sort((a, b) => Number(a.x) - Number(b.x));
};

// Existing function to generate monthly data
export const generateMonthlyData = (allFetchedData, selectedMetrics, filters = {}, selectedYear) => {
  const safeSelectedMetrics = Array.isArray(selectedMetrics) ? selectedMetrics : [];
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June','July', 'August', 'September', 'October', 'November', 'December'];
  const monthMap = {};
  monthNames.forEach(m => { monthMap[m] = { x: m }; });

  // forex
  if (safeSelectedMetrics.includes('forex') && allFetchedData.forex && Array.isArray(allFetchedData.forex.monthly)) {
    const chosenPair = filters.currency_pair ? filters.currency_pair : 'Dollar (USD)';
    allFetchedData.forex.monthly.filter(item => item.year === selectedYear).forEach(item => {
      let rawMonth = item.month || item.Month;
      if (!rawMonth) return;
      let realMonth = '';
      const lowerRaw = rawMonth.toString().toLowerCase();
      const found = monthNames.find(m => m.toLowerCase() === lowerRaw);
      if (found) { realMonth = found; }
      else {
        const numericMonth = parseInt(rawMonth, 10);
        if (!isNaN(numericMonth) && numericMonth >= 0 && numericMonth < 12) {
          realMonth = monthNames[numericMonth];
        } else {
          realMonth = rawMonth;
        }
      }
      monthMap[realMonth] = { x: realMonth, ...monthMap[realMonth] };
      const val = item.values[chosenPair] !== undefined ? Number(item.values[chosenPair]) : null;
      monthMap[realMonth]['forex'] = val;
    });
  }

  // transmission_loss
  if (safeSelectedMetrics.includes('transmission_loss') && allFetchedData.transmissionLoss && Array.isArray(allFetchedData.transmissionLoss.monthly)) {
    const chosen = filters.loss_factor_type ? filters.loss_factor_type : 'Transmission Loss Factor';
    allFetchedData.transmissionLoss.monthly.filter(item => item.year === selectedYear).forEach(item => {
      let rawMonth = item.month || item.Month_Name;
      if (!rawMonth) return;
      let realMonth = '';
      const lowerRaw = rawMonth.toString().toLowerCase();
      const found = monthNames.find(m => m.toLowerCase() === lowerRaw);
      if (found) { realMonth = found; }
      else {
        const numericMonth = parseInt(rawMonth, 10);
        if (!isNaN(numericMonth) && numericMonth >= 0 && numericMonth < 12) {
          realMonth = monthNames[numericMonth];
        } else {
          realMonth = rawMonth;
        }
      }
      monthMap[realMonth] = { x: realMonth, ...monthMap[realMonth] };
      const val = item.values[chosen] !== undefined ? Number(item.values[chosen]) : null;
      monthMap[realMonth]['transmission_loss'] = val;
    });
  }

  // disco_nbet
  if (safeSelectedMetrics.includes('disco_nbet') && allFetchedData.discoNBET && Array.isArray(allFetchedData.discoNBET.monthly)) {
    const variant = filters.disco_nbet_type || 'Invoice from NBET';
    allFetchedData.discoNBET.monthly.filter(item => item.year === selectedYear).forEach(item => {
      let rawMonth = item.month || item.Month_Name;
      if (!rawMonth) return;
      let realMonth = '';
      const lowerRaw = rawMonth.toString().toLowerCase();
      const found = monthNames.find(m => m.toLowerCase() === lowerRaw);
      if (found) { realMonth = found; }
      else {
        const numericMonth = parseInt(rawMonth, 10);
        if (!isNaN(numericMonth) && numericMonth >= 0 && numericMonth < 12) {
          realMonth = monthNames[numericMonth];
        } else {
          realMonth = rawMonth;
        }
      }
      monthMap[realMonth] = { x: realMonth, ...monthMap[realMonth] };
      let val;
      if (filters.disco && item.discos) {
        const normDisco = normalizeDisco(filters.disco);
        if (item.discos[normDisco] && item.discos[normDisco][variant === 'Invoice from NBET' ? 'invoice' : 'remittance'] !== undefined) {
          val = Number(item.discos[normDisco][variant === 'Invoice from NBET' ? 'invoice' : 'remittance']);
        } else {
          val = item.values[variant] !== undefined ? Number(item.values[variant]) : null;
        }
      } else {
        val = item.values[variant] !== undefined ? Number(item.values[variant]) : null;
      }
      monthMap[realMonth]['disco_nbet'] = val;
      monthMap[realMonth]['disco_nbet_invoice'] = Number(item.values['Invoice from NBET']);
      monthMap[realMonth]['disco_nbet_remittance'] = Number(item.values['Remittance to NBET']);
    });
  }

  // disco_mo
  if (safeSelectedMetrics.includes('disco_mo') && allFetchedData.discoMO && Array.isArray(allFetchedData.discoMO.monthly)) {
    const variant = filters.disco_mo_type || 'Invoice from MO';
    allFetchedData.discoMO.monthly.filter(item => item.year === selectedYear).forEach(item => {
      let rawMonth = item.month || item.Month_Name;
      if (!rawMonth) return;
      let realMonth = '';
      const lowerRaw = rawMonth.toString().toLowerCase();
      const found = monthNames.find(m => m.toLowerCase() === lowerRaw);
      if (found) { realMonth = found; }
      else {
        const numericMonth = parseInt(rawMonth, 10);
        if (!isNaN(numericMonth) && numericMonth >= 0 && numericMonth < 12) {
          realMonth = monthNames[numericMonth];
        } else {
          realMonth = rawMonth;
        }
      }
      monthMap[realMonth] = { x: realMonth, ...monthMap[realMonth] };
      let val;
      if (filters.disco && item.discos) {
        const normDisco = normalizeDisco(filters.disco);
        if (item.discos[normDisco] && item.discos[normDisco][variant === 'Invoice from MO' ? 'invoice' : 'remittance'] !== undefined) {
          val = Number(item.discos[normDisco][variant === 'Invoice from MO' ? 'invoice' : 'remittance']);
        } else {
          val = item.values[variant] !== undefined ? Number(item.values[variant]) : null;
        }
      } else {
        val = item.values[variant] !== undefined ? Number(item.values[variant]) : null;
      }
      monthMap[realMonth]['disco_mo'] = val;
      monthMap[realMonth]['disco_mo_invoice'] = Number(item.values['Invoice from MO']);
      monthMap[realMonth]['disco_mo_remittance'] = Number(item.values['Remittance to MO']);
    });
  }

  // energySent
  if (safeSelectedMetrics.includes('energySent') && allFetchedData.energySent && Array.isArray(allFetchedData.energySent.monthly)) {
    allFetchedData.energySent.monthly.filter(item => item.year === selectedYear).forEach(item => {
      let rawMonth = item.month || item.Month_Name;
      if (!rawMonth) return;
      let realMonth = '';
      const lowerRaw = rawMonth.toString().toLowerCase();
      const found = monthNames.find(m => m.toLowerCase() === lowerRaw);
      if (found) { realMonth = found; }
      else {
        const numericMonth = parseInt(rawMonth, 10);
        if (!isNaN(numericMonth) && numericMonth >= 0 && numericMonth < 12) {
          realMonth = monthNames[numericMonth];
        } else {
          realMonth = rawMonth;
        }
      }
      monthMap[realMonth] = { x: realMonth, ...monthMap[realMonth] };
      const source = filters.energy_source || allFetchedData.energySent.defaultSource;
      const val = item.values[source] !== undefined ? Number(item.values[source]) : null;
      monthMap[realMonth]['energySent'] = val;
    });
  }

  // gencoEnergy
  if (safeSelectedMetrics.includes('gencoEnergy') && allFetchedData.gencoEnergy && Array.isArray(allFetchedData.gencoEnergy.monthly)) {
    allFetchedData.gencoEnergy.monthly.filter(item => item.year === selectedYear).forEach(item => {
      let rawMonth = item.month || item.Month_Name;
      if (!rawMonth) return;
      let realMonth = '';
      const lowerRaw = rawMonth.toString().toLowerCase();
      const found = monthNames.find(m => m.toLowerCase() === lowerRaw);
      if (found) { realMonth = found; }
      else {
        const numericMonth = parseInt(rawMonth, 10);
        if (!isNaN(numericMonth) && numericMonth >= 0 && numericMonth < 12) {
          realMonth = monthNames[numericMonth];
        } else {
          realMonth = rawMonth;
        }
      }
      monthMap[realMonth] = { x: realMonth, ...monthMap[realMonth] };
      monthMap[realMonth]['gencoEnergy'] = null; // there's no monthly detail in snippet
    });
  }

  // capacity (averaging any monthly capacity data if it exists)
  if (safeSelectedMetrics.includes('capacity') && allFetchedData.capacity && allFetchedData.capacity.monthly) {
    // Process monthly capacity records for the selected year
    allFetchedData.capacity.monthly
      .filter(item => item.year === selectedYear)
      .forEach(item => {
        const rowKey = item.month;
        if (rowKey && monthMap[rowKey]) {
          const variant = filters.capacity_type || 'Installed Capacity (Mw)';
          let value = null;
          if (filters.plant) {
            if (item.byPlant[filters.plant]) {
              value = variant === 'Installed Capacity (Mw)'
                ? item.byPlant[filters.plant].installed
                : item.byPlant[filters.plant].available;
            }
          } else if (
            filters.source &&
            allFetchedData.capacity.bySource &&
            allFetchedData.capacity.bySource.monthly &&
            allFetchedData.capacity.bySource.monthly[filters.source] &&
            Array.isArray(allFetchedData.capacity.bySource.monthly[filters.source])
          ) {
            const sourceData = allFetchedData.capacity.bySource.monthly[filters.source];
            const rec = sourceData.find(r => r.year === item.year && r.month === item.month);
            value = rec
              ? (variant === 'Installed Capacity (Mw)' ? rec.overall.installed : rec.overall.available)
              : (variant === 'Installed Capacity (Mw)' ? item.overall.installed : item.overall.available);
          } else {
            value = variant === 'Installed Capacity (Mw)'
              ? item.overall.installed
              : item.overall.available;
          }
          if (value !== null && !isNaN(value)) {
            if (!monthMap[rowKey].hasOwnProperty('capacity')) {
              monthMap[rowKey].capacity = 0;
              monthMap[rowKey].capacityCount = 0;
            }
            monthMap[rowKey].capacity += Number(value);
            monthMap[rowKey].capacityCount += 1;
          }
        }
      });

    Object.keys(monthMap).forEach(m => {
      if (monthMap[m].capacityCount) {
        monthMap[m].capacity = monthMap[m].capacity / monthMap[m].capacityCount;
        delete monthMap[m].capacityCount;
      }
    });
  }

  // ----------------- NEW METRICS FROM CUSTOMERS (MONTHLY) ------------------
  // system_collapses: no monthly data, do nothing

  // disco_metering_status: no monthly data, do nothing

  // total_customer_population: no monthly mode, do nothing

  // service_band_customers
  if (safeSelectedMetrics.includes('service_band_customers') && allFetchedData.serviceBandCustomers && Array.isArray(allFetchedData.serviceBandCustomers.monthly)) {
    allFetchedData.serviceBandCustomers.monthly
      .filter(item => item.year === selectedYear)
      .forEach(item => {
        let rawMonth = item.month;
        if (!rawMonth) return;
        let realMonth = '';
        const lowerRaw = rawMonth.toLowerCase();
        const found = monthNames.find(m => m.toLowerCase() === lowerRaw);
        if (found) {
          realMonth = found;
        } else {
          const numericMonth = parseInt(rawMonth, 10);
          if (!isNaN(numericMonth) && numericMonth >= 0 && numericMonth < 12) {
            realMonth = monthNames[numericMonth];
          } else {
            realMonth = rawMonth;
          }
        }
        monthMap[realMonth] = { x: realMonth, ...monthMap[realMonth] };
        const band = filters.band_notation || 'Band A';
        if (filters.disco && item.discos) {
          const normDisco = normalizeDisco(filters.disco);
          if (item.discos[normDisco] && item.discos[normDisco][band] !== undefined) {
            monthMap[realMonth]['service_band_customers'] = item.discos[normDisco][band];
          } else {
            monthMap[realMonth]['service_band_customers'] = item.values[band] !== undefined ? item.values[band] : null;
          }
        } else {
          monthMap[realMonth]['service_band_customers'] = item.values[band] !== undefined ? item.values[band] : null;
        }
      });
  }
  // ----------------- NEW METRICS END ------------------

  const dataArray = monthNames.map(m => monthMap[m]);
  return dataArray;
};

// Existing function to detect filters
export const detectFilters = (allFetchedData, selectedMetrics = []) => {
  const safeSelectedMetrics = Array.isArray(selectedMetrics) ? selectedMetrics : [];
  const filterStructure = {
    viewMode: { name: 'View Mode', values: ['Yearly', 'Monthly'], type: 'string', isPrimary: true },
    year: { name: 'Year', values: [], type: 'number', isPrimary: true }
  };

  // existing code collecting year values from various data sets
  if (allFetchedData.shareOfAvailability && Array.isArray(allFetchedData.shareOfAvailability.data)) {
    allFetchedData.shareOfAvailability.data.forEach(item => {
      if (!filterStructure.year.values.includes(item.year)) { filterStructure.year.values.push(item.year); }
    });
  }
  if (allFetchedData.forex) {
    if (Array.isArray(allFetchedData.forex.yearly)) {
      allFetchedData.forex.yearly.forEach(item => {
        if (!filterStructure.year.values.includes(item.year)) { filterStructure.year.values.push(item.year); }
      });
    }
    if (Array.isArray(allFetchedData.forex.monthly)) {
      allFetchedData.forex.monthly.forEach(item => {
        if (!filterStructure.year.values.includes(item.year)) { filterStructure.year.values.push(item.year); }
      });
    }
  }
  if (Array.isArray(allFetchedData.inflation)) {
    allFetchedData.inflation.forEach(item => {
      if (!filterStructure.year.values.includes(item.year)) { filterStructure.year.values.push(item.year); }
    });
  }
  if (allFetchedData.discoTariff && Array.isArray(allFetchedData.discoTariff.data)) {
    allFetchedData.discoTariff.data.forEach(item => {
      if (!filterStructure.year.values.includes(item.year)) { filterStructure.year.values.push(item.year); }
    });
  }
  if (allFetchedData.transmissionLoss) {
    if (Array.isArray(allFetchedData.transmissionLoss.yearly)) {
      allFetchedData.transmissionLoss.yearly.forEach(item => {
        if (!filterStructure.year.values.includes(item.year)) { filterStructure.year.values.push(item.year); }
      });
    }
    if (Array.isArray(allFetchedData.transmissionLoss.monthly)) {
      allFetchedData.transmissionLoss.monthly.forEach(item => {
        if (!filterStructure.year.values.includes(item.year)) { filterStructure.year.values.push(item.year); }
      });
    }
  }
  if (allFetchedData.loadOfftake && Array.isArray(allFetchedData.loadOfftake.data)) {
    allFetchedData.loadOfftake.data.forEach(item => {
      if (!filterStructure.year.values.includes(item.year)) { filterStructure.year.values.push(item.year); }
    });
  }
  if (allFetchedData.gencoInvoice && Array.isArray(allFetchedData.gencoInvoice.data)) {
    allFetchedData.gencoInvoice.data.forEach(item => {
      if (!filterStructure.year.values.includes(item.year)) { filterStructure.year.values.push(item.year); }
    });
  }
  if (allFetchedData.nbetPayment && Array.isArray(allFetchedData.nbetPayment.data)) {
    allFetchedData.nbetPayment.data.forEach(item => {
      if (!filterStructure.year.values.includes(item.year)) { filterStructure.year.values.push(item.year); }
    });
  }
  if (allFetchedData.nbetOutstanding && Array.isArray(allFetchedData.nbetOutstanding.data)) {
    allFetchedData.nbetOutstanding.data.forEach(item => {
      if (!filterStructure.year.values.includes(item.year)) { filterStructure.year.values.push(item.year); }
    });
  }
  if (allFetchedData.discoNBET) {
    if (Array.isArray(allFetchedData.discoNBET.yearly)) {
      allFetchedData.discoNBET.yearly.forEach(item => {
        if (!filterStructure.year.values.includes(item.year)) { filterStructure.year.values.push(item.year); }
      });
    }
    if (Array.isArray(allFetchedData.discoNBET.monthly)) {
      allFetchedData.discoNBET.monthly.forEach(item => {
        if (!filterStructure.year.values.includes(item.year)) { filterStructure.year.values.push(item.year); }
      });
    }
  }
  if (allFetchedData.discoMO) {
    if (Array.isArray(allFetchedData.discoMO.yearly)) {
      allFetchedData.discoMO.yearly.forEach(item => {
        if (!filterStructure.year.values.includes(item.year)) { filterStructure.year.values.push(item.year); }
      });
    }
    if (Array.isArray(allFetchedData.discoMO.monthly)) {
      allFetchedData.discoMO.monthly.forEach(item => {
        if (!filterStructure.year.values.includes(item.year)) { filterStructure.year.values.push(item.year); }
      });
    }
  }
  if (safeSelectedMetrics.includes('gencoEnergy') && allFetchedData.gencoEnergy && Array.isArray(allFetchedData.gencoEnergy.yearly)) {
    allFetchedData.gencoEnergy.yearly.forEach(item => {
      if (!filterStructure.year.values.includes(item.year)) { filterStructure.year.values.push(item.year); }
    });
  }
  if (safeSelectedMetrics.includes('capacity') && allFetchedData.capacity && allFetchedData.capacity.yearly) {
    allFetchedData.capacity.yearly.forEach(item => {
      if (!filterStructure.year.values.includes(item.year)) { filterStructure.year.values.push(item.year); }
    });
  }
  if (safeSelectedMetrics.includes('energySent') && allFetchedData.energySent) {
    if (Array.isArray(allFetchedData.energySent.yearly)) {
      allFetchedData.energySent.yearly.forEach(item => {
        if (!filterStructure.year.values.includes(item.year)) { filterStructure.year.values.push(item.year); }
      });
    }
    if (Array.isArray(allFetchedData.energySent.monthly)) {
      allFetchedData.energySent.monthly.forEach(item => {
        if (!filterStructure.year.values.includes(item.year)) { filterStructure.year.values.push(item.year); }
      });
    }
  }

  // ----------------- NEW METRICS FROM CUSTOMERS (detectFilters) ------------------

  // system_collapses
  if (safeSelectedMetrics.includes('system_collapses') && allFetchedData.systemCollapses) {
    allFetchedData.systemCollapses.yearly.forEach(item => {
      if (!filterStructure.year.values.includes(item.year)) {
        filterStructure.year.values.push(item.year);
      }
    });
  }

  // disco_metering_status
  if (safeSelectedMetrics.includes('disco_metering_status') && allFetchedData.discoMeteringStatus) {
    allFetchedData.discoMeteringStatus.yearly.forEach(item => {
      if (!filterStructure.year.values.includes(item.year)) {
        filterStructure.year.values.push(item.year);
      }
    });
  }

  // total_customer_population
  if (safeSelectedMetrics.includes('total_customer_population') && allFetchedData.totalCustomerPopulation) {
    allFetchedData.totalCustomerPopulation.yearly.forEach(item => {
      if (!filterStructure.year.values.includes(item.year)) {
        filterStructure.year.values.push(item.year);
      }
    });
  }

  // service_band_customers
  if (safeSelectedMetrics.includes('service_band_customers') && allFetchedData.serviceBandCustomers) {
    allFetchedData.serviceBandCustomers.yearly.forEach(item => {
      if (!filterStructure.year.values.includes(item.year)) {
        filterStructure.year.values.push(item.year);
      }
    });
    allFetchedData.serviceBandCustomers.monthly.forEach(item => {
      if (!filterStructure.year.values.includes(item.year)) {
        filterStructure.year.values.push(item.year);
      }
    });
  }

  filterStructure.year.values.sort((a, b) => b - a);

  // Combining disco filters:
  const combineDiscoFilters = (discos) => {
    const normalized = discos.map(normalizeDisco);
    return Array.from(new Set(normalized));
  };

  // existing logic for share_availability, forex, disco_tariff, etc.
  if (safeSelectedMetrics.includes('share_availability') && allFetchedData.shareOfAvailability) {
    filterStructure.plant = { name: 'Generation Company', values: allFetchedData.shareOfAvailability.plants || [], type: 'string' };
  }
  if (safeSelectedMetrics.includes('forex') && allFetchedData.forex && Array.isArray(allFetchedData.forex.currencyPairs)) {
    filterStructure.currency_pair = {
      name: 'Currency Pair',
      values: allFetchedData.forex.currencyPairs,
      type: 'string',
      defaultValue: 'Dollar (USD)'
    };
  }
  if (safeSelectedMetrics.includes('disco_tariff') && allFetchedData.discoTariff && Array.isArray(allFetchedData.discoTariff.discos)) {
    filterStructure.disco = {
      name: 'Distribution Company',
      values: combineDiscoFilters(allFetchedData.discoTariff.discos),
      type: 'string'
    };
  }
  if (safeSelectedMetrics.includes('transmission_loss') && allFetchedData.transmissionLoss && Array.isArray(allFetchedData.transmissionLoss.types)) {
    filterStructure.loss_factor_type = {
      name: 'Loss Factor Filter',
      values: allFetchedData.transmissionLoss.types,
      type: 'string',
      defaultValue: 'Transmission Loss Factor'
    };
  }
  if (safeSelectedMetrics.includes('load_offtake') && allFetchedData.loadOfftake) {
    if (!filterStructure.disco) {
      filterStructure.disco = {
        name: 'Distribution Company',
        values: combineDiscoFilters(allFetchedData.loadOfftake.discos || []),
        type: 'string'
      };
    } else {
      const loadOfftakeDiscos = combineDiscoFilters(allFetchedData.loadOfftake.discos || []);
      const existing = filterStructure.disco.values || [];
      const merged = Array.from(new Set([...existing, ...loadOfftakeDiscos]));
      filterStructure.disco.values = merged;
    }
    if (Array.isArray(allFetchedData.loadOfftake.types)) {
      filterStructure.offtake_type = {
        name: 'Offtake Type',
        values: allFetchedData.loadOfftake.types,
        type: 'string',
        defaultValue: 'Actual Load Offtake'
      };
    }
  }
  if (safeSelectedMetrics.includes('genco_invoice') && allFetchedData.gencoInvoice && Array.isArray(allFetchedData.gencoInvoice.data)) {
    filterStructure.genco = {
      name: 'Genco',
      values: allFetchedData.gencoInvoice.gencos || [],
      type: 'string'
    };
  }
  if (safeSelectedMetrics.includes('nbet_payment') && allFetchedData.nbetPayment && Array.isArray(allFetchedData.nbetPayment.data)) {
    filterStructure.genco = {
      name: 'Genco',
      values: allFetchedData.nbetPayment.gencos || [],
      type: 'string'
    };
  }
  if (safeSelectedMetrics.includes('nbet_outstanding') && allFetchedData.nbetOutstanding && Array.isArray(allFetchedData.nbetOutstanding.data)) {
    filterStructure.genco = {
      name: 'Genco',
      values: allFetchedData.nbetOutstanding.gencos || [],
      type: 'string'
    };
  }
  if (safeSelectedMetrics.includes('disco_nbet') && allFetchedData.discoNBET) {
    filterStructure.disco = {
      name: 'Distribution Company',
      values: combineDiscoFilters(allFetchedData.discoNBET.discos || []),
      type: 'string'
    };
    filterStructure.disco_nbet_type = {
      name: 'NBET Transaction Type',
      values: ['Invoice from NBET', 'Remittance to NBET'],
      type: 'string',
      defaultValue: 'Invoice from NBET'
    };
  }
  if (safeSelectedMetrics.includes('disco_mo') && allFetchedData.discoMO) {
    filterStructure.disco = {
      name: 'Distribution Company',
      values: combineDiscoFilters(allFetchedData.discoMO.discos || []),
      type: 'string'
    };
    filterStructure.disco_mo_type = {
      name: 'MO Transaction Type',
      values: ['Invoice from MO', 'Remittance to MO'],
      type: 'string',
      defaultValue: 'Invoice from MO'
    };
  }
  if (safeSelectedMetrics.includes('revenue_billed') && allFetchedData.energyData && allFetchedData.energyData.discoRevenueBilled) {
    const revBilledDiscos = allFetchedData.energyData.discoRevenueBilled.discos || [];
    filterStructure.disco = {
      name: 'Distribution Company',
      values: combineDiscoFilters(revBilledDiscos),
      type: 'string'
    };
  }
  if (safeSelectedMetrics.includes('revenue_collected') && allFetchedData.energyData && allFetchedData.energyData.discoRevenueCollected) {
    const revCollectedDiscos = allFetchedData.energyData.discoRevenueCollected.discos || [];
    filterStructure.disco = {
      name: 'Distribution Company',
      values: combineDiscoFilters(revCollectedDiscos),
      type: 'string'
    };
  }
  if (safeSelectedMetrics.includes('gencoEnergy') && allFetchedData.gencoEnergy) {
    filterStructure.genco = {
      name: 'Genco',
      values: allFetchedData.gencoEnergy.gencos || [],
      type: 'string'
    };
  }
  if (safeSelectedMetrics.includes('capacity') && allFetchedData.capacity) {
    filterStructure.plant = {
      name: 'Generation Company',
      values: allFetchedData.capacity.plants || [],
      type: 'string'
    };
    filterStructure.capacity_type = {
      name: 'Capacity Type',
      values: allFetchedData.capacity.variants.options,
      type: 'string',
      defaultValue: allFetchedData.capacity.variants.default
    };
    filterStructure.source = {
      name: 'Energy Source',
      values: allFetchedData.capacity.sources,
      type: 'string',
      defaultValue: 'THERMAL'
    };
  }
  if (safeSelectedMetrics.includes('energySent') && allFetchedData.energySent) {
    filterStructure.energy_source = {
      name: 'Energy Source',
      values: allFetchedData.energySent.sources,
      type: 'string',
      defaultValue: allFetchedData.energySent.defaultSource
    };
  }

  // system_collapses
  if (
    safeSelectedMetrics.includes('system_collapses') &&
    allFetchedData.systemCollapses
  ) {
    filterStructure.collapse_type = {
      name: 'Collapse Type',
      values: allFetchedData.systemCollapses.types,  // <--- use the existing array
      type: 'string',
      defaultValue: 'All'
    };
  }

  // disco_metering_status
  if (safeSelectedMetrics.includes('disco_metering_status') && allFetchedData.discoMeteringStatus) {
    if (!filterStructure.disco) {
      filterStructure.disco = {
        name: 'Distribution Company',
        values: combineDiscoFilters(allFetchedData.discoMeteringStatus.discos || []),
        type: 'string'
      };
    } else {
      const dSet = combineDiscoFilters(allFetchedData.discoMeteringStatus.discos || []);
      const merged = Array.from(new Set([...filterStructure.disco.values, ...dSet]));
      filterStructure.disco.values = merged;
    }
    filterStructure.meter_status_variant = {
      name: 'Meter Status Variant',
      values: ['MeteredCustomers','MeteringGap'],
      type: 'string',
      defaultValue: 'MeteredCustomers'
    };
  }

  // total_customer_population
  if (safeSelectedMetrics.includes('total_customer_population') && allFetchedData.totalCustomerPopulation) {
    if (!filterStructure.disco) {
      filterStructure.disco = {
        name: 'Distribution Company',
        values: combineDiscoFilters(allFetchedData.totalCustomerPopulation.discos || []),
        type: 'string'
      };
    } else {
      const popDiscos = combineDiscoFilters(allFetchedData.totalCustomerPopulation.discos || []);
      const merged = Array.from(new Set([...filterStructure.disco.values, ...popDiscos]));
      filterStructure.disco.values = merged;
    }
    filterStructure.customer_type = {
      name: 'Customer Type',
      values: ['All','Metered Customer','Unmetered Customer'],
      type: 'string',
      defaultValue: 'All'
    };
  }

  // service_band_customers
  if (safeSelectedMetrics.includes('service_band_customers') && allFetchedData.serviceBandCustomers) {
    if (!filterStructure.disco) {
      filterStructure.disco = {
        name: 'Distribution Company',
        values: combineDiscoFilters(allFetchedData.serviceBandCustomers.discos || []),
        type: 'string'
      };
    } else {
      const sBandDiscos = combineDiscoFilters(allFetchedData.serviceBandCustomers.discos || []);
      const merged = Array.from(new Set([...filterStructure.disco.values, ...sBandDiscos]));
      filterStructure.disco.values = merged;
    }
    filterStructure.band_notation = {
      name: 'Service Band (Notation)',
      values: ['Band A','Band B','Band C','Band D','Band E','Lifeline'],
      type: 'string',
      defaultValue: 'Band A'
    };
  }

  filterStructure.year.values.sort((a, b) => b - a);
  return filterStructure;
};

// Existing function to group filters by category
export const groupFiltersByCategory = (filters) => {
  const categories = {
    view: ['viewMode', 'year'],
    entity: ['plant', 'disco', 'genco'],
    type: [
      'loss_factor_type',
      'offtake_type',
      'currency_pair',
      'disco_nbet_type',
      'disco_mo_type',
      'capacity_type',
      'energy_source',
      'collapse_type',
      'meter_status_variant',
      'customer_type',
      'band_notation'
    ]
  };
  return Object.entries(filters).reduce((acc, [key, val]) => {
    const cat = Object.entries(categories).find(([, fKeys]) => fKeys.includes(key))?.[0] || 'other';
    if (!acc[cat]) { acc[cat] = {}; }
    acc[cat][key] = val;
    return acc;
  }, {});
};

export default {
  metrics,
  formatValue,
  getChartOptions,
  prepareSeries,
  generateYearlyData,
  generateMonthlyData,
  detectFilters,
  groupFiltersByCategory
};
