import React, { useState, useMemo, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import axios from 'axios';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
  Typography,
  Paper,
  TablePagination,
  IconButton,
  Tooltip,
  Checkbox,
  TableFooter,
  Avatar,
  InputAdornment,
  Switch,
  CircularProgress,
  FormControlLabel,
  MenuItem,
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { IconSearch, IconFilter } from '@tabler/icons';



import AfamLogo from 'src/assets/images/Genco_Logos/Afam_Logo.png';
import AlaojiLogo from 'src/assets/images/Genco_Logos/Alaoji_Logo.jpg';
import AzuraLogo from 'src/assets/images/Genco_Logos/Azura_Logo.jpg';
import DadinkowaLogo from 'src/assets/images/Genco_Logos/dadinkowa_Logo.jpg';
import DeltaGasLogo from 'src/assets/images/Genco_Logos/DeltaGas_Logo.jpg';
import EgbinLogo from 'src/assets/images/Genco_Logos/Egbin_Logo.jpg';
import KainjiLogo from 'src/assets/images/Genco_Logos/Kainji_Logo.jpg';
import GereguLogo from 'src/assets/images/Genco_Logos/Geregu_Logo.jpg';
import IbomLogo from 'src/assets/images/Genco_Logos/ibom_Logo.jpg';
import OlorunsogoLogo from 'src/assets/images/Genco_Logos/Olorunsogo_Logo.jpg';
import ParasLogo from 'src/assets/images/Genco_Logos/Paras_logo.jpg';
import RiversLogo from 'src/assets/images/Genco_Logos/Rivers_logo.jpg';
import SapeleLogo from 'src/assets/images/Genco_Logos/sapele_logo.jpg';
import DefaultLogo from 'src/assets/images/Genco_Logos/Default_Logo.jpg';

const logoMapping = {
  "AFAM IV": AfamLogo,
  "AFAM": AfamLogo,
  "AFAM VI (SHELL)": AfamLogo,
  "AFAM IVV": AfamLogo,
  "ALAOJI NIPP": AlaojiLogo,
  "AZURA EDO POWER": AzuraLogo,
  "ASCO": DefaultLogo,
  "DADIN KOWA": DadinkowaLogo,
  "DELTA": DeltaGasLogo,
  "EGBIN": EgbinLogo,
  "GBARAIN NIPP": DefaultLogo,
  "GEREGU": GereguLogo,
  "GEREGU NIPP": GereguLogo,
  "IBOM POWER": IbomLogo,
  "IHOVBOR NIPP": AlaojiLogo,
  "JEBBA": DefaultLogo,
  "KAINJI": KainjiLogo,
  "CALABAR (ODUKPANI)": AlaojiLogo,
  "OKPAI": DefaultLogo,
  "OLORUNSOGO": OlorunsogoLogo,
  "OLORUNSOGO 1": OlorunsogoLogo,
  "OLORUNSOGO 2 (NIPP)": OlorunsogoLogo,
  "OLORUNSOGO NIPP": OlorunsogoLogo,
  "OMOKU": DefaultLogo,
  "OMOTOSHO": DefaultLogo,
  "OMOTOSHO 1": DefaultLogo,
  "OMOTOSHO 2": DefaultLogo,
  "OMOTOSHO NIPP": DefaultLogo,
  "PARAS ENERGY": ParasLogo,
  "RIVERS IPP": RiversLogo,
  "SAPELE": SapeleLogo,
  "SAPELE NIPP": SapeleLogo,
  "SAPELE 2 (NIPP)": SapeleLogo,
  "SHIRORO": DefaultLogo,
  "TRANS AMADI": DefaultLogo,
};

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const EnhancedTableHead = (props) => {
  const { order, orderBy, onRequestSort, years } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          {/* Checkbox removed */}
        </TableCell>
        <TableCell>
          <TableSortLabel
            active={orderBy === 'Genco'}
            direction={orderBy === 'Genco' ? order : 'asc'}
            onClick={createSortHandler('Genco')}
          >
            Genco
            {orderBy === 'Genco' ? (
              <Box component="span" sx={visuallyHidden}>
                {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
              </Box>
            ) : null}
          </TableSortLabel>
        </TableCell>
        <TableCell align="right">
          <TableSortLabel
            active={orderBy === 'Total'}
            direction={orderBy === 'Total' ? order : 'asc'}
            onClick={createSortHandler('Total')}
          >
            Total
            {orderBy === 'Total' ? (
              <Box component="span" sx={visuallyHidden}>
                {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
              </Box>
            ) : null}
          </TableSortLabel>
        </TableCell>
        {years.map((year) => (
          <TableCell key={year} align="right">
            <TableSortLabel
              active={orderBy === year.toString()}
              direction={orderBy === year.toString() ? order : 'asc'}
              onClick={createSortHandler(year.toString())}
            >
              {year}
              {orderBy === year.toString() ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

const formatValue = (value) => {
  const absValue = Math.abs(value);          
  const sign = value < 0 ? '-' : '';         

  if (absValue >= 1e12) {
    return `${sign}₦${Math.round(absValue / 1e12)}tn`;
  } else if (absValue >= 1e9) {
    return `${sign}₦${Math.round(absValue / 1e9)}bn`;
  } else if (absValue >= 1e6) {
    return `${sign}₦${Math.round(absValue / 1e6)}m`;
  } else if (absValue >= 1e3) {
    return `${sign}₦${Math.round(absValue / 1e3)}k`;
  } else {
    return `${sign}₦${Math.round(absValue)}`;
  }
};


const formatTotalValue = (value) => {
  const valueInBillions = value / 1e9;
  
  if (valueInBillions >= 1000) {
    return `₦${(valueInBillions / 1000).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}t`;
  } else {
    return `₦${valueInBillions.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}bn`;
  }
};

const NBETOutstandingBalancetoGencoTable = () => {
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('Total');
  const [rawData, setRawData] = useState([]);
  const [processedData, setProcessedData] = useState([]);
  const [years, setYears] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [dense, setDense] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const [selectedYear, setSelectedYear] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get('http://localhost:5000/api/NBET-Outstanding-Balance-toGenco');
        console.log('API Response:', response.data);
        if (response.data && Array.isArray(response.data) && response.data.length > 0) {
          setRawData(response.data);
          processData(response.data);
        } else {
          throw new Error('Invalid data structure received from the API');
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setError(error.message || 'An error occurred while fetching data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const processData = (data) => {
    const yearSet = new Set();
    const gencoMap = new Map();

    data.forEach(item => {
      yearSet.add(item.Year);
      if (!gencoMap.has(item.Genco)) {
        gencoMap.set(item.Genco, {});
      }
      gencoMap.get(item.Genco)[item.Year] = item.Amount;
    });

    const years = Array.from(yearSet).sort((a, b) => b - a);
    setYears(years);
    setSelectedYear(years[0].toString());

    const processed = Array.from(gencoMap, ([Genco, yearData]) => ({
      Genco,
      ...yearData,
      Total: Object.values(yearData).reduce((sum, current) => sum + current, 0)
    }));

    setProcessedData(processed);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSearch = (event) => {
    setSearch(event.target.value.toLowerCase());
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const handleCompareToggle = () => {
    setCompareMode(!compareMode);
  };

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  const filteredRows = useMemo(() => {
    return processedData.filter(row => 
      row.Genco.toLowerCase().includes(search.toLowerCase())
    );
  }, [processedData, search]);

  const chartData = useMemo(() => {
    return filteredRows
      .map(row => ({
        genco: row.Genco,
        value: parseFloat(row[selectedYear]) || 0
      }))
      .sort((a, b) => b.value - a.value);
  }, [filteredRows, selectedYear]);

  const chartOptions = {
    chart: {
      type: 'bar',
      height: 600,
      toolbar: {
        show: false
      },
      foreColor: 'var(--text-color)',
    },
    plotOptions: {
      bar: {
        borderRadius: 7,
        horizontal: true,
        distributed: true,
        dataLabels: {
          position: 'right'
        },
        barHeight: '70%'
      },
    },
    dataLabels: {
      enabled: true,
      textAnchor: 'start',
      style: {
        colors: ['var(--text-color)']
      },
      formatter: function (val, opt) {
        return formatValue(val);
      },
      offsetX: 5,
      dropShadow: {
        enabled: false
      }
    },
    colors: ['#BE0202'],
    xaxis: {
      categories: chartData.map(item => item.genco),
      labels: {
        style: {
          colors: 'var(--text-color)'
        }
      }
    },
    yaxis: {
      labels: {
        show: true,
        style: {
          colors: 'var(--text-color)'
        }
      }
    },
    title: {
      text: `NBET Outstanding Balance to Genco - ${selectedYear}`,
      align: 'center',
      style: {
        fontSize: '18px',
        color: 'var(--text-color)'
      }
    },
    tooltip: {
      theme: 'var(--theme-mode)',
      y: {
        formatter: function (val) {
          return formatValue(val);
        }
      }
    },
    legend: {
      show: false
    }
  };

  const series = [{
    name: selectedYear,
    data: chartData.map(item => item.value)
  }];

  // Compute totals for each column
  const totals = years.reduce((acc, year) => {
    acc[year] = filteredRows.reduce((sum, row) => sum + (parseFloat(row[year]) || 0), 0);
    return acc;
  }, {});
  
  totals.Total = Object.values(totals).reduce((sum, current) => sum + current, 0);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error">
        Error: {error}
      </Alert>
    );
  }

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredRows.length) : 0;

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2, p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">NBET Outstanding Balance to Genco</Typography>
          <Box>
            <FormControlLabel
              control={<Switch checked={compareMode} onChange={handleCompareToggle} />}
              label="Chart"
            />
            <IconButton>
              <IconFilter size="1.2rem" />
            </IconButton>
          </Box>
        </Box>
        <TextField
          value={search}
          onChange={handleSearch}
          placeholder="Search Gencos"
          fullWidth
          margin="normal"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconSearch />
              </InputAdornment>
            ),
          }}
        />
        {compareMode ? (
          <Box sx={{ mt: 2 }}>
            <TextField
              select
              label="Select Year"
              value={selectedYear}
              onChange={handleYearChange}
              sx={{ mb: 2 }}
            >
              {years.map((year) => (
                <MenuItem key={year} value={year.toString()}>
                  {year}
                </MenuItem>
              ))}
            </TextField>
            <Box sx={{ height: 600 }}>
              <ReactApexChart 
                options={chartOptions} 
                series={series} 
                type="bar" 
                height="100%" 
              />
            </Box>
          </Box>
        ) : (
          <TableContainer>
            <Table aria-labelledby="tableTitle" size={dense ? 'small' : 'medium'}>
              <EnhancedTableHead
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
                years={years}
              />
              <TableBody>
              {stableSort(filteredRows, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TableRow hover tabIndex={-1} key={row.Genco} sx={{ height: 70 }}>
                      <TableCell padding="checkbox">
                        <Avatar src={logoMapping[row.Genco] || DefaultLogo} alt={row.Genco} />
                      </TableCell>
                      <TableCell>{row.Genco}</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold', bgcolor: 'primary.light' }}>
                        {formatValue(row.Total)}
                      </TableCell>
                      {years.map(year => (
                        <TableCell align="right" key={year}>{formatValue(parseFloat(row[year]) || 0)}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={10} />
                  </TableRow>
                )}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={2} align="right">Totals</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold', bgcolor: 'primary.light' }}>
                    {formatTotalValue(totals.Total)}
                  </TableCell>
                  {years.map(year => (
                    <TableCell align="right" key={year} sx={{ fontWeight: 'bold', bgcolor: 'primary.light' }}>
                      {formatTotalValue(totals[year])}
                    </TableCell>
                  ))}
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        )}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
          <FormControlLabel
            control={<Switch checked={dense} onChange={handleChangeDense} />}
            label="Dense padding"
          />
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredRows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default NBETOutstandingBalancetoGencoTable;