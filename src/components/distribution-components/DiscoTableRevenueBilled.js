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
  MenuItem
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { useTheme } from '@mui/material/styles';
import { IconSearch, IconFilter } from '@tabler/icons';
import ReactApexChart from 'react-apexcharts';

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

const initialData = [
  { genco: 'Abuja', "2023": 450, "2022": 300, "2021": 250, "2020": 500, "2019": 400, "2018": 350, "2017": 300, img: AbujaLogo },
  { genco: 'Benin', "2023": 500, "2022": 400, "2021": 300, "2020": 450, "2019": 350, "2018": 300, "2017": 250, img: BeninLogo },
  { genco: 'Eko', "2023": 220, "2022": 260, "2021": 240, "2020": 320, "2019": 380, "2018": 300, "2017": 290, img: EkoLogo },
  { genco: 'Enugu', "2023": 470, "2022": 310, "2021": 220, "2020": 410, "2019": 280, "2018": 250, "2017": 390, img: EnuguLogo },
  { genco: 'Ibadan', "2023": 360, "2022": 470, "2021": 490, "2020": 380, "2019": 330, "2018": 410, "2017": 290, img: IbadanLogo },
  { genco: 'Ikeja', "2023": 340, "2022": 470, "2021": 390, "2020": 300, "2019": 440, "2018": 350, "2017": 320, img: IkejaLogo },
  { genco: 'Jos', "2023": 480, "2022": 330, "2021": 400, "2020": 290, "2019": 380, "2018": 370, "2017": 280, img: JosLogo },
  { genco: 'Kaduna', "2023": 390, "2022": 410, "2021": 450, "2020": 470, "2019": 300, "2018": 330, "2017": 350, img: KadunaLogo },
  { genco: 'Kano', "2023": 410, "2022": 370, "2021": 320, "2020": 490, "2019": 270, "2018": 290, "2017": 420, img: KanoLogo },
  { genco: 'Portharcourt', "2023": 340, "2022": 450, "2021": 380, "2020": 410, "2019": 470, "2018": 360, "2017": 300, img: PortharcourtLogo },
  { genco: 'Yola', "2023": 380, "2022": 330, "2021": 410, "2020": 420, "2019": 370, "2018": 280, "2017": 290, img: YolaLogo },
];

const fields = ["2023", "2022", "2021", "2020", "2019", "2018", "2017"];

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

const DiscoTableRevenueBilled = () => {
  const theme = useTheme();
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('total');
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
    setSearch(event.target.value);
  };

  const handleCompareToggle = () => {
    setCompareMode(!compareMode);
  };

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  const chartData = React.useMemo(() => {
    return rows
      .map(row => ({
        disco: row.genco,
        value: row[selectedYear]
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
      background: 'transparent', // Ensure background matches theme
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: true,
        distributed: false, // Use single color for all bars
        dataLabels: {
          position: 'right'
        },
        barHeight: '70%',
      },
    },
    colors: [theme.palette.primary.main], // Single color for bars
    dataLabels: {
      enabled: true,
      textAnchor: 'start',
      formatter: function (val, opt) {
        return formatValue(val);
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
        }
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
      text: `DisCo Revenue Billed - ${selectedYear}`,
      align: 'center',
      style: {
        color: theme.palette.text.primary // Ensure title is visible
      }
    },
    tooltip: {
      theme: 'dark', // Ensure tooltip is styled for dark mode
      y: {
        formatter: function (val) {
          return formatValue(val);
        }
      },
      style: {
        color: theme.palette.text.primary, // Tooltip text color
      },
      background: theme.palette.background.paper, // Tooltip background color
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
    if (value >= 1000) {
      return `₦${(value / 1000).toFixed(1)}T`;
    } else {
      return `₦${value.toFixed(1)}B`;
    }
  };

  // Compute totals for each column
  const totals = fields.reduce((acc, field) => {
    acc[field] = rows.reduce((sum, row) => sum + (row[field] || 0), 0);
    return acc;
  }, {});

  totals.total = Object.values(totals).reduce((sum, current) => sum + current, 0);

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2, p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">DisCo Revenue Billed</Typography>
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
                        {formatValue(fields.reduce((sum, year) => sum + (row[year] || 0), 0))}
                      </TableCell>
                      {fields.map(year => (
                        <TableCell align="right" key={year}>{formatValue(row[year])}</TableCell>
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
                    {formatValue(totals.total)}
                  </TableCell>
                  {fields.map(year => (
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
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(event, newPage) => setPage(newPage)}
            onRowsPerPageChange={(event) => setRowsPerPage(parseInt(event.target.value, 10))}
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default DiscoTableRevenueBilled;
