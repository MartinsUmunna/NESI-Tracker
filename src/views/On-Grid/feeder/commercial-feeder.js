import React from 'react';
import { Grid, Box } from '@mui/material';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import StateMenuFilter from 'src/layouts/full/shared/breadcrumb/StateMenuFilter';
import BusinessDistrictFilter from 'src/layouts/full/shared/breadcrumb/BusinessDistrictFilter';
import FeederType from 'src/layouts/full/shared/breadcrumb/FeederType';
import PageContainer from 'src/components/container/PageContainer';

import LowestATCCFeeder from '../../../components/On-Grid-components/feeder-charts-cards/lower-atcc-feeder';
import HighestATCCFeeder from '../../../components/On-Grid-components/feeder-charts-cards/higher-atcc-feeder';
import BreakdownCommercialFeeder from '../../../components/On-Grid-components/feeder-charts-cards/On-Grid-breakdown-feeder';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'State',
  },
  {
    title: 'Commercial Feeder',
  },
];

const buttonStyles = {
  minWidth: '100px', // Adjust this value as needed
  margin: '5px',
};

const CommercialFeeder = () => {
  return (
    <PageContainer title="Commercial Feeder" description="this is Charts page">
      {/* breadcrumb */}
      <Breadcrumb title="Commercial Feeder" items={BCrumb} />
      {/* end breadcrumb */}
      <Grid container spacing={3}>
      <Grid item xs={12} lg={6}>
          <LowestATCCFeeder />
        </Grid>
        <Grid item xs={12} lg={6}>
          <HighestATCCFeeder />
        </Grid>
        <Grid item xs={12}>
          <BreakdownCommercialFeeder />
        
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default CommercialFeeder;
