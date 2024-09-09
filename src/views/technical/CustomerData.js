import React from 'react';
import { Box, Grid } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';


import CustomerWelcomeCard from 'src/components/dashboards/ecommerce/CustomerWelcomeCard';
import CustomerPopulation from  'src/components/customer-components/CustomerPopulation';
import DiscoTableCustomerPopulation from  'src/components/customer-components/DiscoTableCustomerPopulation';
import CustomerPopulationbyServiceBand from  'src/components/customer-components/CustomerPopulationbyServiceBand'

const CustomerData = () => {
  return (
    <PageContainer title="Technical Overview" description="this is Technical Overview Dashboard page">
      <Box mt={3}>
        <Grid container spacing={3}>
          {/* column */}
          <Grid item xs={12} >
            <CustomerWelcomeCard />
          </Grid>
          <Grid item xs={12} >
            <CustomerPopulation />
          </Grid>
          <Grid item xs={12} >
            <DiscoTableCustomerPopulation />
          </Grid>
          <Grid item xs={12} >
            <CustomerPopulationbyServiceBand />
          </Grid>
         

          
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default CustomerData;
