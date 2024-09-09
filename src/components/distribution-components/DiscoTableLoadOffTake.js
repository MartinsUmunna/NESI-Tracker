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

const initialData = [
  { genco: 'Abuja', "2023_MYTO": 45, "2023_Actual": 30, "2022_MYTO": 30, "2022_Actual": 25, "2021_MYTO": 25, "2021_Actual": 50, "2020_MYTO": 50, "2020_Actual": 40, "2019_MYTO": 40, "2019_Actual": 35, "2018_MYTO": 35, "2018_Actual": 30, "2017_MYTO": 30, "2017_Actual": 25, img: AbujaLogo },
  { genco: 'Benin', "2023_MYTO": 50, "2023_Actual": 40, "2022_MYTO": 40, "2022_Actual": 30, "2021_MYTO": 30, "2021_Actual": 45, "2020_MYTO": 45, "2020_Actual": 35, "2019_MYTO": 35, "2019_Actual": 30, "2018_MYTO": 30, "2018_Actual": 25, "2017_MYTO": 25, "2017_Actual": 25, img: BeninLogo },
  { genco: 'Eko', "2023_MYTO": 22, "2023_Actual": 26, "2022_MYTO": 26, "2022_Actual": 24, "2021_MYTO": 24, "2021_Actual": 32, "2020_MYTO": 32, "2020_Actual": 38, "2019_MYTO": 38, "2019_Actual": 30, "2018_MYTO": 30, "2018_Actual": 29, "2017_MYTO": 29, "2017_Actual": 29, img: EkoLogo },
  { genco: 'Enugu', "2023_MYTO": 47, "2023_Actual": 31, "2022_MYTO": 31, "2022_Actual": 22, "2021_MYTO": 22, "2021_Actual": 41, "2020_MYTO": 41, "2020_Actual": 28, "2019_MYTO": 28, "2019_Actual": 25, "2018_MYTO": 25, "2018_Actual": 39, "2017_MYTO": 39, "2017_Actual": 39, img: EnuguLogo },
  { genco: 'Ibadan', "2023_MYTO": 36, "2023_Actual": 47, "2022_MYTO": 47, "2022_Actual": 49, "2021_MYTO": 49, "2021_Actual": 38, "2020_MYTO": 38, "2020_Actual": 33, "2019_MYTO": 33, "2019_Actual": 41, "2018_MYTO": 41, "2018_Actual": 29, "2017_MYTO": 29, "2017_Actual": 29, img: IbadanLogo },
  { genco: 'Ikeja', "2023_MYTO": 34, "2023_Actual": 47, "2022_MYTO": 47, "2022_Actual": 39, "2021_MYTO": 39, "2021_Actual": 30, "2020_MYTO": 30, "2020_Actual": 44, "2019_MYTO": 44, "2019_Actual": 35, "2018_MYTO": 35, "2018_Actual": 32, "2017_MYTO": 32, "2017_Actual": 32, img: IkejaLogo },
  { genco: 'Jos', "2023_MYTO": 48, "2023_Actual": 33, "2022_MYTO": 33, "2022_Actual": 40, "2021_MYTO": 40, "2021_Actual": 29, "2020_MYTO": 29, "2020_Actual": 38, "2019_MYTO": 38, "2019_Actual": 37, "2018_MYTO": 37, "2018_Actual": 28, "2017_MYTO": 28, "2017_Actual": 28, img: JosLogo },
  { genco: 'Kaduna', "2023_MYTO": 39, "2023_Actual": 41, "2022_MYTO": 41, "2022_Actual": 45, "2021_MYTO": 45, "2021_Actual": 47, "2020_MYTO": 47, "2020_Actual": 30, "2019_MYTO": 30, "2019_Actual": 33, "2018_MYTO": 33, "2018_Actual": 35, "2017_MYTO": 35, "2017_Actual": 35, img: KadunaLogo },
  { genco: 'Kano', "2023_MYTO": 41, "2023_Actual": 37, "2022_MYTO": 37, "2022_Actual": 32, "2021_MYTO": 32, "2021_Actual": 49, "2020_MYTO": 49, "2020_Actual": 27, "2019_MYTO": 27, "2019_Actual": 29, "2018_MYTO": 29, "2018_Actual": 42, "2017_MYTO": 42, "2017_Actual": 42, img: KanoLogo },
  { genco: 'Portharcourt', "2023_MYTO": 34, "2023_Actual": 45, "2022_MYTO": 45, "2022_Actual": 38, "2021_MYTO": 38, "2021_Actual": 41, "2020_MYTO": 41, "2020_Actual": 47, "2019_MYTO": 47, "2019_Actual": 36, "2018_MYTO": 36, "2018_Actual": 30, "2017_MYTO": 30, "2017_Actual": 30, img: PortharcourtLogo },
  { genco: 'Yola', "2023_MYTO": 38, "2023_Actual": 33, "2022_MYTO": 33, "2022_Actual": 41, "2021_MYTO": 41, "2021_Actual": 42, "2020_MYTO": 42, "2020_Actual": 37, "2019_MYTO": 37, "2019_Actual": 28, "2018_MYTO": 28, "2018_Actual": 29, "2017_MYTO": 29, "2017_Actual": 29, img: YolaLogo },
];

const fields = ["2023", "2022", "2021", "2020", "2019", "2018", "2017"];

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
  const { order, orderBy, onRequestSort } = props;
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
        <TableCell align="right">Total</TableCell>
        {fields.map((field) => (
          <TableCell key={field} align="right">
            <TableSortLabel
              active={orderBy === `${field}_MYTO` || orderBy === `${field}_Actual`}
              direction={orderBy === `${field}_MYTO` || orderBy === `${field}_Actual` ? order : 'asc'}
              onClick={createSortHandler(`${field}_MYTO`)}
            >
              {field}
              {orderBy === `${field}_MYTO` || orderBy === `${field}_Actual` ? (
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

const DiscoTableLoadOffTake = () => {
  const theme = useTheme();
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('2023_MYTO');
  const [rows, setRows] = React.useState(initialData);
  const [search, setSearch] = React.useState('');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [dense, setDense] = React.useState(false);
  const [compareMode, setCompareMode] = React.useState(false);
  const [selectedYear, setSelectedYear] = React.useState('2023');

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    const filteredRows = initialData.filter(row => 
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
    return rows.map(row => ({
      disco: row.genco,
      'MYTO Allocation (%)': row[`${selectedYear}_MYTO`],
      'Actual Load Allocation (%)': row[`${selectedYear}_Actual`]
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
      background: 'transparent', // Ensure background matches theme
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: true,
        distributed: false, // Use different colors for each bar
        dataLabels: {
          position: 'right'
        },
        barHeight: '70%',
      },
    },
    colors: [theme.palette.primary.main, theme.palette.secondary.main], // Use primary and secondary colors
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
        colors: [theme.palette.text.primary] // Ensure data labels are visible
      }
    },
    xaxis: {
      categories: chartData.map(item => item.disco),
      labels: {
        style: {
          colors: [theme.palette.text.primary], // Ensure x-axis labels are visible
        },
        formatter: (val) => `${val}%` // Show percentage on x-axis labels
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: [theme.palette.text.primary], // Ensure y-axis labels are visible
        }
      }
    },
    title: {
      text: `MYTO Allocation vs Actual Load Allocation - ${selectedYear}`,
      align: 'center',
      style: {
        color: theme.palette.text.primary // Ensure title is visible
      }
    },
    tooltip: {
      theme: 'dark', // Ensure tooltip is styled for dark mode
      y: {
        formatter: function (val) {
          return `${val.toFixed(1)}%`;
        }
      },
      style: {
        color: theme.palette.text.primary, // Tooltip text color
      },
      background: theme.palette.background.paper, // Tooltip background color
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

  // Compute Average for each column
  const averages = fields.reduce((acc, field) => {
    acc[`${field}_MYTO`] = (rows.reduce((sum, row) => sum + (row[`${field}_MYTO`] || 0), 0) / rows.length).toFixed(1);
    acc[`${field}_Actual`] = (rows.reduce((sum, row) => sum + (row[`${field}_Actual`] || 0), 0) / rows.length).toFixed(1);
    return acc;
  }, {});

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2, p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Load Offtake by Discos</Typography>
          <Box>
            <FormControlLabel
              control={<Switch checked={compareMode} onChange={handleCompareToggle} />}
              label="Compare Mode"
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
                        {(
                          fields.reduce((sum, year) => sum + (row[`${year}_MYTO`] || 0) + (row[`${year}_Actual`] || 0), 0) / (fields.length * 2)
                        ).toFixed(1)}%
                      </TableCell>
                      {fields.map(year => (
                        <TableCell align="right" key={year} sx={{ p: 1 }}>
                          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography sx={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>
                              {row[`${year}_MYTO`].toFixed(1)}%
                            </Typography>
                            <Box sx={{ height: 1, bgcolor: 'divider', my: 0.5 }} />
                            <Typography sx={{ color: theme.palette.secondary.main, fontWeight: 'bold' }}>
                              {row[`${year}_Actual`].toFixed(1)}%
                            </Typography>
                          </Box>
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={fields.length + 3} />
                  </TableRow>
                )}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={2} align="right">Average</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold', bgcolor: 'primary.light' }}>
                    {(Object.values(averages).reduce((sum, value) => sum + parseFloat(value), 0) / (fields.length * 2)).toFixed(1)}%
                  </TableCell>
                  {fields.map(year => (
                    <TableCell align="right" key={year} sx={{ p: 1 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography sx={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>
                          {averages[`${year}_MYTO`]}%
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