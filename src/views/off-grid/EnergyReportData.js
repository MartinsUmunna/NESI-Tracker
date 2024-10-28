import React from 'react';
import { Box, Grid } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';

const EnergyReportData = () => {
  return (
    <PageContainer title="Energy Report" description="Embedded view of the EMRC website">
      <Box mt={3}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <iframe
              src="https://www.energymrc.ng/insights"
              style={{ width: '100%', height: '80vh', border: 'none' }}
              title="Energy Report Insights"
              allowFullScreen
            />
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default EnergyReportData;
