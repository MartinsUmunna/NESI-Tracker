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
  Tooltip,
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
import { IconSearch, IconFilter } from '@tabler/icons';
import ReactApexChart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import API_URL from '../../config/apiconfig';

import AbujaLogo from 'src/assets/images/Genco_Logos/Abuja_Logo.jpg';
import BeninLogo from 'src/assets/images/Genco_Logos/Benin_Logo.jpg';
import PhLogo from 'src/assets/images/Genco_Logos/Ph_Logo.jpg';
import EkoLogo from 'src/assets/images/Genco_Logos/Eko_Logo.jpg';
import EnuguLogo from 'src/assets/images/Genco_Logos/Enugu_Logo.jpg';
import IbadanLogo from 'src/assets/images/Genco_Logos/Ibadan_Logo.jpg';
import IkejaLogo from 'src/assets/images/Genco_Logos/Ikeja_Logo.jpg';
import JosLogo from 'src/assets/images/Genco_Logos/Jos_Logo.jpg';
import KadunaLogo from 'src/assets/images/Genco_Logos/Kaduna_Logo.jpg';
import KanoLogo from 'src/assets/images/Genco_Logos/Kano_Logo.jpg';
import PortharcourtLogo from 'src/assets/images/Genco_Logos/ph_Logo.jpg';
import YolaLogo from 'src/assets/images/Genco_Logos/Yola_logo.jpg';

const discoLogos = {
  Abuja: AbujaLogo,
  Benin: BeninLogo,
  Ph: PhLogo,
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
        <TableCell>DisCo</TableCell>
        <TableCell align="right">Average</TableCell>
        {years.map((year) => (
          <TableCell
            key={year}
            align="right"
            sortDirection={orderBy === year.toString() ? order : false}
          >
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

EnhancedTableHead.propTypes = {
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  years: PropTypes.array.isRequired,
};

const DiscoTableTariff = () => {
  const theme = useTheme();
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('Average');
  const [rows, setRows] = React.useState([]);
  const [search, setSearch] = React.useState('');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [dense, setDense] = React.useState(false);
  const [compareMode, setCompareMode] = React.useState(false);
  const [selectedYear, setSelectedYear] = React.useState('');
  const [years, setYears] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(`${API_URL}/Yearly-Disco-Tariff`);
      const data = await response.json();
      
      // Extract unique years from the data
      const uniqueYears = [...new Set(data.map(item => item.Year))].sort((a, b) => b - a);
      setYears(uniqueYears);
      setSelectedYear(uniqueYears[0].toString());
      
      // Process the data
      const processedData = processApiData(data, uniqueYears);
      setRows(processedData);
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const processApiData = (data, years) => {
    const discoData = {};
    data.forEach(item => {
      if (!discoData[item.Discos]) {
        discoData[item.Discos] = { genco: item.Discos, img: discoLogos[item.Discos] || '' };
      }
      discoData[item.Discos][item.Year] = item.Tariff;
    });

    return Object.values(discoData).map(disco => {
      const yearValues = years.map(year => disco[year] || 0);
      const validValues = yearValues.filter(value => value !== 0);
      const average = validValues.length > 0 
        ? validValues.reduce((sum, value) => sum + value, 0) / validValues.length 
        : 0;
      return { 
        ...disco, 
        Average: Number(average.toFixed(1)),
        ...Object.fromEntries(years.map(year => [year, Number((disco[year] || 0).toFixed(1))]))
      };
    });
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    const filteredRows = rows.filter(row => 
      row.genco.toLowerCase().includes(value)
    );
    setSearch(value);
    setRows(filteredRows);
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

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const handleCompareToggle = () => {
    setCompareMode(!compareMode);
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
        return '₦'+`${val.toFixed(1)}kWh`;
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
        formatter: (val) => '₦'+`${val}kWh` 
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
      text: `DisCo Tariff - ${selectedYear}`,
      align: 'center',
      style: {
        color: theme.palette.text.primary 
      }
    },
    tooltip: {
      theme: 'dark', 
      y: {
        formatter: function (val) {
          return `${val.toFixed(1)} kWh`;
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
  const averages = years.reduce((acc, year) => {
    const validValues = rows.map(row => row[year]).filter(value => value !== 0);
    acc[year] = (validValues.reduce((sum, current) => sum + current, 0) / validValues.length).toFixed(1);
    return acc;
  }, {});

  // Compute total average for the entire period
  const totalValidValues = rows.flatMap(row => 
    years.map(year => row[year]).filter(value => value !== 0)
  );
  averages.total = (
    totalValidValues.reduce((sum, current) => sum + current, 0) / totalValidValues.length
  ).toFixed(1);

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2, p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Disco Tariffs</Typography>
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
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => (
                  <TableRow hover tabIndex={-1} key={row.genco} sx={{ height: 70 }}>
                    <TableCell padding="checkbox">
                        <Avatar src={row.img} alt={row.genco} />
                    </TableCell>
                    <TableCell>{row.genco}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold', bgcolor:'primary.light' }}>
                      ₦{row.Average.toFixed(1)} KWh
                    </TableCell>
                    {years.map(year => (
                      <TableCell align="right" key={year}>{`₦${row[year].toFixed(1)} KWh`}</TableCell>
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
                  ₦{averages.total} KWh
                </TableCell>
                {years.map(year => (
                  <TableCell align="right" key={year} sx={{ fontWeight: 'bold', bgcolor: 'primary.light' }}>
                    ₦{averages[year]} KWh
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

export default DiscoTableTariff;