import React, { useState, useMemo, useEffect, useCallback } from 'react';
import BlankCard from 'src/components/shared/BlankCard';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Box,
  Drawer,
  IconButton,
  Typography,
  Select,
  MenuItem,
  useTheme,
  Stack,
  Fab,
  Chip,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Grid,
  Switch,
  FormControlLabel,
  alpha,
  Divider,
  Fade,
  CircularProgress,
  Button,
  Popover
} from '@mui/material';
import { useSelector } from 'react-redux';
import ReactApexChart from 'react-apexcharts';
import {
  IconX,
  IconPlus,
  IconChartDots,
  IconChartLine,
  IconChartBar,
  IconChartArea,
  IconChartArcs,
  IconLayoutGrid,
  IconLayoutColumns,
  IconMessageDots,
  IconFilter
} from '@tabler/icons';
import AIInsights from 'src/views/analysis/AIInsights';
import {
  metrics,
  generateYearlyData,
  generateMonthlyData,
  formatValue,
  getChartOptions,
  prepareSeries,
  detectFilters,
  groupFiltersByCategory
} from 'src/utils/chartUtils';
import { fetchMetricsData } from 'src/utils/apiIntegration';
import { fetchMetricsData2 } from 'src/utils/apiIntegration_invoices';
import { fetchMetricsData3 } from 'src/utils/apiIntegration_Energy';
import { fetchMetricsData4 } from 'src/utils/apiIntegration_Capacity';
// NEW: Import the customer metrics integration
import { fetchMetricsDataCustomers } from 'src/utils/apiIntegration_Customers';

const MetricCompare = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedMetrics, setSelectedMetrics] = useState([]);
  const [metricSelectOpen, setMetricSelectOpen] = useState(false);
  const [selectedMetricDetails, setSelectedMetricDetails] = useState(null);
  const [chartType, setChartType] = useState('line');
  const [chartSubType, setChartSubType] = useState('standard');
  const [splitView, setSplitView] = useState(false);
  const [showDataLabels, setShowDataLabels] = useState(true);
  const [showInsights, setShowInsights] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState({});
  const [viewMode, setViewMode] = useState('yearly');
  const [selectedYear, setSelectedYear] = useState(null);
  const [yearRange, setYearRange] = useState({ startYear: null, endYear: null });
  const [allFetchedData, setAllFetchedData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [popoverAnchors, setPopoverAnchors] = useState({});
  const [noMonthlyDataMetrics, setNoMonthlyDataMetrics] = useState([]);
  const [noMonthlyPopover, setNoMonthlyPopover] = useState({});
  const theme = useTheme();
  const customizer = useSelector((state) => state.customizer);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setFetchError(null);
      try {
        // Fetch data from all endpoints
        const data1 = await fetchMetricsData();
        const data2 = await fetchMetricsData2();
        const data3 = await fetchMetricsData3();
        const data4 = await fetchMetricsData4();
        const data5 = await fetchMetricsDataCustomers(); // NEW customer metrics

        const mergedData = {
          shareOfAvailability: data1.shareOfAvailability,
          forex: data1.forex,
          inflation: data1.inflation,
          discoTariff: data1.discoTariff,
          transmissionLoss: data1.transmissionLoss,
          loadOfftake: data1.loadOfftake,
          gencoInvoice: data2.gencoInvoice,
          nbetPayment: data2.nbetPayment,
          nbetOutstanding: data2.nbetOutstanding,
          discoNBET: data2.discoNBET,
          discoMO: data2.discoMO,
          energyData: data3,
          capacity: data4.capacity,
          energySent: data4.energySent,
          gencoEnergy: data4.gencoEnergy,
          years: [
            ...new Set([
              ...data1.years,
              ...data2.years,
              ...data3.years,
              ...data4.years
            ])
          ]
            .filter(y => !isNaN(Number(y)))
            .map(y => Number(y))
            .sort((a, b) => a - b),
          // Merge in new customer metrics
          systemCollapses: data5.systemCollapses,
          discoMeteringStatus: data5.discoMeteringStatus,
          totalCustomerPopulation: data5.totalCustomerPopulation,
          serviceBandCustomers: data5.serviceBandCustomers
        };

        // Merge years from customer metrics if provided
        const combinedYears = [
          ...new Set([...mergedData.years, ...data5.years])
        ]
          .filter(y => !isNaN(Number(y)))
          .map(y => Number(y))
          .sort((a, b) => a - b);

        mergedData.years = combinedYears;
        setAllFetchedData(mergedData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setFetchError('Failed to fetch data. Check console for details.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const availableYears = useMemo(() => {
    if (!allFetchedData || selectedMetrics.length === 0) return [];
    const yearsSet = new Set();
    selectedMetrics.forEach((metric) => {
      if (metric === 'share_availability' && allFetchedData.shareOfAvailability && Array.isArray(allFetchedData.shareOfAvailability.data)) {
        allFetchedData.shareOfAvailability.data.forEach(item => {
          const yr = Number(item.year);
          if (!isNaN(yr)) yearsSet.add(yr);
        });
      }
      if (metric === 'forex' && allFetchedData.forex) {
        if (Array.isArray(allFetchedData.forex.yearly)) {
          allFetchedData.forex.yearly.forEach(item => {
            const yr = Number(item.year);
            if (!isNaN(yr)) yearsSet.add(yr);
          });
        }
        if (Array.isArray(allFetchedData.forex.monthly)) {
          allFetchedData.forex.monthly.forEach(item => {
            const yr = Number(item.year);
            if (!isNaN(yr)) yearsSet.add(yr);
          });
        }
      }
      if (metric === 'inflation' && Array.isArray(allFetchedData.inflation)) {
        allFetchedData.inflation.forEach(item => {
          const yr = Number(item.year);
          if (!isNaN(yr)) yearsSet.add(yr);
        });
      }
      if (metric === 'disco_tariff' && allFetchedData.discoTariff && Array.isArray(allFetchedData.discoTariff.data)) {
        allFetchedData.discoTariff.data.forEach(item => {
          const yr = Number(item.year);
          if (!isNaN(yr)) yearsSet.add(yr);
        });
      }
      if (metric === 'transmission_loss' && allFetchedData.transmissionLoss) {
        if (Array.isArray(allFetchedData.transmissionLoss.yearly)) {
          allFetchedData.transmissionLoss.yearly.forEach(item => {
            const yr = Number(item.year);
            if (!isNaN(yr)) yearsSet.add(yr);
          });
        }
        if (Array.isArray(allFetchedData.transmissionLoss.monthly)) {
          allFetchedData.transmissionLoss.monthly.forEach(item => {
            const yr = Number(item.year);
            if (!isNaN(yr)) yearsSet.add(yr);
          });
        }
      }
      if (metric === 'load_offtake' && allFetchedData.loadOfftake && Array.isArray(allFetchedData.loadOfftake.data)) {
        allFetchedData.loadOfftake.data.forEach(item => {
          const yr = Number(item.year);
          if (!isNaN(yr)) yearsSet.add(yr);
        });
      }
      if (metric === 'genco_invoice' && allFetchedData.gencoInvoice && Array.isArray(allFetchedData.gencoInvoice.data)) {
        allFetchedData.gencoInvoice.data.forEach(item => {
          const yr = Number(item.year);
          if (!isNaN(yr)) yearsSet.add(yr);
        });
      }
      if (metric === 'nbet_payment' && allFetchedData.nbetPayment && Array.isArray(allFetchedData.nbetPayment.data)) {
        allFetchedData.nbetPayment.data.forEach(item => {
          const yr = Number(item.year);
          if (!isNaN(yr)) yearsSet.add(yr);
        });
      }
      if (metric === 'nbet_outstanding' && allFetchedData.nbetOutstanding && Array.isArray(allFetchedData.nbetOutstanding.data)) {
        allFetchedData.nbetOutstanding.data.forEach(item => {
          const yr = Number(item.year);
          if (!isNaN(yr)) yearsSet.add(yr);
        });
      }
      if (metric === 'disco_nbet' && allFetchedData.discoNBET) {
        if (Array.isArray(allFetchedData.discoNBET.yearly)) {
          allFetchedData.discoNBET.yearly.forEach(item => {
            const yr = Number(item.year);
            if (!isNaN(yr)) yearsSet.add(yr);
          });
        }
        if (Array.isArray(allFetchedData.discoNBET.monthly)) {
          allFetchedData.discoNBET.monthly.forEach(item => {
            const yr = Number(item.year);
            if (!isNaN(yr)) yearsSet.add(yr);
          });
        }
      }
      if (metric === 'disco_mo' && allFetchedData.discoMO) {
        if (Array.isArray(allFetchedData.discoMO.yearly)) {
          allFetchedData.discoMO.yearly.forEach(item => {
            const yr = Number(item.year);
            if (!isNaN(yr)) yearsSet.add(yr);
          });
        }
        if (Array.isArray(allFetchedData.discoMO.monthly)) {
          allFetchedData.discoMO.monthly.forEach(item => {
            const yr = Number(item.year);
            if (!isNaN(yr)) yearsSet.add(yr);
          });
        }
      }
      if (metric === 'energySent' && allFetchedData.energySent) {
        if (Array.isArray(allFetchedData.energySent.yearly)) {
          allFetchedData.energySent.yearly.forEach(item => {
            const yr = Number(item.year);
            if (!isNaN(yr)) yearsSet.add(yr);
          });
        }
        if (Array.isArray(allFetchedData.energySent.monthly)) {
          allFetchedData.energySent.monthly.forEach(item => {
            const yr = Number(item.year);
            if (!isNaN(yr)) yearsSet.add(yr);
          });
        }
      }
      if (metric === 'gencoEnergy' && allFetchedData.gencoEnergy && Array.isArray(allFetchedData.gencoEnergy.yearly)) {
        allFetchedData.gencoEnergy.yearly.forEach(item => {
          const yr = Number(item.year);
          if (!isNaN(yr)) yearsSet.add(yr);
        });
      }
      if (metric === 'capacity' && allFetchedData.capacity && allFetchedData.capacity.yearly) {
        allFetchedData.capacity.yearly.forEach(item => {
          const yr = Number(item.year);
          if (!isNaN(yr)) yearsSet.add(yr);
        });
      }
      // New customer metrics:
      if (metric === 'system_collapses' && allFetchedData.systemCollapses) {
        allFetchedData.systemCollapses.yearly.forEach(item => {
          const yr = Number(item.year);
          if (!isNaN(yr)) yearsSet.add(yr);
        });
      }
      if (metric === 'disco_metering_status' && allFetchedData.discoMeteringStatus) {
        allFetchedData.discoMeteringStatus.yearly.forEach(item => {
          const yr = Number(item.year);
          if (!isNaN(yr)) yearsSet.add(yr);
        });
      }
      if (metric === 'total_customer_population' && allFetchedData.totalCustomerPopulation) {
        allFetchedData.totalCustomerPopulation.yearly.forEach(item => {
          const yr = Number(item.year);
          if (!isNaN(yr)) yearsSet.add(yr);
        });
      }
      if (metric === 'service_band_customers' && allFetchedData.serviceBandCustomers) {
        if (Array.isArray(allFetchedData.serviceBandCustomers.yearly)) {
          allFetchedData.serviceBandCustomers.yearly.forEach(item => {
            const yr = Number(item.year);
            if (!isNaN(yr)) yearsSet.add(yr);
          });
        }
        if (Array.isArray(allFetchedData.serviceBandCustomers.monthly)) {
          allFetchedData.serviceBandCustomers.monthly.forEach(item => {
            const yr = Number(item.year);
            if (!isNaN(yr)) yearsSet.add(yr);
          });
        }
      }
    });
    return [...yearsSet].sort((a, b) => a - b);
  }, [allFetchedData, selectedMetrics]);

  useEffect(() => {
    if (availableYears.length > 0) {
      const minYear = Math.min(...availableYears);
      const maxYear = Math.max(...availableYears);
      setYearRange({ startYear: minYear, endYear: maxYear });
      if (!selectedYear) {
        setSelectedYear(maxYear);
      }
    } else {
      setYearRange({ startYear: null, endYear: null });
      setSelectedYear(null);
    }
  }, [availableYears, selectedYear]);

  const availableFilters = useMemo(() => {
    if (!allFetchedData) return {};
    return detectFilters(allFetchedData, selectedMetrics);
  }, [allFetchedData, selectedMetrics]);

  // Prune activeFilters whenever availableFilters or selectedMetrics change
  useEffect(() => {
    setActiveFilters((prev) => {
      const newFilters = {};
      Object.keys(availableFilters).forEach((key) => {
        if (prev.hasOwnProperty(key)) {
          newFilters[key] = prev[key];
        }
      });
      return newFilters;
    });
  }, [availableFilters, selectedMetrics]);

  // Set default filters if not already present
  useEffect(() => {
    if (availableFilters) {
      setActiveFilters((prev) => {
        const newFilters = { ...prev };
        for (const key in availableFilters) {
          if (availableFilters[key].defaultValue && !newFilters[key]) {
            newFilters[key] = availableFilters[key].defaultValue;
          }
        }
        return newFilters;
      });
    }
  }, [availableFilters]);

  const groupedFilters = useMemo(() => {
    const allGroups = groupFiltersByCategory(availableFilters);
    return Object.entries(allGroups)
      .filter(([cat]) => cat !== 'view')
      .reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {});
  }, [availableFilters]);

  useEffect(() => {
    if (viewMode === 'monthly') {
      const monthlySupported = new Set(['forex', 'transmission_loss']);
      const unsupported = selectedMetrics.filter(metric => !monthlySupported.has(metric));
      setNoMonthlyDataMetrics(unsupported);
      const newPopover = {};
      unsupported.forEach(metric => {
        newPopover[metric] = true;
      });
      setNoMonthlyPopover(newPopover);
    } else {
      setNoMonthlyDataMetrics([]);
      setNoMonthlyPopover({});
    }
  }, [viewMode, selectedMetrics]);

  useEffect(() => {
    Object.keys(noMonthlyPopover).forEach(metricKey => {
      if (noMonthlyPopover[metricKey]) {
        const timer = setTimeout(() => {
          setNoMonthlyPopover(prev => ({ ...prev, [metricKey]: false }));
        }, 3000);
        return () => clearTimeout(timer);
      }
    });
  }, [noMonthlyPopover]);

  const chartData = useMemo(() => {
    if (!allFetchedData) return [];
    if (viewMode === 'yearly') {
      const rawData = generateYearlyData(allFetchedData, selectedMetrics, activeFilters);
      if (yearRange.startYear && yearRange.endYear) {
        return rawData.filter(item => item.x >= yearRange.startYear && item.x <= yearRange.endYear);
      }
      return rawData;
    } else {
      return generateMonthlyData(allFetchedData, selectedMetrics, activeFilters, selectedYear);
    }
  }, [allFetchedData, viewMode, selectedMetrics, activeFilters, selectedYear, yearRange]);

  const handleMetricClick = useCallback(
    (metricKey) => {
      const metricConfig = metrics[metricKey] || {};
      const dataForMetric = chartData.map((item) => ({
        date: item.x,
        value: item[metricKey]
      }));
      setSelectedMetricDetails({
        id: metricKey,
        ...metricConfig,
        data: dataForMetric
      });
    },
    [chartData]
  );

  const handleFilterChange = useCallback((filterKey, value) => {
    setActiveFilters((prev) => ({
      ...prev,
      [filterKey]: value || null
    }));
  }, []);

  const renderChart = useCallback(
    (metricIds = selectedMetrics, height = '100%') => {
      const options = getChartOptions(
        metricIds,
        metrics,
        theme,
        customizer,
        chartType,
        showDataLabels,
        splitView,
        0,
        chartSubType,
        viewMode,
        activeFilters
      );
      const series = prepareSeries(metricIds, metrics, chartData, chartType, chartSubType, viewMode);
      return (
        <ReactApexChart
          options={options}
          series={series}
          type={chartType === 'mixed' ? 'line' : chartType}
          height={height}
          width="100%"
        />
      );
    },
    [selectedMetrics, chartData, theme, customizer, chartType, showDataLabels, splitView, chartSubType, viewMode, activeFilters]
  );

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  if (loading) {
    return (
      <BlankCard>
        <Box display="flex" alignItems="center" justifyContent="center" p={5} height="50vh">
          <CircularProgress />
        </Box>
      </BlankCard>
    );
  }

  if (fetchError) {
    return (
      <BlankCard>
        <Box p={5} textAlign="center">
          <Typography color="error" gutterBottom>
            {fetchError}
          </Typography>
        </Box>
      </BlankCard>
    );
  }

  if (!allFetchedData) {
    return (
      <BlankCard>
        <Box p={5} textAlign="center">
          <Typography variant="h6" gutterBottom>
            No Data Loaded
          </Typography>
        </Box>
      </BlankCard>
    );
  }

  return (
    <>
      <Fab
        size="small"
        color="primary"
        onClick={() => setDrawerOpen(true)}
        sx={{
          position: 'fixed',
          right: 0,
          top: '50%',
          transform: 'translateY(-50%)',
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
          zIndex: theme.zIndex.drawer + 1,
          boxShadow:
            customizer.activeMode === 'dark'
              ? '0 3px 5px 2px rgba(0, 0, 0, .3)'
              : '0 3px 5px 2px rgba(0, 0, 0, .1)',
          '&:hover': { right: 2 },
          transition: 'right 0.3s ease'
        }}
      >
        <IconChartDots size={24} />
      </Fab>
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: '90%',
            maxWidth: 1400,
            bgcolor: 'background.default'
          }
        }}
      >
        <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
          <BlankCard sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ p: 3, borderBottom: `1px solid ${theme.palette.divider}` }}>
              <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                <Typography variant="h5">Compare Metrics</Typography>
                <Stack direction="row" spacing={2} alignItems="center">
                  <FormControlLabel
                    control={<Switch size="small" checked={showDataLabels} onChange={(e) => setShowDataLabels(e.target.checked)} />}
                    label="Data Labels"
                  />
                  <ToggleButtonGroup value={viewMode} exclusive onChange={(e, val) => val && setViewMode(val)} size="small">
                    <ToggleButton value="yearly">
                      <Typography variant="body2">Yearly</Typography>
                    </ToggleButton>
                    <ToggleButton value="monthly">
                      <Typography variant="body2">Monthly</Typography>
                    </ToggleButton>
                  </ToggleButtonGroup>
                  {viewMode === 'yearly' && availableYears.length > 0 && (
                    <Stack direction="row" spacing={1}>
                      <Select
                        value={yearRange.startYear || ''}
                        onChange={(e) => setYearRange((prev) => ({ ...prev, startYear: e.target.value }))}
                        size="small"
                        sx={{ minWidth: 100 }}
                      >
                        {availableYears.map((y) => (
                          <MenuItem key={y} value={y}>
                            {y}
                          </MenuItem>
                        ))}
                      </Select>
                      <Select
                        value={yearRange.endYear || ''}
                        onChange={(e) => setYearRange((prev) => ({ ...prev, endYear: e.target.value }))}
                        size="small"
                        sx={{ minWidth: 100 }}
                      >
                        {availableYears.map((y) => (
                          <MenuItem key={y} value={y}>
                            {y}
                          </MenuItem>
                        ))}
                      </Select>
                    </Stack>
                  )}
                  {viewMode === 'monthly' && availableYears.length > 0 && (
                    <Select
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                      size="small"
                      sx={{ minWidth: 100 }}
                    >
                      {availableYears.map((y) => (
                        <MenuItem key={y} value={y}>
                          {y}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                  <ToggleButton value={splitView} selected={splitView} onChange={() => setSplitView(!splitView)} size="small">
                    <Tooltip title={splitView ? 'Combined View' : 'Split View'}>
                      {splitView ? <IconLayoutColumns size={20} /> : <IconLayoutGrid size={20} />}
                    </Tooltip>
                  </ToggleButton>
                  <Tooltip title="Filter Metrics">
                    <ToggleButton value={filterOpen} selected={filterOpen} onChange={() => setFilterOpen(!filterOpen)} size="small">
                      <IconFilter size={20} />
                    </ToggleButton>
                  </Tooltip>
                  <Tooltip title="EMRC Echo">
                    <ToggleButton value={showInsights} selected={showInsights} onChange={() => setShowInsights(!showInsights)} size="small">
                      <IconMessageDots size={20} />
                    </ToggleButton>
                  </Tooltip>
                  <ToggleButtonGroup value={chartType} exclusive onChange={(e, val) => val && setChartType(val)} size="small">
                    {[
                      { value: 'line', icon: <IconChartLine size={20} />, label: 'Line Chart' },
                      { value: 'bar', icon: <IconChartBar size={20} />, label: 'Bar Chart' },
                      { value: 'area', icon: <IconChartArea size={20} />, label: 'Area Chart' },
                      { value: 'mixed', icon: <IconChartArcs size={20} />, label: 'Mixed Chart' }
                    ].map((cType) => (
                      <ToggleButton key={cType.value} value={cType.value}>
                        <Tooltip title={cType.label}>{cType.icon}</Tooltip>
                      </ToggleButton>
                    ))}
                  </ToggleButtonGroup>
                  {chartType === 'bar' && (
                    <ToggleButtonGroup value={chartSubType} exclusive onChange={(e, val) => val && setChartSubType(val)} size="small">
                      {[
                        { value: 'standard', label: 'Standard' },
                        { value: 'stacked', label: 'Stacked' },
                        { value: 'clustered', label: 'Clustered' }
                      ].map((sub) => (
                        <ToggleButton key={sub.value} value={sub.value}>
                          <Tooltip title={sub.label}>
                            <Typography variant="body2">{sub.label}</Typography>
                          </Tooltip>
                        </ToggleButton>
                      ))}
                    </ToggleButtonGroup>
                  )}
                  <IconButton onClick={() => setDrawerOpen(false)} size="small">
                    <IconX />
                  </IconButton>
                </Stack>
              </Stack>
              <Box sx={{ mt: 2 }}>
                <Stack direction="row" spacing={1} flexWrap="wrap" alignItems="center">
                  {selectedMetrics.map((metricKey) => (
                    <Box key={metricKey} ref={(el) => { if (el && !popoverAnchors[metricKey]) { setPopoverAnchors(prev => ({ ...prev, [metricKey]: el })); } }}>
                      <Chip
                        label={
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Typography variant="body2">{metrics[metricKey]?.name || metricKey}</Typography>
                            <Chip label={metrics[metricKey]?.unit || ''} size="small" variant="outlined" sx={{ height: 16 }} />
                          </Stack>
                        }
                        onClick={() => handleMetricClick(metricKey)}
                        onDelete={() => setSelectedMetrics((prev) => prev.filter((m) => m !== metricKey))}
                        sx={{
                          height: 32,
                          mb: 1,
                          borderColor: theme.palette.primary.main,
                          backgroundColor: alpha(theme.palette.primary.main, 0.1),
                          '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.2) }
                        }}
                      />
                      {viewMode === 'monthly' && noMonthlyDataMetrics.includes(metricKey) && popoverAnchors[metricKey] && (
                        <Popover
                          open={noMonthlyPopover[metricKey] || false}
                          anchorEl={popoverAnchors[metricKey]}
                          onClose={() => setNoMonthlyPopover(prev => ({ ...prev, [metricKey]: false }))}
                          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                          transformOrigin={{ vertical: 'top', horizontal: 'center' }}
                        >
                          <Typography sx={{ p: 1 }}>No Monthly data available for {metrics[metricKey]?.name || metricKey}</Typography>
                        </Popover>
                      )}
                    </Box>
                  ))}
                  {selectedMetrics.length < 6 && (
                    <Chip
                      icon={<IconPlus size={18} />}
                      label="Add Metric"
                      onClick={() => setMetricSelectOpen(true)}
                      color="primary"
                      variant="outlined"
                      sx={{ height: 32, mb: 1 }}
                    />
                  )}
                </Stack>
              </Box>
              {Object.keys(activeFilters).filter((k) => activeFilters[k]).length > 0 && (
                <Box mb={2}>
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    {Object.entries(activeFilters).map(([k, v]) => {
                      if (!v) return null;
                      return (
                        <Chip
                          key={k}
                          label={`${availableFilters[k]?.name}: ${v}`}
                          onDelete={() => handleFilterChange(k, null)}
                          size="small"
                          color="secondary"
                          variant="outlined"
                        />
                      );
                    })}
                  </Stack>
                </Box>
              )}
            </Box>
            <Box
              sx={{
                flexGrow: 1,
                position: 'relative',
                minHeight: 0,
                height: 'calc(100vh - 240px)',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <Box sx={{ flexGrow: 1, width: '100%', minHeight: 0, overflow: 'auto' }}>
                <AnimatePresence mode="wait">
                  {selectedMetrics.length > 0 ? (
                    splitView ? (
                      <motion.div key="split-view" variants={containerVariants} initial="hidden" animate="visible" exit="exit" style={{ height: '100%', overflow: 'auto', width: '100%' }}>
                        <Grid container spacing={2} sx={{ p: 2 }}>
                          {selectedMetrics.map((metricKey) => (
                            <Grid item xs={12} md={6} key={metricKey}>
                              <BlankCard>
                                <Box p={2}>
                                  <Typography variant="h6" gutterBottom>
                                    {metrics[metricKey].name}{' '}
                                    <Typography component="span" variant="caption" sx={{ ml: 1, color: 'text.secondary' }}>
                                      ({metrics[metricKey].unit})
                                    </Typography>
                                  </Typography>
                                  {renderChart([metricKey], 250)}
                                </Box>
                              </BlankCard>
                            </Grid>
                          ))}
                        </Grid>
                        {showInsights && (
                          <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider', mt: 2 }}>
                            <BlankCard>
                              <Box p={2}>
                                <Typography variant="h6" gutterBottom>EMRC Echo AI</Typography>
                                <AIInsights selectedMetrics={selectedMetrics} chartData={chartData} metrics={metrics} />
                              </Box>
                            </BlankCard>
                          </Box>
                        )}
                      </motion.div>
                    ) : (
                      <motion.div key="combined-view" variants={containerVariants} initial="hidden" animate="visible" exit="exit" style={{ height: '100%', display: 'flex' }}>
                        <Box sx={{ flexGrow: 1 }}>{renderChart()}</Box>
                        {showInsights && (
                          <Fade in>
                            <Box sx={{ width: 350, borderLeft: 1, borderColor: 'divider', display: 'flex', flexDirection: 'column' }}>
                              <AIInsights selectedMetrics={selectedMetrics} chartData={chartData} metrics={metrics} />
                            </Box>
                          </Fade>
                        )}
                      </motion.div>
                    )
                  ) : (
                    <motion.div key="empty-state" variants={containerVariants} initial="hidden" animate="visible" exit="exit" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Stack alignItems="center" spacing={2}>
                        <IconChartDots size={48} color={theme.palette.text.secondary} />
                        <Typography color="textSecondary">Select metrics to start comparing</Typography>
                      </Stack>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Box>
            </Box>
          </BlankCard>
        </Box>
      </Drawer>
      <Dialog open={metricSelectOpen} onClose={() => setMetricSelectOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Select Metric to Compare
          <IconButton onClick={() => setMetricSelectOpen(false)} sx={{ position: 'absolute', right: 8, top: 8 }}>
            <IconX size={18} />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <List sx={{ pt: 1 }}>
            {Object.entries(metrics).map(([id, { name, unit }]) => (
              <ListItem key={id} disablePadding disabled={selectedMetrics.includes(id)}>
                <ListItemButton
                  onClick={() => {
                    setSelectedMetrics((prev) => [...prev, id]);
                    setMetricSelectOpen(false);
                  }}
                  disabled={selectedMetrics.includes(id)}
                >
                  <ListItemText primary={name} secondary={`Unit: ${unit}`} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </DialogContent>
      </Dialog>
      <Drawer anchor="right" open={filterOpen} onClose={() => setFilterOpen(false)} PaperProps={{ sx: { width: '400px' } }}>
        <Box sx={{ p: 3 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
            <Typography variant="h6">Filter Metrics</Typography>
            <IconButton onClick={() => setFilterOpen(false)}>
              <IconX size={18} />
            </IconButton>
          </Stack>
          {Object.entries(groupedFilters).map(([category, filterItems]) => (
            <Box key={category} sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ mb: 2, textTransform: 'capitalize' }}>{category}</Typography>
              <Stack spacing={2}>
                {Object.entries(filterItems).map(([fKey, fConfig]) => (
                  <Box key={fKey}>
                    <Typography variant="body2" color="textSecondary" gutterBottom>{fConfig.name}</Typography>
                    <Select
                      value={activeFilters[fKey] || ''}
                      onChange={(e) => handleFilterChange(fKey, e.target.value)}
                      size="small"
                      fullWidth
                      displayEmpty
                      disabled={!!fConfig.isDisabled}
                    >
                      <MenuItem value="">All</MenuItem>
                      {fConfig.values.map((val) => (
                        <MenuItem key={val} value={val}>{val}</MenuItem>
                      ))}
                    </Select>
                  </Box>
                ))}
              </Stack>
            </Box>
          ))}
        </Box>
      </Drawer>
      <Drawer anchor="right" open={Boolean(selectedMetricDetails)} onClose={() => setSelectedMetricDetails(null)} PaperProps={{ sx: { width: '400px' } }}>
        {selectedMetricDetails && (
          <Box sx={{ p: 3 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
              <Typography variant="h6">Metric Details</Typography>
              <IconButton onClick={() => setSelectedMetricDetails(null)}>
                <IconX size={18} />
              </IconButton>
            </Stack>
            <Typography variant="h5" gutterBottom>{selectedMetricDetails.name}</Typography>
            <Typography color="textSecondary" gutterBottom>Unit: {selectedMetricDetails.unit}</Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1" gutterBottom>Trend Analysis</Typography>
            {renderChart([selectedMetricDetails.id], 200)}
            {showInsights && (
              <Box sx={{ mt: 2 }}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle1" gutterBottom>AI Analysis</Typography>
                <AIInsights selectedMetrics={[selectedMetricDetails.id]} chartData={chartData} metrics={metrics} />
              </Box>
            )}
          </Box>
        )}
      </Drawer>
    </>
  );
};

export default MetricCompare;
