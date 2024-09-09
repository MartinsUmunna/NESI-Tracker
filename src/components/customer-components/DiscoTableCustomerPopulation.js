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
  Checkbox,
  TableFooter,
  Avatar,
  InputAdornment,
  Switch,
  FormControlLabel,
  Button,
  ButtonGroup,
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { IconSearch } from '@tabler/icons';

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

// Group data by genco and sum metered/unmetered values
const groupedData = [
  {
    genco: 'Abuja',
    img: AbujaLogo,
    metered: { "2023": 450, "2022": 300, "2021": 250, "2020": 500, "2019": 400, "2018": 350, "2017": 300 },
    unmetered: { "2023": 400, "2022": 250, "2021": 300, "2020": 450, "2019": 350, "2018": 300, "2017": 250 },
  },
  {
    genco: 'Benin',
    img: BeninLogo,
    metered: { "2023": 500, "2022": 400, "2021": 300, "2020": 450, "2019": 350, "2018": 300, "2017": 250 },
    unmetered: { "2023": 450, "2022": 350, "2021": 250, "2020": 400, "2019": 300, "2018": 250, "2017": 200 },
  },
  {
    genco: 'Eko',
    img: EkoLogo,
    metered: { "2023": 220, "2022": 260, "2021": 240, "2020": 320, "2019": 380, "2018": 300, "2017": 290 },
    unmetered: { "2023": 200, "2022": 250, "2021": 230, "2020": 310, "2019": 370, "2018": 290, "2017": 280 },
  },
  {
    genco: 'Enugu',
    img: EnuguLogo,
    metered: { "2023": 470, "2022": 310, "2021": 220, "2020": 410, "2019": 280, "2018": 250, "2017": 390 },
    unmetered: { "2023": 420, "2022": 260, "2021": 170, "2020": 360, "2019": 230, "2018": 200, "2017": 340 },
  },
  {
    genco: 'Ibadan',
    img: IbadanLogo,
    metered: { "2023": 360, "2022": 470, "2021": 490, "2020": 380, "2019": 330, "2018": 410, "2017": 290 },
    unmetered: { "2023": 320, "2022": 420, "2021": 440, "2020": 330, "2019": 280, "2018": 360, "2017": 240 },
  },
  {
    genco: 'Ikeja',
    img: IkejaLogo,
    metered: { "2023": 340, "2022": 470, "2021": 390, "2020": 300, "2019": 440, "2018": 350, "2017": 320 },
    unmetered: { "2023": 300, "2022": 420, "2021": 340, "2020": 250, "2019": 390, "2018": 300, "2017": 270 },
  },
  {
    genco: 'Jos',
    img: JosLogo,
    metered: { "2023": 480, "2022": 330, "2021": 400, "2020": 290, "2019": 380, "2018": 370, "2017": 280 },
    unmetered: { "2023": 430, "2022": 280, "2021": 350, "2020": 240, "2019": 330, "2018": 320, "2017": 230 },
  },
  {
    genco: 'Kaduna',
    img: KadunaLogo,
    metered: { "2023": 390, "2022": 410, "2021": 450, "2020": 470, "2019": 300, "2018": 330, "2017": 350 },
    unmetered: { "2023": 350, "2022": 360, "2021": 400, "2020": 420, "2019": 250, "2018": 280, "2017": 300 },
  },
  {
    genco: 'Kano',
    img: KanoLogo,
    metered: { "2023": 410, "2022": 370, "2021": 320, "2020": 490, "2019": 270, "2018": 290, "2017": 420 },
    unmetered: { "2023": 370, "2022": 320, "2021": 270, "2020": 440, "2019": 220, "2018": 240, "2017": 370 },
  },
  {
    genco: 'Portharcourt',
    img: PortharcourtLogo,
    metered: { "2023": 340, "2022": 450, "2021": 380, "2020": 410, "2019": 470, "2018": 360, "2017": 300 },
    unmetered: { "2023": 300, "2022": 400, "2021": 330, "2020": 360, "2019": 420, "2018": 310, "2017": 250 },
  },
  {
    genco: 'Yola',
    img: YolaLogo,
    metered: { "2023": 380, "2022": 330, "2021": 410, "2020": 420, "2019": 370, "2018": 280, "2017": 290 },
    unmetered: { "2023": 340, "2022": 280, "2021": 360, "2020": 370, "2019": 320, "2018": 230, "2017": 240 },
  },
];


const fields = ["2023", "2022", "2021", "2020", "2019", "2018", "2017"];

const formatNumber = (number) => {
  return new Intl.NumberFormat().format(number);
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
        <TableCell>DisCo</TableCell>
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

const DiscoTableCustomerPopulation = () => {
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('total');
  const [rows, setRows] = React.useState([]);
  const [search, setSearch] = React.useState('');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [dense, setDense] = React.useState(false);
  const [selectedType, setSelectedType] = React.useState('Total');

  React.useEffect(() => {
    const combinedRows = groupedData.map(row => {
      const combined = {};
      fields.forEach(year => {
        combined[year] = (row.metered[year] || 0) + (row.unmetered[year] || 0);
      });
      return {
        genco: row.genco,
        img: row.img,
        ...combined,
      };
    });
    setRows(combinedRows);  // Show combined data on initial load
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
  

  const handleFilterClick = (type) => {
    setSelectedType(type);

    
    if (type === 'Total') {
      const combinedRows = groupedData.map(row => {
        const combined = {};
        fields.forEach(year => {
          combined[year] = (row.metered[year] || 0) + (row.unmetered[year] || 0);
        });
        return {
          genco: row.genco,
          img: row.img,
          ...combined,
        };
      });
      setRows(combinedRows);  // Show combined data for "Total"
    } else {
      const filteredRows = groupedData.map(row => ({
        genco: row.genco,
        img: row.img,
        ...row[type.toLowerCase()]
      }));
      setRows(filteredRows);  // Show filtered data for "Metered" or "Unmetered"
    }
  };
  

  const totals = fields.reduce((acc, field) => {
    acc[field] = rows.reduce((sum, row) => sum + (row[field] || 0), 0);
    return acc;
  }, {});

  totals.total = Object.values(totals).reduce((sum, current) => sum + current, 0);

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2, p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Disco Customer Population</Typography>
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
                <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
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
