import React from 'react';
import { Box, Grid } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';

import WelcomeCard from 'src/components/dashboards/ecommerce/EconomyWelcomeCard';
import InflationRate from 'src/components/econometrics-components/InflationRate';   
import Forex from 'src/components/econometrics-components/Forex';
import PetrolPrices from 'src/components/econometrics-components/PetrolPrices';
import DieselPrices from 'src/components/econometrics-components/dieselPrices';


const EconomicData = () => {
    return (
      <PageContainer title="Staff Manager" description="this is Staff Overview Dashboard page">
        <Box mt={3}>
          <Grid container spacing={3}>
            {/* column */}
            <Grid item xs={12} >
              <WelcomeCard />
            </Grid>
            <Grid item xs={12} >
              <InflationRate />
            </Grid>
            <Grid item xs={12} >
              <Forex />
            </Grid>
            <Grid item xs={12} >
              <PetrolPrices />
            </Grid>
            <Grid item xs={12} >
              <DieselPrices />
            </Grid>
            <Grid item xs={12} >
              
            </Grid>
            <Grid item xs={12} >
              
            </Grid>


            </Grid>
      </Box>
    </PageContainer>
  );
};

export default EconomicData;
