import React from 'react';
import { Box, Grid } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';

import WelcomeCard from 'src/components/dashboards/ecommerce/GenerationWelcomeCard';
import YearlyEnergyGenerated from 'src/components/generation-components/YearlyEnergyGenerated';
import GencoCapacity from 'src/components/generation-components/GencoCapacity';
import GencoStatsTable from 'src/components/generation-components/GencoStatsTable';
import GencoInvoicetoNBET_Table from 'src/components/generation-components/GencoInvoicetoNBET_Table';
import NBETInvoicetoGencoTable from 'src/components/generation-components/NBETInvoicetoGencoTable';
import NBETOutstandingBalancetoGencoTable from 'src/components/generation-components/NBETOutstandingBalancetoGencoTable';
import GencoTableMarketInvoiceNBET from 'src/components/generation-components/GencoTableMarketInvoiceNBET';

const GenerationData = () => {
  return (
    <PageContainer title="Generation" description="This is the Generation Dashboard page">
      <Box mt={3}>
        <Grid container spacing={3}>
          {/* Welcome Card */}
          <Grid item xs={12}>
            <WelcomeCard />
          </Grid>
          <Grid item xs={12}>
            <GencoCapacity />
          </Grid>
          <Grid item xs={12}>
            <YearlyEnergyGenerated />
          </Grid>
          <Grid item xs={12}>
            <GencoStatsTable />
          </Grid>
          <Grid item xs={12}>
            <GencoInvoicetoNBET_Table />
          </Grid>
          <Grid item xs={12}>
            <NBETInvoicetoGencoTable />
          </Grid>
          <Grid item xs={12}>
            <NBETOutstandingBalancetoGencoTable />
          </Grid>
          <Grid item xs={12}>
            <GencoTableMarketInvoiceNBET />
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default GenerationData;
