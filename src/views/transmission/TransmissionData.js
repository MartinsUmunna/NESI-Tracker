import React from 'react';
import { Box, Grid } from '@mui/material';
import YearlyTransmissionLossFactor from "src/components/transmission-components/YearlyTransmissionLossFactor";
import SystemCollapses from "src/components/transmission-components/SystemCollapses";
import EnergyInjectedandDelivered from "src/components/transmission-components/EnergyInjectionandDelivered";
import DiscoInvoicefromNBET_Table  from 'src/components/transmission-components/DiscoInvoicefromNBET_Table';
import DiscoRemittancetoNBET_Table from 'src/components/transmission-components/DiscoRemittancetoNBET_Table'

import WelcomeCard from 'src/components/dashboards/ecommerce/TransmissionWelcomeCard'

import Welcome from 'src/layouts/full/shared/welcome/Welcome';


const Industry = () => {
  return (
    <Box>
      <Grid container spacing={3}>
      
        {/* Welcome Card */}
        <Grid item xs={12}>
            <WelcomeCard />
          </Grid>
        {/* column */}
        <Grid item xs={12}>
            <YearlyTransmissionLossFactor />
          </Grid>
        <Grid item xs={12}>
            <EnergyInjectedandDelivered />
          </Grid>
        <Grid item xs={12}>
            <SystemCollapses />
          </Grid>
        
          <Grid item xs={12}>
            <DiscoInvoicefromNBET_Table />
          </Grid>
          
        {/* column */}
        <Grid item xs={12} >
          <Grid container spacing={3}>
         
        
            
          </Grid>
        </Grid>
        {/* column */}
        
        {/* column */}
        <Grid item xs={12} lg={4}>
          <Grid container spacing={3}>
            
            
           
          </Grid>
        </Grid>
  
      </Grid>
      {/* column */}
      <Welcome />
    </Box>
  );
};

export default Industry;
