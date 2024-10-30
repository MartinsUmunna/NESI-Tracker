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
  MenuItem
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { useTheme } from '@mui/material/styles';
import { IconSearch, IconFilter } from '@tabler/icons';
import ReactApexChart from 'react-apexcharts';
import API_URL from '../../config/apiconfig';

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
  'Portharcourt': PortharcourtLogo,
  'Yola': YolaLogo
};

function descendingComparator(a, b, orderBy) {
  const MYTOKey = `${orderBy.split('_')[0]}_MYTO`;
  const actualKey = `${orderBy.split('_')[0]}_Actual`;
  if (b[MYTOKey] < a[MYTOKey]) {
    return -1;
  }
  if (b[MYTOKey] > a[MYTOKey]) {
    return 1;
  }
  if (b[actualKey] < a[actualKey]) {
    return -1;
  }
  if (b[actualKey] > a[actualKey]) {
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
        <TableCell padding="checkbox" />
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
        <TableCell align="right">Avg Actual Offtake</TableCell>
        {years.map((year) => (
          <TableCell key={year} align="right">
            <TableSortLabel
              active={orderBy === `${year}_MYTO` || orderBy === `${year}_Actual`}
              direction={orderBy === `${year}_MYTO` || orderBy === `${year}_Actual` ? order : 'asc'}
              onClick={createSortHandler(`${year}_MYTO`)}
            >
              {year}
              {orderBy === `${year}_MYTO` || orderBy === `${year}_Actual` ? (
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
  years: PropTypes.array.isRequired
};

const DiscoTableLoadOffTake = () => {
  const theme = useTheme();
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('');
  const [rows, setRows] = React.useState([]);
  const [years, setYears] = React.useState([]);
  const [search, setSearch] = React.useState('');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [dense, setDense] = React.useState(false);
  const [compareMode, setCompareMode] = React.useState(false);
  const [selectedYear, setSelectedYear] = React.useState('');
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}/Disco-Load-Offtake`);
        const data = await response.json();

        // Extract unique years and sort them
        const uniqueYears = [...new Set(data.map(item => item.Years))].sort((a, b) => b - a);
        setYears(uniqueYears);
        setSelectedYear(uniqueYears[0].toString());

        // Transform data into required format
        const transformedData = data.reduce((acc, item) => {
          const disco = item.Discos;
          const year = item.Years;
          const value = parseFloat(item.Load_Offtake.replace('%', ''));
          const type = item.Offtake_Type;

          if (!acc[disco]) {
            acc[disco] = {
              genco: disco,
              img: logoMap[disco]
            };
          }

          acc[disco][`${year}_${type === 'MYTO' ? 'MYTO' : 'Actual'}`] = value;

          return acc;
        }, {});

        setRows(Object.values(transformedData).sort((a, b) => a.genco.localeCompare(b.genco)));
        setOrderBy(`${uniqueYears[0]}_MYTO`);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
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
    setSearch(value);
    const filteredRows = rows.filter(row => 
      row.genco.toLowerCase().includes(value)
    );
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

  const calculateActualAverage = (row) => {
    const actualValues = years.map(year => row[`${year}_Actual`] || 0);
    return actualValues.reduce((sum, value) => sum + value, 0) / actualValues.length;
  };

  const chartData = React.useMemo(() => {
    return rows.map(row => ({
      disco: row.genco,
      'MYTO Allocation (%)': row[`${selectedYear}_MYTO`] || 0,
      'Actual Load Allocation (%)': row[`${selectedYear}_Actual`] || 0
    }))
    .sort((a, b) => b['MYTO Allocation (%)'] - a['MYTO Allocation (%)']);
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
    colors: [theme.palette.primary.main, theme.palette.secondary.main],
    dataLabels: {
      enabled: true,
      textAnchor: 'start',
      formatter: function (val) {
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
      text: `MYTO Allocation vs Actual Load Allocation - ${selectedYear}`,
      align: 'center',
      style: {
        color: theme.palette.text.primary
      }
    },
    tooltip: {
      theme: theme.palette.mode,
      y: {
        formatter: function (val) {
          return `${val.toFixed(1)}%`;
        }
      }
    },
    legend: {
      show: true,
      position: 'top',
      horizontalAlign: 'right',
      markers: {
        width: 12,
        height: 12,
        radius: 2
      },
      itemMargin: {
        horizontal: 8,
        vertical: 0
      }
    }
  };

  const series = [
    {
      name: 'MYTO Allocation (%)',
      data: chartData.map(item => item['MYTO Allocation (%)'])
    },
    {
      name: 'Actual Load Allocation (%)',
      data: chartData.map(item => item['Actual Load Allocation (%)'])
    }
  ];

  // Compute Average for Actuals only
  const averages = years.reduce((acc, year) => {
    acc[`${year}_Actual`] = (rows.reduce((sum, row) => sum + (row[`${year}_Actual`] || 0), 0) / rows.length).toFixed(1);
    return acc;
  }, {});

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2, p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Load Offtake by Discos</Typography>
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
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                <Box sx={{ width: 16, height: 16, bgcolor: theme.palette.primary.main, mr: 1 }} />
                
                <Typography variant="body2">MYTO</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ width: 16, height: 16, bgcolor: theme.palette.secondary.main, mr: 1 }} />
                <Typography variant="body2">Actual</Typography>
              </Box>
            </Box>
            <Table aria-labelledby="tableTitle" size={dense ? 'small' : 'medium'}>
              <EnhancedTableHead
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
                years={years}
              />
              <TableBody>
                {stableSort(rows, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => (
                    <TableRow hover tabIndex={-1} key={row.genco} sx={{ height: 90 }}>
                      <TableCell padding="checkbox">
                        <Avatar src={row.img} alt={row.genco} />
                      </TableCell>
                      <TableCell>{row.genco}</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold', bgcolor: 'primary.light' }}>
                        {calculateActualAverage(row).toFixed(1)}%
                      </TableCell>
                      {years.map(year => (
                        <TableCell align="right" key={year} sx={{ p: 1 }}>
                          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography sx={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>
                              {(row[`${year}_MYTO`] || 0).toFixed(1)}%
                            </Typography>
                            <Box sx={{ height: 1, bgcolor: 'divider', my: 0.5 }} />
                            <Typography sx={{ color: theme.palette.secondary.main, fontWeight: 'bold' }}>
                              {(row[`${year}_Actual`] || 0).toFixed(1)}%
                            </Typography>
                          </Box>
                        </TableCell>
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
                  <TableCell colSpan={2} align="right">Average</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold', bgcolor: 'primary.light' }}>
                    {(Object.values(averages).reduce((sum, value) => sum + parseFloat(value), 0) / years.length).toFixed(1)}%
                  </TableCell>
                  {years.map(year => (
                    <TableCell align="right" key={year} sx={{ p: 1 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography sx={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>
                          {(rows.reduce((sum, row) => sum + (row[`${year}_MYTO`] || 0), 0) / rows.length).toFixed(1)}%
                        </Typography>
                        <Box sx={{ height: 1, bgcolor: 'divider', my: 0.5 }} />
                        <Typography sx={{ color: theme.palette.secondary.main, fontWeight: 'bold' }}>
                          {averages[`${year}_Actual`]}%
                        </Typography>
                      </Box>
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

export default DiscoTableLoadOffTake;
               