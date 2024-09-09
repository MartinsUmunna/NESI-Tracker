import * as React from 'react';
import { Box, TextField, Typography, Paper, Switch, Tooltip, IconButton, FormControlLabel, MenuItem, Button, Stack } from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import ReactApexChart from 'react-apexcharts';
import InfoIcon from '@mui/icons-material/Info';


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
  { genco: 'Abuja', "2023 Invoice": 450, "2023 Remittance": 400, "2023 Shortfall": 50, img: AbujaLogo },
  { genco: 'Benin', "2023 Invoice": 500, "2023 Remittance": 450, "2023 Shortfall": 50, img: BeninLogo },
  { genco: 'Eko', "2023 Invoice": 220, "2023 Remittance": 180, "2023 Shortfall": 40, img: EkoLogo },
  { genco: 'Enugu', "2023 Invoice": 470, "2023 Remittance": 410, "2023 Shortfall": 60, img: EnuguLogo },
  { genco: 'Ibadan', "2023 Invoice": 360, "2023 Remittance": 320, "2023 Shortfall": 40, img: IbadanLogo },
  { genco: 'Ikeja', "2023 Invoice": 340, "2023 Remittance": 300, "2023 Shortfall": 40, img: IkejaLogo },
  { genco: 'Jos', "2023 Invoice": 480, "2023 Remittance": 430, "2023 Shortfall": 50, img: JosLogo },
  { genco: 'Kaduna', "2023 Invoice": 390, "2023 Remittance": 340, "2023 Shortfall": 50, img: KadunaLogo },
  { genco: 'Kano', "2023 Invoice": 410, "2023 Remittance": 360, "2023 Shortfall": 50, img: KanoLogo },
  { genco: 'Portharcourt', "2023 Invoice": 340, "2023 Remittance": 300, "2023 Shortfall": 40, img: PortharcourtLogo },
  { genco: 'Yola', "2023 Invoice": 380, "2023 Remittance": 340, "2023 Shortfall": 40, img: YolaLogo },

  //2022
  { genco: 'Abuja', "2022 Invoice": 430, "2022 Remittance": 380, "2022 Shortfall": 50, img: AbujaLogo },
  { genco: 'Benin', "2022 Invoice": 490, "2022 Remittance": 440, "2022 Shortfall": 50, img: BeninLogo },
  { genco: 'Eko', "2022 Invoice": 210, "2022 Remittance": 170, "2022 Shortfall": 40, img: EkoLogo },
  { genco: 'Enugu', "2022 Invoice": 450, "2022 Remittance": 400, "2022 Shortfall": 50, img: EnuguLogo },
  { genco: 'Ibadan', "2022 Invoice": 350, "2022 Remittance": 310, "2022 Shortfall": 40, img: IbadanLogo },
  { genco: 'Ikeja', "2022 Invoice": 330, "2022 Remittance": 290, "2022 Shortfall": 40, img: IkejaLogo },
  { genco: 'Jos', "2022 Invoice": 460, "2022 Remittance": 410, "2022 Shortfall": 50, img: JosLogo },
  { genco: 'Kaduna', "2022 Invoice": 370, "2022 Remittance": 320, "2022 Shortfall": 50, img: KadunaLogo },
  { genco: 'Kano', "2022 Invoice": 400, "2022 Remittance": 350, "2022 Shortfall": 50, img: KanoLogo },
  { genco: 'Portharcourt', "2022 Invoice": 330, "2022 Remittance": 290, "2022 Shortfall": 40, img: PortharcourtLogo },
  { genco: 'Yola', "2022 Invoice": 370, "2022 Remittance": 330, "2022 Shortfall": 40, img: YolaLogo },

  //2021 Data
  { genco: 'Abuja', "2021 Invoice": 420, "2021 Remittance": 370, "2021 Shortfall": 50, img: AbujaLogo },
  { genco: 'Benin', "2021 Invoice": 480, "2021 Remittance": 430, "2021 Shortfall": 50, img: BeninLogo },
  { genco: 'Eko', "2021 Invoice": 200, "2021 Remittance": 160, "2021 Shortfall": 40, img: EkoLogo },
  { genco: 'Enugu', "2021 Invoice": 440, "2021 Remittance": 390, "2021 Shortfall": 50, img: EnuguLogo },
  { genco: 'Ibadan', "2021 Invoice": 340, "2021 Remittance": 300, "2021 Shortfall": 40, img: IbadanLogo },
  { genco: 'Ikeja', "2021 Invoice": 320, "2021 Remittance": 280, "2021 Shortfall": 40, img: IkejaLogo },
  { genco: 'Jos', "2021 Invoice": 450, "2021 Remittance": 400, "2021 Shortfall": 50, img: JosLogo },
  { genco: 'Kaduna', "2021 Invoice": 360, "2021 Remittance": 310, "2021 Shortfall": 50, img: KadunaLogo },
  { genco: 'Kano', "2021 Invoice": 390, "2021 Remittance": 340, "2021 Shortfall": 50, img: KanoLogo },
  { genco: 'Portharcourt', "2021 Invoice": 320, "2021 Remittance": 280, "2021 Shortfall": 40, img: PortharcourtLogo },
  { genco: 'Yola', "2021 Invoice": 360, "2021 Remittance": 320, "2021 Shortfall": 40, img: YolaLogo },

  // 2020 Data
  { genco: 'Abuja', "2020 Invoice": 410, "2020 Remittance": 360, "2020 Shortfall": 50, img: AbujaLogo },
  { genco: 'Benin', "2020 Invoice": 470, "2020 Remittance": 420, "2020 Shortfall": 50, img: BeninLogo },
  { genco: 'Eko', "2020 Invoice": 190, "2020 Remittance": 150, "2020 Shortfall": 40, img: EkoLogo },
  { genco: 'Enugu', "2020 Invoice": 430, "2020 Remittance": 380, "2020 Shortfall": 50, img: EnuguLogo },
  { genco: 'Ibadan', "2020 Invoice": 330, "2020 Remittance": 290, "2020 Shortfall": 40, img: IbadanLogo },
  { genco: 'Ikeja', "2020 Invoice": 310, "2020 Remittance": 270, "2020 Shortfall": 40, img: IkejaLogo },
  { genco: 'Jos', "2020 Invoice": 440, "2020 Remittance": 390, "2020 Shortfall": 50, img: JosLogo },
  { genco: 'Kaduna', "2020 Invoice": 350, "2020 Remittance": 300, "2020 Shortfall": 50, img: KadunaLogo },
  { genco: 'Kano', "2020 Invoice": 380, "2020 Remittance": 330, "2020 Shortfall": 50, img: KanoLogo },
  { genco: 'Portharcourt', "2020 Invoice": 310, "2020 Remittance": 270, "2020 Shortfall": 40, img: PortharcourtLogo },
  { genco: 'Yola', "2020 Invoice": 350, "2020 Remittance": 310, "2020 Shortfall": 40, img: YolaLogo },

  // 2019 Data
  { genco: 'Abuja', "2019 Invoice": 400, "2019 Remittance": 350, "2019 Shortfall": 50, img: AbujaLogo },
  { genco: 'Benin', "2019 Invoice": 460, "2019 Remittance": 410, "2019 Shortfall": 50, img: BeninLogo },
  { genco: 'Eko', "2019 Invoice": 180, "2019 Remittance": 140, "2019 Shortfall": 40, img: EkoLogo },
  { genco: 'Enugu', "2019 Invoice": 420, "2019 Remittance": 370, "2019 Shortfall": 50, img: EnuguLogo },
  { genco: 'Ibadan', "2019 Invoice": 320, "2019 Remittance": 280, "2019 Shortfall": 40, img: IbadanLogo },
  { genco: 'Ikeja', "2019 Invoice": 300, "2019 Remittance": 260, "2019 Shortfall": 40, img: IkejaLogo },
  { genco: 'Jos', "2019 Invoice": 430, "2019 Remittance": 380, "2019 Shortfall": 50, img: JosLogo },
  { genco: 'Kaduna', "2019 Invoice": 340, "2019 Remittance": 290, "2019 Shortfall": 50, img: KadunaLogo },
  { genco: 'Kano', "2019 Invoice": 370, "2019 Remittance": 320, "2019 Shortfall": 50, img: KanoLogo },
  { genco: 'Portharcourt', "2019 Invoice": 300, "2019 Remittance": 260, "2019 Shortfall": 40, img: PortharcourtLogo },
  { genco: 'Yola', "2019 Invoice": 340, "2019 Remittance": 300, "2019 Shortfall": 40, img: YolaLogo },

   // 2018 Data
   { genco: 'Abuja', "2018 Invoice": 390, "2018 Remittance": 340, "2018 Shortfall": 50, img: AbujaLogo },
   { genco: 'Benin', "2018 Invoice": 450, "2018 Remittance": 400, "2018 Shortfall": 50, img: BeninLogo },
   { genco: 'Eko', "2018 Invoice": 170, "2018 Remittance": 130, "2018 Shortfall": 40, img: EkoLogo },
   { genco: 'Enugu', "2018 Invoice": 410, "2018 Remittance": 360, "2018 Shortfall": 50, img: EnuguLogo },
   { genco: 'Ibadan', "2018 Invoice": 310,   "2018 Remittance": 270, "2018 Shortfall": 40, img: IbadanLogo },
   { genco: 'Ikeja', "2018 Invoice": 290, "2018 Remittance": 250, "2018 Shortfall": 40, img: IkejaLogo },
   { genco: 'Jos', "2018 Invoice": 420, "2018 Remittance": 370, "2018 Shortfall": 50, img: JosLogo },
   { genco: 'Kaduna', "2018 Invoice": 330, "2018 Remittance": 280, "2018 Shortfall": 50, img: KadunaLogo },
   { genco: 'Kano', "2018 Invoice": 360, "2018 Remittance": 310, "2018 Shortfall": 50, img: KanoLogo },
   { genco: 'Portharcourt', "2018 Invoice": 290, "2018 Remittance": 250, "2018 Shortfall": 40, img: PortharcourtLogo },
   { genco: 'Yola', "2018 Invoice": 330, "2018 Remittance": 290, "2018 Shortfall": 40, img: YolaLogo },
 
   // 2017 Data
   { genco: 'Abuja', "2017 Invoice": 380, "2017 Remittance": 330, "2017 Shortfall": 50, img: AbujaLogo },
   { genco: 'Benin', "2017 Invoice": 440, "2017 Remittance": 390, "2017 Shortfall": 50, img: BeninLogo },
   { genco: 'Eko', "2017 Invoice": 160, "2017 Remittance": 120, "2017 Shortfall": 40, img: EkoLogo },
   { genco: 'Enugu', "2017 Invoice": 400, "2017 Remittance": 350, "2017 Shortfall": 50, img: EnuguLogo },
   { genco: 'Ibadan', "2017 Invoice": 300, "2017 Remittance": 260, "2017 Shortfall": 40, img: IbadanLogo },
   { genco: 'Ikeja', "2017 Invoice": 280, "2017 Remittance": 240, "2017 Shortfall": 40, img: IkejaLogo },
   { genco: 'Jos', "2017 Invoice": 410, "2017 Remittance": 360, "2017 Shortfall": 50, img: JosLogo },
   { genco: 'Kaduna', "2017 Invoice": 320, "2017 Remittance": 270, "2017 Shortfall": 50, img: KadunaLogo },
   { genco: 'Kano', "2017 Invoice": 350, "2017 Remittance": 300, "2017 Shortfall": 50, img: KanoLogo },
   { genco: 'Portharcourt', "2017 Invoice": 280, "2017 Remittance": 240, "2017 Shortfall": 40, img: PortharcourtLogo },
   { genco: 'Yola', "2017 Invoice": 320, "2017 Remittance": 280, "2017 Shortfall": 40, img: YolaLogo },
 ];

 const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: 0,
  '&:first-of-type': {
    borderTopLeftRadius: theme.shape.borderRadius,
    borderBottomLeftRadius: theme.shape.borderRadius,
  },
  '&:last-of-type': {
    borderTopRightRadius: theme.shape.borderRadius,
    borderBottomRightRadius: theme.shape.borderRadius,
  },
  '&:not(:first-of-type)': {
    marginLeft: '-1px',
  },
  '&.Mui-selected': {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.getContrastText(theme.palette.secondary.main),
    '&:hover': {
      backgroundColor: theme.palette.secondary.dark,
    },
  },
}));
const fields = ["2023", "2022", "2021", "2020", "2019", "2018", "2017"];

const DiscoTableMarketInvoiceNBET = () => {
  const theme = useTheme();
  const [selectedYear, setSelectedYear] = React.useState('2023');
  const [view, setView] = React.useState('invoice'); // To toggle between charts
  const [compare, setCompare] = React.useState(false); // For the compare toggle switch

  const chartData = React.useMemo(() => {
    return initialData.filter(item => {
      return (
        item[`${selectedYear} Invoice`] !== undefined &&
        item[`${selectedYear} Remittance`] !== undefined
      );
    }).map(item => ({
      disco: item.genco,
      invoice: item[`${selectedYear} Invoice`],
      remittance: item[`${selectedYear} Remittance`],
    }));
  }, [selectedYear]);

  const getChartOptions = (title) => ({
    chart: {
      type: 'bar',
      height: 350,
      toolbar: {
        show: false,
      },
      background: 'transparent',
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: false,
        columnWidth: '40%',
        dataLabels: {
          position: 'top',
        },
      },
    },
    dataLabels: {
      enabled: true,
      offsetX: 0,
      offsetY: -20,
      style: {
        fontSize: '10px',
        colors: [theme.palette.text.primary],
      },
      formatter: (val) => `₦${val}b`,
    },
    xaxis: {
      categories: chartData.map(item => item.disco),
      labels: {
        style: {
          colors: [theme.palette.text.primary],
        },
      },
    },
    yaxis: {
      tickAmount: 5,
      labels: {
        style: {
          colors: [theme.palette.text.primary],
        },
      },
    },
    grid: {
      show: false,
    },
    tooltip: {
      theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
    },
    colors: compare ? [theme.palette.primary.main, theme.palette.secondary.main] : [theme.palette.secondary.main],
    legend: {
      show: compare, // Show legend only when comparing
    },
  });

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  const handleToggleCompare = () => {
    setCompare((prev) => !prev);
    setView('compare');
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
      <Typography variant="h6" align="center" gutterBottom>
        Disco NBET Remittances and Invoice
      </Typography>
      <Stack direction="row">
  <StyledButton
    variant={view === 'invoice' && !compare ? 'contained' : 'outlined'}
    onClick={() => setView('invoice')}
    className={view === 'invoice' ? 'Mui-selected' : ''}
  >
    Disco Invoice
  </StyledButton>
  <StyledButton
    variant={view === 'remittance' && !compare ? 'contained' : 'outlined'}
    onClick={() => setView('remittance')}
    className={view === 'remittance' ? 'Mui-selected' : ''}
  >
    Disco Remittance
  </StyledButton>
</Stack>
        <Stack direction="row" alignItems="center">
          <TextField
            select
            value={selectedYear}
            onChange={handleYearChange}
            label="Select Year"
            variant="outlined"
            size="small"
            sx={{ marginRight: theme.spacing(2) }}
          >
            {fields.map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </TextField>
          <FormControlLabel
            control={
              <Switch
                checked={compare}
                onChange={handleToggleCompare}
                name="compareToggle"
              />
            }
            label="Compare"
            sx={{ marginRight: theme.spacing(2) }}
          />
        </Stack>
      </Stack>

      <ReactApexChart
        options={getChartOptions(view === 'compare' ? 'Compare' : view === 'invoice' ? 'Invoice' : 'Remittance')}
        series={[
          {
            name: view === 'invoice' || view === 'compare' ? 'Invoice' : 'Remittance',
            data: chartData.map(item => view === 'invoice' || view === 'compare' ? item.invoice : item.remittance),
          },
          ...(compare ? [{
            name: 'Remittance',
            data: chartData.map(item => item.remittance),
          }] : [])
        ]}
        type="bar"
        height={350}
      />
    </Box>
  );
};

export default DiscoTableMarketInvoiceNBET;