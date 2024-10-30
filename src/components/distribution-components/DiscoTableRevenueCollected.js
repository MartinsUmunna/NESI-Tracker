import React, { useState, useEffect } from 'react';
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
  Switch,
  FormControlLabel,
  MenuItem,
  Avatar,
  TableFooter,
  InputAdornment
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { useTheme } from '@mui/material/styles';
import { IconSearch, IconFilter } from '@tabler/icons';
import ReactApexChart from 'react-apexcharts';
import API_URL from 'src/config/apiconfig';

// Import logos (assuming these imports are correct)
import AbujaLogo from 'src/assets/images/Genco_Logos/Abuja_Logo.jpg';
import BeninLogo from 'src/assets/images/Genco_Logos/Benin_Logo.jpg';
import EkoLogo from 'src/assets/images/Genco_Logos/Eko_Logo.jpg';
import EnuguLogo from 'src/assets/images/Genco_Logos/Enugu_Logo.jpg';
import IbadanLogo from 'src/assets/images/Genco_Logos/Ibadan_Logo.jpg';
import IkejaLogo from 'src/assets/images/Genco_Logos/Ikeja_Logo.jpg';
import JosLogo from 'src/assets/images/Genco_Logos/Jos_Logo.jpg';
import KadunaLogo from 'src/assets/images/Genco_Logos/Kaduna_Logo.jpg';
import KanoLogo from 'src/assets/images/Genco_Logos/Kano_Logo.jpg';
import PortharcourtLogo from 'src/assets/images/Genco_Logos/ph_Logo.jpg';
import YolaLogo from 'src/assets/images/Genco_Logos/Yola_logo.jpg';

const logoMap = {
  Abuja: AbujaLogo,
  Benin: BeninLogo,
  Eko: EkoLogo,
  Enugu: EnuguLogo,
  Ibadan: IbadanLogo,
  Ikeja: IkejaLogo,
  Jos: JosLogo,
  Kaduna: KadunaLogo,
  Kano: KanoLogo,
  Portharcourt: PortharcourtLogo,
  Yola: YolaLogo,
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

const EnhancedTableHead = ({ order, orderBy, onRequestSort, years }) => {
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox"></TableCell>
        <TableCell>
          <TableSortLabel
            active={orderBy === 'Discos'}
            direction={orderBy === 'Discos' ? order : 'asc'}
            onClick={createSortHandler('Discos')}
          >
            Disco
            {orderBy === 'Discos' ? (
              <Box component="span" sx={visuallyHidden}>
                {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
              </Box>
            ) : null}
          </TableSortLabel>
        </TableCell>
        <TableCell align="right">Total</TableCell>
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

const DiscoTableRevenueCollected = () => {
  const theme = useTheme();
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('total');
  const [rows, setRows] = useState([]);
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
        const response = await fetch(`${API_URL}/Disco-Revenue-Collected`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Fetched data:', data);
        
        const processedData = processData(data);
        setRows(processedData.rows);
        setYears(processedData.years);
        setSelectedYear(processedData.years[0].toString());
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const processData = (data) => {
    const yearSet = new Set();
    const discoMap = new Map();

    data.forEach(item => {
      yearSet.add(item.Year);
      if (!discoMap.has(item.Discos)) {
        discoMap.set(item.Discos, {});
      }
      discoMap.get(item.Discos)[item.Year] = item.RevenueCollected;
    });

    const years = Array.from(yearSet).sort((a, b) => b - a);
    const rows = Array.from(discoMap, ([disco, yearData]) => ({
      Discos: disco,
      ...years.reduce((acc, year) => {
        acc[year] = yearData[year] || 0;
        return acc;
      }, {}),
      img: logoMap[disco] || ''
    }));

    return { rows, years };
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSearch = (event) => {
    setSearch(event.target.value);
    setPage(0);
  };

  const handleCompareToggle = () => {
    setCompareMode(!compareMode);
  };

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  const filteredRows = React.useMemo(() => {
    return rows.filter(row =>
      row.Discos.toLowerCase().includes(search.toLowerCase())
    );
  }, [rows, search]);

  const chartData = React.useMemo(() => {
    return filteredRows
      .map(row => ({
        disco: row.Discos,
        value: row[selectedYear] || 0
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
      background: 'transparent',
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: true,
        distributed: false,
        dataLabels: {
          position: 'right'
        },
        barHeight: '70%',
      },
    },
    colors: [theme.palette.primary.main],
    dataLabels: {
      enabled: true,
      textAnchor: 'start',
      formatter: function (val) {
        return formatValue(val);
      },
      offsetX: 5,
      dropShadow: {
        enabled: false
      },
      style: {
        colors: [theme.palette.text.primary]
      }
    },
    xaxis: {
      categories: chartData.map(item => item.disco),
      labels: {
        style: {
          colors: [theme.palette.text.primary],
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: [theme.palette.text.primary],
        }
      }
    },
    title: {
      text: `DisCo Revenue Collected - ${selectedYear}`,
      align: 'center',
      style: {
        color: theme.palette.text.primary
      }
    },
    tooltip: {
      theme: 'dark',
      y: {
        formatter: function (val) {
          return formatValue(val);
        }
      },
      style: {
        color: theme.palette.text.primary,
      },
      background: theme.palette.background.paper,
    },
    legend: {
      show: false
    }
  };

  const series = [{
    name: selectedYear,
    data: chartData.map(item => item.value)
  }];

  const formatValue = (value) => {
    if (value >= 1e12) {
      return `₦${(value / 1e12).toFixed(1)}T`;
    } else if (value >= 1e9) {
      return `₦${(value / 1e9).toFixed(1)}B`;
    } else if (value >= 1e6) {
      return `₦${(value / 1e6).toFixed(1)}M`;
    } else {
      return `₦${value.toFixed(1)}`;
    }
  };

  const totals = React.useMemo(() => {
    return years.reduce((acc, year) => {
      acc[year] = filteredRows.reduce((sum, row) => sum + (row[year] || 0), 0);
      return acc;
    }, {});
  }, [filteredRows, years]);

  const totalSum = React.useMemo(() => {
    return Object.values(totals).reduce((sum, current) => sum + current, 0);
  }, [totals]);

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredRows.length) : 0;

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography color="error">Error: {error}</Typography>;
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2, p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">DisCo Revenue Collected</Typography>
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
          placeholder="Search DisCos"
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
                  .map((row, index) => (
                    <TableRow hover tabIndex={-1} key={row.Discos} sx={{ height: 70 }}>
                      <TableCell padding="checkbox">
                        <Avatar src={row.img} alt={row.Discos} />
                      </TableCell>
                      <TableCell>{row.Discos}</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold', bgcolor: 'primary.light' }}>
                        {formatValue(years.reduce((sum, year) => sum + (row[year] || 0), 0))}
                      </TableCell>
                      {years.map(year => (
                        <TableCell align="right" key={year}>{formatValue(row[year] || 0)}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={years.length + 3} />
                  </TableRow>
                )}
              </TableBody>
              <TableFooter>
                <TableRow>
                <TableCell colSpan={2} align="right">Totals</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold', bgcolor: 'primary.light' }}>
                    {formatValue(totalSum)}
                  </TableCell>
                  {years.map(year => (
                    <TableCell align="right" key={year} sx={{ fontWeight: 'bold', bgcolor: 'primary.light' }}>
                      {formatValue(totals[year])}
                    </TableCell>
                  ))}
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        )}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
          <FormControlLabel
            control={<Switch checked={dense} onChange={event => setDense(event.target.checked)} />}
            label="Dense padding"
          />
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredRows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(event, newPage) => setPage(newPage)}
            onRowsPerPageChange={(event) => {
              setRowsPerPage(parseInt(event.target.value, 10));
              setPage(0);
            }}
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default DiscoTableRevenueCollected;