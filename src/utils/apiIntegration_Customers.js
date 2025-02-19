import axios from 'axios';
import API_URL from '../config/apiconfig';

const discoNameMap = {
  aedc: 'Abuja',
  bedc: 'Benin',
  eedc: 'Enugu',
  ekedc: 'Eko',
  ibedc: 'Ibadan',
  ie: 'Ikeja',
  jedc: 'Jos',
  ke: 'Kaduna',
  kedco: 'Kaduna',
  phedc: 'Portharcourt',
  yedc: 'Yola'
};

function normalizeDisco(raw) {
  if (!raw) return '';
  const key = raw.trim().toLowerCase();
  return discoNameMap[key] || raw.trim();
}

function formatSystemCollapses(data) {
  const byYear = {};
  data.forEach((item) => {
    const y = parseInt(item.Year, 10);
    if (!byYear[y]) byYear[y] = { partial: 0, total: 0 };
    const cVal = parseFloat(item.TotalCollapse) || 0;
    if (item.CollapseType === 'No. of Partial System Collapse') byYear[y].partial += cVal;
    if (item.CollapseType === 'No. of Total System Collapse') byYear[y].total += cVal;
  });
  const yearly = Object.entries(byYear).map(([y, vals]) => ({
    year: parseInt(y, 10),
    values: {
      All: vals.partial + vals.total,
      'No. of Partial System Collapse': vals.partial,
      'No. of Total System Collapse': vals.total
    }
  })).sort((a, b) => a.year - b.year);
  return {
    yearly,
    monthly: [],
    types: ['No. of Partial System Collapse', 'No. of Total System Collapse']
  };
}

function formatDiscoMeteringStatus(data) {
  const byYear = {};
  const discoSet = new Set();
  data.forEach((item) => {
    const y = parseInt(item.Years, 10);
    if (!byYear[y]) byYear[y] = {};
    const d = normalizeDisco(item.Discos);
    discoSet.add(d);
    if (!byYear[y][d]) byYear[y][d] = { MeteredCustomers: 0, MeteringGap: 0 };
    byYear[y][d].MeteredCustomers += parseFloat(item.MeteredCustomers) || 0;
    byYear[y][d].MeteringGap += parseFloat(item.MeteringGap) || 0;
  });
  const yearly = Object.entries(byYear).map(([yearStr, discos]) => {
    const year = parseInt(yearStr, 10);
    let totalMetered = 0;
    let totalGap = 0;
    let discoCount = 0;
    const discoValues = {};
    Object.entries(discos).forEach(([dName, vals]) => {
      discoCount++;
      totalMetered += vals.MeteredCustomers;
      totalGap += vals.MeteringGap;
      discoValues[dName] = { MeteredCustomers: vals.MeteredCustomers, MeteringGap: vals.MeteringGap };
    });
    const avgM = discoCount ? totalMetered / discoCount : 0;
    const avgG = discoCount ? totalGap / discoCount : 0;
    return {
      year,
      values: { MeteredCustomers: avgM, MeteringGap: avgG },
      discos: discoValues
    };
  }).sort((a, b) => a.year - b.year);
  return {
    yearly,
    monthly: [],
    discos: [...discoSet],
    variants: {
      default: 'MeteredCustomers',
      options: ['MeteredCustomers', 'MeteringGap']
    }
  };
}

function formatTotalCustomerPopulation(data) {
  const byYearDisco = {};
  const discoSet = new Set();
  data.forEach((item) => {
    const y = parseInt(item.Year, 10);
    const d = normalizeDisco(item.Discos);
    discoSet.add(d);
    const num = parseFloat(item.Customer_Number) || 0;
    const cType = (item.Customer_Type || '').toLowerCase().includes('unmetered') ? 'Unmetered Customer' : 'Metered Customer';
    if (!byYearDisco[y]) byYearDisco[y] = {};
    if (!byYearDisco[y][d]) byYearDisco[y][d] = { bestDate: null, Metered: 0, Unmetered: 0 };
    const dt = new Date(item.End_of_Quarter);
    if (!byYearDisco[y][d].bestDate) byYearDisco[y][d].bestDate = dt;
    if (dt.getMonth() === 11) {
      byYearDisco[y][d].bestDate = dt;
      if (cType === 'Unmetered Customer') byYearDisco[y][d].Unmetered = num;
      else byYearDisco[y][d].Metered = num;
    } else if (dt > byYearDisco[y][d].bestDate && byYearDisco[y][d].bestDate.getMonth() !== 11) {
      byYearDisco[y][d].bestDate = dt;
      byYearDisco[y][d].Metered = cType === 'Metered Customer' ? num : 0;
      byYearDisco[y][d].Unmetered = cType === 'Unmetered Customer' ? num : 0;
    } else if (dt.getTime() === byYearDisco[y][d].bestDate.getTime()) {
      if (cType === 'Unmetered Customer') byYearDisco[y][d].Unmetered = num;
      else byYearDisco[y][d].Metered = num;
    }
  });
  const yearly = Object.entries(byYearDisco).map(([yearStr, discoData]) => {
    const year = parseInt(yearStr, 10);
    let sumM = 0;
    let sumU = 0;
    const discoValues = {};
    Object.entries(discoData).forEach(([dName, obj]) => {
      const mVal = obj.Metered || 0;
      const uVal = obj.Unmetered || 0;
      sumM += mVal;
      sumU += uVal;
      discoValues[dName] = {
        All: mVal + uVal,
        'Metered Customer': mVal,
        'Unmetered Customer': uVal
      };
    });
    return {
      year,
      values: {
        All: sumM + sumU,
        'Metered Customer': sumM,
        'Unmetered Customer': sumU
      },
      discos: discoValues
    };
  }).sort((a, b) => a.year - b.year);
  return {
    yearly,
    monthly: [],
    discos: [...discoSet],
    types: ['All', 'Metered Customer', 'Unmetered Customer']
  };
}

function formatServiceBandCustomers(data) {
  const bandSet = new Set();
  const discoSet = new Set();
  const monthsOrder = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December'
  ];
  const monthlyHolder = {};
  data.forEach((item) => {
    const y = parseInt(item.YEAR, 10);
    const band = (item.Notation || '').trim();
    const d = normalizeDisco(item.Disco || '');
    const c = parseFloat(item['Total Customers']) || 0;
    const m = (item.MonthName || '').trim();
    bandSet.add(band);
    discoSet.add(d);
    if (!monthlyHolder[y]) monthlyHolder[y] = {};
    if (!monthlyHolder[y][m]) monthlyHolder[y][m] = {};
    if (!monthlyHolder[y][m][d]) monthlyHolder[y][m][d] = {};
    if (!monthlyHolder[y][m][d][band]) monthlyHolder[y][m][d][band] = 0;
    monthlyHolder[y][m][d][band] += c;
  });
  const monthly = [];
  Object.entries(monthlyHolder).forEach(([yearStr, byMonth]) => {
    const year = parseInt(yearStr, 10);
    Object.entries(byMonth).forEach(([mon, discoObj]) => {
      const values = {};
      const discos = {};
      Object.entries(discoObj).forEach(([dName, bandObj]) => {
        if (!discos[dName]) discos[dName] = {};
        Object.entries(bandObj).forEach(([bName, val]) => {
          if (!values[bName]) values[bName] = 0;
          values[bName] += val;
          discos[dName][bName] = val;
        });
      });
      monthly.push({ year, month: mon, values, discos });
    });
  });
  monthly.sort((a, b) => {
    if (a.year === b.year) {
      const idxA = monthsOrder.indexOf(a.month);
      const idxB = monthsOrder.indexOf(b.month);
      return idxA - idxB;
    }
    return a.year - b.year;
  });
  const yearlyMap = {};
  monthly.forEach((row) => {
    if (!yearlyMap[row.year]) yearlyMap[row.year] = { bestMonth: null, values: {}, discos: {} };
  });
  Object.keys(yearlyMap).forEach((y) => {
    let chosenMonth = null;
    let chosenIdx = -1;
    const rows = monthly.filter((r) => r.year === parseInt(y, 10));
    rows.forEach((r) => {
      const idx = monthsOrder.indexOf(r.month);
      if (r.month === 'December') {
        chosenMonth = 'December';
        chosenIdx = idx;
      } else if (idx > chosenIdx && chosenMonth !== 'December') {
        chosenMonth = r.month;
        chosenIdx = idx;
      }
    });
    if (chosenMonth) {
      const finalRow = rows.find((rr) => rr.month === chosenMonth);
      if (finalRow) {
        yearlyMap[y].values = finalRow.values;
        yearlyMap[y].discos = finalRow.discos;
      }
    }
  });
  const yearly = Object.entries(yearlyMap).map(([ys, obj]) => ({
    year: parseInt(ys, 10),
    values: obj.values,
    discos: obj.discos
  })).sort((a, b) => a.year - b.year);
  return {
    yearly,
    monthly,
    discos: [...discoSet],
    variants: {
      default: 'Band A',
      options: ['Band A','Band B','Band C','Band D','Band E','Lifeline']
    }
  };
}

export const fetchMetricsDataCustomers = async () => {
  const [
    sysCollapseRes,
    meterStatusRes,
    totalPopRes,
    serviceBandRes
  ] = await Promise.all([
    axios.get(`${API_URL}/system-Collapses`),
    axios.get(`${API_URL}/Disco-Metering-Status`),
    axios.get(`${API_URL}/Disco-Customer-Number`),
    axios.get(`${API_URL}/customerpopulationby-service-bands`)
  ]);
  const systemCollapses = formatSystemCollapses(sysCollapseRes.data);
  const discoMeteringStatus = formatDiscoMeteringStatus(meterStatusRes.data);
  const totalCustomerPopulation = formatTotalCustomerPopulation(totalPopRes.data);
  const serviceBandCustomers = formatServiceBandCustomers(serviceBandRes.data);
  const allYears = new Set();
  systemCollapses.yearly.forEach((r) => allYears.add(r.year));
  discoMeteringStatus.yearly.forEach((r) => allYears.add(r.year));
  totalCustomerPopulation.yearly.forEach((r) => allYears.add(r.year));
  serviceBandCustomers.yearly.forEach((r) => allYears.add(r.year));
  serviceBandCustomers.monthly.forEach((r) => allYears.add(r.year));
  return {
    systemCollapses,
    discoMeteringStatus,
    totalCustomerPopulation,
    serviceBandCustomers,
    years: [...allYears].sort((a, b) => a - b)
  };
};

export default {
  fetchMetricsDataCustomers
};
