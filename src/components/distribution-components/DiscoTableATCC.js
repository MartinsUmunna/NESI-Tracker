import * as React from 'react';
import PropTypes from 'prop-types';
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
  Checkbox,
  TableFooter,
  Avatar,
  InputAdornment,
  Switch,
  FormControlLabel,
  MenuItem,
  CircularProgress
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { useTheme } from '@mui/material/styles';
import { IconSearch, IconFilter } from '@tabler/icons';
import ReactApexChart from 'react-apexcharts';
import API_URL from 'src/config/apiconfig';

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
  'Abuja': AbujaLogo,
  'Benin': BeninLogo,
  'Eko': EkoLogo,
  'Enugu': EnuguLogo,
  'Ibadan': IbadanLogo,
  'Ikeja': IkejaLogo,
  'Jos': JosLogo,
  'Kaduna': KadunaLogo,
  'Kano': KanoLogo,
  'Port Harcourt': PortharcourtLogo,
  'Yola': YolaLogo
};

// Updated fields array to include all years from 2015-2023
const fields = ["2023", "2022", "2021", "2020", "2019", "2018", "2017", "2016", "2015"];

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
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
        </TableCell>
        <TableCell>
          <TableSortLabel
            active={orderBy === 'genco'}
            direction={orderBy === 'genco' ? order : 'asc'}
            onClick={createSortHandler('genco')}
          >
            Disco
            {orderBy === 'genco' ? (
              <Box component="span" sx={visuallyHidden}>
                {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
              </Box>
            ) : null}
          </TableSortLabel>
        </TableCell>
        <TableCell align="right">Average</TableCell>
        {fields.map((field) => (
          <TableCell key={field} align="right">
            <TableSortLabel
              active={orderBy === field}
              direction={orderBy === field ? order : 'asc'}
              onClick={createSortHandler(field)}
            >
              {field}
              {orderBy === field ? (
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

EnhancedTableHead.propTypes = {
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  onRequestSort: PropTypes.func.isRequired,
};

const DiscoTableATCC = () => {
  const theme = useTheme();
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('total');
  const [rows, setRows] = React.useState([]);
  const [initialRows, setInitialRows] = React.useState([]);
  const [search, setSearch] = React.useState('');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [dense, setDense] = React.useState(false);
  const [compareMode, setCompareMode] = React.useState(false);
  const [selectedYear, setSelectedYear] = React.useState('2023');
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}/DisCo-Atcc`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        // Transform API data into required format
        const transformedData = Object.values(data.reduce((acc, item) => {
          if (!acc[item.Disco]) {
            acc[item.Disco] = {
              genco: item.Disco,
              img: logoMap[item.Disco] || '',
            };
          }
          acc[item.Disco][item.Year.toString()] = item.ATCC;
          return acc;
        }, {}));

        setRows(transformedData);
        setInitialRows(transformedData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    const filteredRows = initialRows.filter(row => 
      row.genco.toLowerCase().includes(value)
    );
    setSearch(value);
    setRows(filteredRows);
  };

  const handleCompareToggle = () => {
    setCompareMode(!compareMode);
  };

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const chartData = React.useMemo(() => {
    return rows
      .map(row => ({
        disco: row.genco,
        value: row[selectedYear] || 0
      }))
      .sort((a, b) => b.value - a.value);
  }, [rows, selectedYear]);

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
      formatter: function (val, opt) {
        return `${val.toFixed(1)}%`;
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
        },
        formatter: (val) => `${val}%`
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
      text: `DisCo ATCC - ${selectedYear}`,
      align: 'center',
      style: {
        color: theme.palette.text.primary
      }
    },
    tooltip: {
      theme: 'dark',
      y: {
        formatter: function (val) {
          return `${val.toFixed(1)}%`;
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

  // Compute averages for each column
  const averages = fields.reduce((acc, field) => {
    acc[field] = (rows.reduce((sum, row) => sum + (row[field] || 0), 0) / rows.length).toFixed(1);
    return acc;
  }, {});

  // Compute total average for the entire period
  averages.total = (
    Object.values(averages).reduce((sum, current) => sum + parseFloat(current), 0) / fields.length
  ).toFixed(1);

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">Error loading data: {error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2, p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Disco ATCC</Typography>
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
              {fields.map((year) => (
                <MenuItem key={year} value={year}>
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
              />
              <TableBody>
                {stableSort(rows, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => (
                    <TableRow hover tabIndex={-1} key={row.genco} sx={{ height: 70 }}>
                      <TableCell padding="checkbox">
                        <Avatar src={row.img} alt={row.genco} />
                      </TableCell>
                      <TableCell>{row.genco}</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold', bgcolor: 'primary.light' }}>
                        {(
                          fields.reduce((sum, year) => sum + (row[year] || 0), 0) / fields.length
                        ).toFixed(1)}%
                      </TableCell>
                      {fields.map(year => (
                        <TableCell align="right" key={year}>
                          {row[year] ? `${row[year].toFixed(1)}%` : '-'}
                        </TableCell>
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
                  <TableCell colSpan={2} align="right">Average</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold', bgcolor: 'primary.light' }}>
                    {averages.total}%
                  </TableCell>
                  {fields.map(year => (
                    <TableCell align="right" key={year} sx={{ fontWeight: 'bold', bgcolor: 'primary.light' }}>
                      {averages[year]}%
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
            count={rows.length}
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

export default DiscoTableATCC;