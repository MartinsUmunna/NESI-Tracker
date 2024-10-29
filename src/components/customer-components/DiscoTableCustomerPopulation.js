import * as React from 'react';
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
  Avatar,
  InputAdornment,
  Switch,
  FormControlLabel,
  ButtonGroup,
  Button,
  CircularProgress,
  MenuItem,
  Select,
  TableFooter
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { IconSearch } from '@tabler/icons';
import ReactApexChart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
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
        </TableCell>
        <TableCell>DisCo</TableCell>
        {years.map((year) => (
          <TableCell
            key={year}
            align="right"
            sortDirection={orderBy === year ? order : false}
          >
            <TableSortLabel
              active={orderBy === year}
              direction={orderBy === year ? order : 'asc'}
              onClick={createSortHandler(year)}
            >
              {year}
              {orderBy === year ? (
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

const DiscoTableCustomerPopulation = () => {
  const theme = useTheme();
  const [order, setOrder] = React.useState('desc');
  const [orderBy, setOrderBy] = React.useState('Total');
  const [rows, setRows] = React.useState([]);
  const [search, setSearch] = React.useState('');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [dense, setDense] = React.useState(false);
  const [selectedType, setSelectedType] = React.useState('Total');
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [years, setYears] = React.useState([]);
  const [showChart, setShowChart] = React.useState(false);
  const [selectedYear, setSelectedYear] = React.useState('');

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}/api/Disco-Customer-Number`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        const processedData = processData(data);
        setRows(processedData);
        const sortedYears = [...new Set(data.map(item => item.Year))].sort((a, b) => b - a);
        setYears(sortedYears);
        setSelectedYear(sortedYears[0]);
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
    const groupedData = data.reduce((acc, item) => {
      if (!acc[item.Discos]) {
        acc[item.Discos] = {
          genco: item.Discos,
          img: logoMap[item.Discos] || '',
          metered: {},
          unmetered: {},
          total: {}
        };
      }
      
      const type = item.Customer_Type === 'Metered Customer' ? 'metered' : 'unmetered';
      acc[item.Discos][type][item.Year] = item.Customer_Number;
      
      // Calculate total for each year
      acc[item.Discos].total[item.Year] = (acc[item.Discos].metered[item.Year] || 0) + (acc[item.Discos].unmetered[item.Year] || 0);

      return acc;
    }, {});

    return Object.values(groupedData);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearch(value);
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

  const formatNumber = (num) => {
    return Math.round(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const handleFilterClick = (type) => {
    setSelectedType(type);
  };

  const filteredRows = React.useMemo(() => {
    return rows.filter(row => 
      row.genco.toLowerCase().includes(search.toLowerCase())
    ).map(row => ({
      ...row,
      ...row[selectedType.toLowerCase()]
    }));
  }, [rows, search, selectedType]);

  const chartData = React.useMemo(() => {
    return filteredRows.map(row => ({
      x: row.genco,
      y: row[selectedYear] || 0
    })).sort((a, b) => b.y - a.y);
  }, [filteredRows, selectedYear]);

  const chartOptions = {
    chart: {
      type: 'bar',
      height: 350
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
      }
    },
    colors: [theme.palette.primary.main],
    dataLabels: {
      enabled: true,
      textAnchor: 'start',
      formatter: function (val) {
        return formatNumber(val);
      },
      style: {
        fontSize: '12px',
        colors: ['#000']
      },
      offsetX: 30,
    },
    xaxis: {
      categories: chartData.map(item => item.x),
    },
    yaxis: {
      title: {
        text: 'Customer Number'
      }
    },
    title: {
      text: `DisCo Customer Population (${selectedType}) - ${selectedYear}`,
      align: 'center'
    }
  };

  const series = [{
    data: chartData.map(item => item.y)
  }];

  const calculateTotal = (year) => {
    return filteredRows.reduce((sum, row) => sum + (row[year] || 0), 0);
  };

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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Disco Customer Population</Typography>
          <FormControlLabel
            control={<Switch checked={showChart} onChange={(e) => setShowChart(e.target.checked)} />}
            label="Chart"
          />
        </Box>
        <ButtonGroup fullWidth variant="outlined" aria-label="outlined button group" sx={{ borderRadius: '20px', mb: 2 }}>
          <Button 
            onClick={() => handleFilterClick('Metered')} 
            sx={{ 
              borderRadius: '20px', 
              borderColor: 'primary.main', 
              color: selectedType === 'Metered' ? 'common.white' : 'primary.main',
              bgcolor: selectedType === 'Metered' ? 'primary.main' : 'transparent',
              '&:hover': {
                bgcolor: selectedType === 'Metered' ? 'primary.dark' : 'transparent',
              }
            }}
          >
            Metered
          </Button>
          <Button 
            onClick={() => handleFilterClick('Unmetered')} 
            sx={{ 
              borderRadius: '20px', 
              borderColor: 'primary.main', 
              color: selectedType === 'Unmetered' ? 'common.white' : 'primary.main',
              bgcolor: selectedType === 'Unmetered' ? 'primary.main' : 'transparent',
              '&:hover': {
                bgcolor: selectedType === 'Unmetered' ? 'primary.dark' : 'transparent',
              }
            }}
          >
            Unmetered
          </Button>
          <Button 
            onClick={() => handleFilterClick('Total')} 
            sx={{ 
              borderRadius: '20px', 
              borderColor: 'primary.main', 
              color: selectedType === 'Total' ? 'common.white' : 'primary.main',
              bgcolor: selectedType === 'Total' ? 'primary.main' : 'transparent',
              '&:hover': {
                bgcolor: selectedType === 'Total' ? 'primary.dark' : 'transparent',
              }
            }}
          >
            Total
          </Button>
        </ButtonGroup>
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
        {showChart ? (
          <Box sx={{ mt: 2, position: 'relative' }}>
            <Box sx={{ position: 'absolute', top: 0, left: 0, zIndex: 1 }}>
              <Select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                sx={{ minWidth: 120 }}
              >
                {years.map((year) => (
                  <MenuItem key={year} value={year}>{year}</MenuItem>
                ))}
              </Select>
            </Box>
            <Box sx={{ height: 350, mt: 4 }}>
              <ReactApexChart options={chartOptions} series={series} type="bar" height={350} />
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
                    <TableRow hover tabIndex={-1} key={row.genco}>
                      <TableCell padding="checkbox">
                        <Avatar src={row.img} alt={row.genco} />
                      </TableCell>
                      <TableCell>{row.genco}</TableCell>
                      {years.map(year => (
                        <TableCell align="right" key={year}>
                          {formatNumber(row[year] || 0)}
                          </TableCell>
                      ))}
                    </TableRow>
                  ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={2}>Total</TableCell>
                  {years.map(year => (
                    <TableCell align="right" key={year} sx={{ fontWeight: 'bold' }}>
                      {formatNumber(calculateTotal(year))}
                    </TableCell>
                  ))}
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        )}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredRows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      />
    </Box>
  );
};

export default DiscoTableCustomerPopulation;