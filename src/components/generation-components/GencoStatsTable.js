import React, { useEffect, useState } from 'react';
import axios from 'axios';
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
  TableFooter,
  Avatar,
  InputAdornment,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { IconSearch, IconFilter } from '@tabler/icons';
import API_URL from '../../config/apiconfig';

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
import DefaultLogo from 'src/assets/images/Genco_Logos/Default_logo.jpg';

const logoMapping = {
  "AFAM IV": AfamLogo,
  "AFAM VI": AfamLogo,
  "AFAM IVV": AfamLogo,
  "ALAOJI NIPP": AlaojiLogo,
  "AZURAEDO": AzuraLogo,
  "ASCO": DefaultLogo,
  "DADIN KOWA": DadinkowaLogo,
  "DELTA": DeltaGasLogo,
  "EGBIN": EgbinLogo,
  "GBARAIN": DefaultLogo,
  "GEREGU": GereguLogo,
  "GEREGU NIPP": GereguLogo,
  "IBOM POWER": IbomLogo,
  "IHOVBOR NIPP": AlaojiLogo,
  "JEBBA": DefaultLogo,
  "KAINJI": KainjiLogo,
  "ODUKPANI": AlaojiLogo,
  "OKPAI": DefaultLogo,
  "OLORUNSOGO": OlorunsogoLogo,
  "OLORUNSOGO NIPP": OlorunsogoLogo,
  "OMOKU": DefaultLogo,
  "OMOTOSHO": DefaultLogo,
  "OMOTOSHO NIPP": DefaultLogo,
  "PARAS ENERGY": ParasLogo,
  "RIVERS IPP": RiversLogo,
  "SAPELE": SapeleLogo,
  "SAPELE NIPP": SapeleLogo,
  "SHIRORO": DefaultLogo,
  "TRANS AMADI": DefaultLogo,
};



function descendingComparator(a, b, orderBy) {
  if (!isNaN(orderBy)) { // If the orderBy is a number (a year)
    return b[orderBy] - a[orderBy]; // Numerical comparison
  }

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
  const { order, orderBy, onRequestSort, fields } = props;
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

EnhancedTableHead.propTypes = {
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  fields: PropTypes.array.isRequired,
};

const GencoStatsTable = () => {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('total'); 
  const [rows, setRows] = useState([]);
  const [fields, setFields] = useState([]); 
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [dense, setDense] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/genco-energy-generated`);
        
        // Process data to get unique years
        const yearsSet = new Set();
        const processedData = response.data.reduce((acc, item) => {
          const genco = item.Genco;
          const year = item.Year.toString();
          const energyGenerated = item.EnergyGenerated;

          yearsSet.add(year);

          if (!acc[genco]) {
            acc[genco] = { genco, img: logoMapping[genco] || DefaultLogo };
          }
          acc[genco][year] = energyGenerated;
          return acc;
        }, {});

        setRows(Object.values(processedData));
        setFields(Array.from(yearsSet).sort((a, b) => b - a)); 
      } catch (error) {
        console.error('Error fetching data:', error);
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
    const filteredRows = rows.filter(row => 
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
          <Typography variant="h6">Genco Energy Generated (MWh)</Typography>
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
              fields={fields} // Pass dynamic fields to EnhancedTableHead
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
                      <TableCell align="right" key={year}>{formatNumber(row[year] || 0)}</TableCell>
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
