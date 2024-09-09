import React from 'react';
import { Box, Avatar, Typography, Card, CardContent, Grid, Divider, Stack, MenuItem } from '@mui/material';
import { IconArrowUpRight, IconArrowDownLeft } from '@tabler/icons';
import CustomSelect from '../../forms/theme-elements/CustomSelect';
import welcomeImg from 'src/assets/images/backgrounds/overveiw-bg.svg';
import userImg from 'src/assets/images/profile/user-1.jpg';

const OpexBreakdownFinancialBBD = () => {
  const [month, setMonth] = React.useState('1');

  const handleChange = (event) => {
    setMonth(event.target.value);
  };
  return (
    <Card elevation={0} sx={{ backgroundColor: '#f2f5f6', py: 0, boxShadow: 'rgb(145 158 171 / 30%) 0px 0px 2px 0px,rgb(145 158 171 / 12%) 0px 12px 24px -4px',}}>
      <CardContent sx={{ py: 2, px: 2 }}>
        <Grid container justifyContent="space-between">
          <Grid item xs={12} sm={12} display="flex" alignItems="center" textAlign="center">
            <Box width="100%">
                <Typography gap="16px" mb={8} mt={3} justifyContent="center" variant="h4" whiteSpace="nowrap">
                  Opex Breakdown
                </Typography>

                <Stack spacing={2} justifyContent="space-between" direction="row" divider={<Divider sx={{ borderColor: "#959697" }} orientation="vertical" flexItem   />}>
                    <Box>
                        <Typography variant="h2" whiteSpace="nowrap">₦1.5B <span><IconArrowUpRight width={18} color="#39B69A" /></span></Typography>
                        <Typography mt={2} variant="subtitle1" whiteSpace="nowrap">Administrative Expenses</Typography>
                    </Box>
                    <Box>
                        <Typography variant="h2" whiteSpace="nowrap">₦5.7B <span><IconArrowDownLeft width={18} color="#b63939" /></span></Typography>
                        <Typography mt={2} variant="subtitle1" whiteSpace="nowrap">Collection Losses</Typography>
                    </Box>
                    
                    <Box>
                        <Typography variant="h2" whiteSpace="nowrap">₦750M <span><IconArrowUpRight width={18} color="#39B69A" /></span></Typography>
                        <Typography mt={2} variant="subtitle1" whiteSpace="nowrap">General Repairs</Typography>
                    </Box>
                    <Box>
                        <Typography variant="h2" whiteSpace="nowrap">₦405M <span><IconArrowDownLeft width={18} color="#b63939" /></span></Typography>
                        <Typography mt={2} variant="subtitle1" whiteSpace="nowrap">Customer Related</Typography>
                    </Box>
                    <Box>
                        <Typography variant="h2" whiteSpace="nowrap">600M <span><IconArrowDownLeft width={18} color="#b63939" /></span></Typography>
                        <Typography mt={2} variant="subtitle1" whiteSpace="nowrap">Salaries</Typography>
                    </Box>
                </Stack>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default OpexBreakdownFinancialBBD;
