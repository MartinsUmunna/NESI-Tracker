import React from 'react';
import { Box, Grid } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';

import WelcomeCard from 'src/components/dashboards/ecommerce/AfricaWelcomeCard';


const AfricaData = () => {
    return (
      <PageContainer title="Staff Manager" description="this is Staff Overview Dashboard page">
        <Box mt={3}>
          <Grid container spacing={3}>
            {/* column */}
            <Grid item xs={12} >
              <WelcomeCard />
            </Grid>
            <Grid item xs={12} >
              
            </Grid>
            <Grid item xs={12} >
              
            </Grid>
            <Grid item xs={12} >
              
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

export default AfricaData;
