import React from 'react';
import { Box, Grid } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';


import StaffWelcomeCard from 'src/components/dashboards/ecommerce/StaffWelcomeCard';


const EnergyReportData = () => {
  return (
    <PageContainer title="Staff Manager" description="this is Staff Overview Dashboard page">
      <Box mt={3}>
        <Grid container spacing={3}>
          {/* column */}
          <Grid item xs={12} >
            <StaffWelcomeCard />
          </Grid>

      

          
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default EnergyReportData;
