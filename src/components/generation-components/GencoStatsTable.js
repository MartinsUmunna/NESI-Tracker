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
  { genco: 'AFAM IV&V (GAS)', "2023": 64.3, "2022": 67.5, "2021": 45.9, "2020": 560, "2019": 209, "2018": 350, "2017": 305, img: AfamLogo },
  { genco: 'AFAM VI (GAS/STEAM)', "2023": 305.8, "2022": 400, "2021": 209, "2020": 398, "2019": 355, "2018": 599, "2017": 776, img: AfamLogo },
  { genco: 'ALAOJI NIPP (GAS)',"2023":	161,"2022":	235,"2021":	130,"2020":	443,"2019":	790,"2018":	214,"2017":	780, img: AlaojiLogo },
  { genco:'AZURA-EDO IPP (GAS)',"2023": 299,"2022":	456,"2021":	200,"2020":	224,"2019":	445, "2018":	3450, "2017":	45.9, img: AzuraLogo },
  { genco: 'DADINKOWA G.S (HYDRO)',"2023": 115,"2022":	780,"2021":	350, "2020":	214, "2019":	330, "2018":	776, "2017":	350, img: DadinkowaLogo },
  { genco: 'DELTA (GAS)',"2023": 380, "2022":	599, "2021":	3450, "2020":	2387, "2019":	1002, "2018":	305, "2017":	45.9, img: DeltaGasLogo},
  { genco: 'EGBIN (STEAM)', "2023": 538, "2022": 455, "2021": 6780, "2020": 980, "2019": 776, "2018": 3450, "2017": 400, img: EgbinLogo },
  { genco: 'KAINJI POWER', "2023": 1200, "2022": 1000, "2021": 2389, "2020": 489, "2019": 888, "2018": 909, "2017": 305, img: KainjiLogo },
  { genco: 'GEREGU (GAS)', "2023": 161, "2022": 235, "2021": 130, "2020": 443, "2019": 790, "2018": 214, "2017": 780, img: GereguLogo },
  { genco: 'GEREGU NIPP (GAS)', "2023": 299, "2022": 456, "2021": 200, "2020": 224, "2019": 445, "2018": 3450, "2017": 45.9, img: GereguLogo },
  { genco: 'IBOM POWER (GAS)', "2023": 115, "2022": 780, "2021": 350, "2020": 214, "2019": 330, "2018": 776, "2017": 350, img: IbomLogo },
  { genco: 'IHOVBOR NIPP (GAS)', "2023": 380, "2022": 599, "2021": 3450, "2020": 2387, "2019": 1002, "2018": 305, "2017": 45.9, img: AlaojiLogo },
  { genco: 'KAINJI (HYDRO)', "2023": 538, "2022": 455, "2021": 6780, "2020": 980, "2019": 776, "2018": 3450, "2017": 400, img: KainjiLogo },
  { genco: 'ODUKPANI NIPP (GAS)', "2023": 1200, "2022": 1000, "2021": 2389, "2020": 489, "2019": 888, "2018": 909, "2017": 305, img: AlaojiLogo },
  { genco: 'OKPAI (GAS/STEAM)', "2023": 64.3, "2022": 67.5, "2021": 45.9, "2020": 560, "2019": 209, "2018": 350, "2017": 305, img: AlaojiLogo },
  { genco: 'OLORUNSOGO (GAS)', "2023": 305.8, "2022": 400, "2021": 209, "2020": 398, "2019": 355, "2018": 599, "2017": 776, img: OlorunsogoLogo },
  { genco: 'OLORUNSOGO NIPP (GAS)', "2023": 161, "2022": 235, "2021": 130, "2020": 443, "2019": 790, "2018": 214, "2017": 780, img: OlorunsogoLogo },
  { genco: 'OMOKU (GAS)', "2023": 299, "2022": 456, "2021": 200, "2020": 224, "2019": 445, "2018": 3450, "2017": 45.9, img: AlaojiLogo },
  { genco: 'OMOTOSHO (GAS)', "2023": 115, "2022": 780, "2021": 350, "2020": 214, "2019": 330, "2018": 776, "2017": 350, img: AlaojiLogo },
  { genco: 'OMOTOSHO NIPP (GAS)', "2023": 380, "2022": 599, "2021": 3450, "2020": 2387, "2019": 1002, "2018": 305, "2017": 45.9, img: AlaojiLogo },
  { genco: 'PARAS ENERGY (GAS)', "2023": 538, "2022": 455, "2021": 6780, "2020": 980, "2019": 776, "2018": 3450, "2017": 400, img: ParasLogo },
  { genco: 'RIVERS IPP (GAS)', "2023": 1200, "2022": 1000, "2021": 2389, "2020": 489, "2019": 888, "2018": 909, "2017": 305, img: RiversLogo },
  { genco: 'SAPELE (STEAM)', "2023": 161, "2022": 235, "2021": 130, "2020": 443, "2019": 790, "2018": 214, "2017": 780, img: SapeleLogo },
  { genco: 'SAPELE NIPP (GAS)', "2023": 299, "2022": 456, "2021": 200, "2020": 224, "2019": 445, "2018": 3450, "2017": 45.9, img: SapeleLogo },
  { genco: 'SHIRORO (HYDRO)', "2023": 115, "2022": 780, "2021": 350, "2020": 214, "2019": 330, "2018": 776, "2017": 350, img: AlaojiLogo },
  { genco: 'TRANS-AMADI (GAS)', "2023": 380, "2022": 599, "2021": 3450, "2020": 2387, "2019": 1002, "2018": 305, "2017": 45.9, img: AlaojiLogo }
  // Include other gencos here...
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

const GencoStatsTable = () => {
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('total');
  const [rows, setRows] = React.useState(initialData);
  const [search, setSearch] = React.useState('');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [dense, setDense] = React.useState(false);

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
  const formatNumber = (num) => {
    return Math.round(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
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
        <Typography variant="h6">Genco Energy Generated</Typography>
        <IconButton>
          <IconFilter size="1.2rem" />
        </IconButton>
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
                    {formatNumber(fields.reduce((sum, year) => sum + (row[year] || 0), 0).toFixed(1))}
                  </TableCell>
                  {fields.map(year => (
                    <TableCell align="right" key={year}>{formatNumber(row[year])}</TableCell>
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
              <TableCell align="right" sx={{ fontWeight: 'bold', bgcolor: 'primary.light' }}>{formatNumber(totals.total.toFixed(1))}</TableCell>
              {fields.map(year => (
                <TableCell align="right" key={year} sx={{ fontWeight: 'bold', bgcolor: 'primary.light' }}>{formatNumber(totals[year].toFixed(1))}</TableCell>
              ))}
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
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

export default GencoStatsTable;