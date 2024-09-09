import React, { useState, useMemo } from 'react';
import ReactApexChart from 'react-apexcharts';
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

const initialData = [
  { genco: 'AFAM IV&V (GAS)', "2023": 64, "2022": 68, "2021": 46, "2020": 130, "2019": 120, "2018": 150, "2017": 140, img: AfamLogo },
  { genco: 'AFAM VI (GAS/STEAM)', "2023": 140, "2022": 150, "2021": 120, "2020": 160, "2019": 150, "2018": 170, "2017": 130, img: AfamLogo },
  { genco: 'ALAOJI NIPP (GAS)',"2023": 161, "2022": 120, "2021": 130, "2020": 143, "2019": 110, "2018": 150, "2017": 120, img: AlaojiLogo },
  { genco:'AZURA-EDO IPP (GAS)',"2023": 120, "2022": 160, "2021": 100, "2020": 124, "2019": 140, "2018": 170, "2017": 46, img: AzuraLogo },
  { genco: 'DADINKOWA G.S (HYDRO)',"2023": 115, "2022": 130, "2021": 100, "2020": 114, "2019": 120, "2018": 130, "2017": 150, img: DadinkowaLogo },
  { genco: 'DELTA (GAS)',"2023": 130, "2022": 120, "2021": 160, "2020": 150, "2019": 102, "2018": 130, "2017": 46, img: DeltaGasLogo},
  { genco: 'EGBIN (STEAM)', "2023": 120, "2022": 145, "2021": 150, "2020": 150, "2019": 130, "2018": 160, "2017": 100, img: EgbinLogo },
  { genco: 'KAINJI POWER', "2023": 120, "2022": 160, "2021": 150, "2020": 89, "2019": 110, "2018": 109, "2017": 105, img: KainjiLogo },
  { genco: 'GEREGU (GAS)', "2023": 100, "2022": 135, "2021": 130, "2020": 143, "2019": 110, "2018": 114, "2017": 110, img: GereguLogo },
  { genco: 'GEREGU NIPP (GAS)', "2023": 99, "2022": 126, "2021": 100, "2020": 124, "2019": 145, "2018": 150, "2017": 46, img: GereguLogo },
  { genco: 'IBOM POWER (GAS)', "2023": 105, "2022": 130, "2021": 120, "2020": 114, "2019": 130, "2018": 126, "2017": 110, img: IbomLogo },
  { genco: 'IHOVBOR NIPP (GAS)', "2023": 120, "2022": 130, "2021": 160, "2020": 150, "2019": 102, "2018": 130, "2017": 46, img: AlaojiLogo },
  { genco: 'KAINJI (HYDRO)', "2023": 110, "2022": 145, "2021": 150, "2020": 100, "2019": 130, "2018": 160, "2017": 100, img: KainjiLogo },
  { genco: 'ODUKPANI NIPP (GAS)', "2023": 120, "2022": 160, "2021": 150, "2020": 89, "2019": 110, "2018": 109, "2017": 105, img: AlaojiLogo },
  { genco: 'OKPAI (GAS/STEAM)', "2023": 64, "2022": 68, "2021": 46, "2020": 130, "2019": 120, "2018": 150, "2017": 140, img: AlaojiLogo },
  { genco: 'OLORUNSOGO (GAS)', "2023": 105, "2022": 140, "2021": 100, "2020": 120, "2019": 105, "2018": 160, "2017": 126, img: OlorunsogoLogo },
  { genco: 'OLORUNSOGO NIPP (GAS)', "2023": 101, "2022": 135, "2021": 130, "2020": 143, "2019": 110, "2018": 114, "2017": 110, img: OlorunsogoLogo },
  { genco: 'OMOKU (GAS)', "2023": 99, "2022": 126, "2021": 100, "2020": 124, "2019": 145, "2018": 150, "2017": 46, img: AlaojiLogo },
  { genco: 'OMOTOSHO (GAS)', "2023": 105, "2022": 130, "2021": 120, "2020": 114, "2019": 130, "2018": 126, "2017": 110, img: AlaojiLogo },
  { genco: 'OMOTOSHO NIPP (GAS)', "2023": 120, "2022": 130, "2021": 160, "2020": 150, "2019": 102, "2018": 130, "2017": 46, img: AlaojiLogo },
  { genco: 'PARAS ENERGY (GAS)', "2023": 110, "2022": 145, "2021": 150, "2020": 100, "2019": 130, "2018": 160, "2017": 100, img: ParasLogo },
  { genco: 'RIVERS IPP (GAS)', "2023": 120, "2022": 160, "2021": 150, "2020": 89, "2019": 110, "2018": 109, "2017": 105, img: RiversLogo },
  { genco: 'SAPELE (STEAM)', "2023": 101, "2022": 135, "2021": 130, "2020": 143, "2019": 110, "2018": 114, "2017": 110, img: SapeleLogo },
  { genco: 'SAPELE NIPP (GAS)', "2023": 99, "2022": 126, "2021": 100, "2020": 124, "2019": 145, "2018": 150, "2017": 46, img: SapeleLogo },
  { genco: 'SHIRORO (HYDRO)', "2023": 105, "2022": 130, "2021": 120, "2020": 114, "2019": 130, "2018": 126, "2017": 110, img: AlaojiLogo },
  { genco: 'TRANS-AMADI (GAS)', "2023": 120, "2022": 130, "2021": 160, "2020": 150, "2019": 102, "2018": 130, "2017": 46, img: AlaojiLogo }
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
        <TableCell padding="checkbox">
          {/* Checkbox removed */}
        </TableCell>
        <TableCell>Genco</TableCell>
        <TableCell align="right">Total</TableCell>
        {fields.map((headCell) => (
          <TableCell
            key={headCell}
            align="right"
            sortDirection={orderBy === headCell ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell}
              direction={orderBy === headCell ? order : 'asc'}
              onClick={createSortHandler(headCell)}
            >
              {headCell}
              {orderBy === headCell ? (
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
  if (value >= 1e12) {
    return `₦${(Math.round(value / 1e9))}tn`;
  } else if (value >= 1e9) {
    return `₦${Math.round(value / 1e9)}bn`;
  } else if (value >= 1e6) {
    return `₦${Math.round(value / 1e6)}m`;
  } else {
    return `₦${Math.round(value)}bn`;
  }
};

const formatTotalValue = (value) => {
  // Convert the value to billions for consistency
  const valueInBillions = value / 1e9;
  
  if (valueInBillions >= 1000) {
    // If it's 1000 billion or more, format as trillions
    return `₦${(valueInBillions / 1000).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}t`;
  } else {
    // Otherwise, format as billions
    return `₦${valueInBillions.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}bn`;
  }
};

const NBETInvoicetoGencoTable = () => {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('total');
  const [rows, setRows] = useState(initialData);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [dense, setDense] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const [selectedYear, setSelectedYear] = useState('2023');

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

  const chartData = useMemo(() => {
    return rows
      .map(row => ({
        genco: row.genco,
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
      foreColor: 'var(--text-color)', // Use CSS variable for text color
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
        colors: ['var(--text-color)'] // Use CSS variable for text color
      },
      formatter: function (val, opt) {
        return formatValue(val);
      },
      offsetX: 5,
      dropShadow: {
        enabled: false
      }
    },
    colors: ['#060688'],
    xaxis: {
      categories: chartData.map(item => item.genco),
      labels: {
        style: {
          colors: 'var(--text-color)' // Use CSS variable for text color
        }
      }
    },
    yaxis: {
      labels: {
        show: true,
        style: {
          colors: 'var(--text-color)' // Use CSS variable for text color
        }
      }
    },
    title: {
      text: `Genco Invoice to NBET - ${selectedYear}`,
      align: 'center',
      style: {
        fontSize: '18px',
        color: 'var(--text-color)' // Use CSS variable for text color
      }
    },
    tooltip: {
      theme: 'var(--theme-mode)', // Use CSS variable for theme mode
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
          <Typography variant="h6">NBET Payment to Genco</Typography>
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
      {formatTotalValue(totals.total)}
    </TableCell>
    {fields.map(year => (
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

export default NBETInvoicetoGencoTable;