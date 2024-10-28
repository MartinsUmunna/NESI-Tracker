import React from 'react';
import { Grid } from '@mui/material';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import EnergyAllStates from '../../../components/dashboards/ecommerce/EnergyAllStates';
import BillingsandCollections from '../../../components/dashboards/ecommerce/BillingsandCollections';
import CollectionEfficiencyWidget from '../../../components/widgets/charts/CollectionEfficiencyWidget';
import BillingEfficiencyWidget from '../../../components/widgets/charts/BillingEfficiencyWidget';
import CustomerResponseRateWidget from '../../../components/widgets/charts/CustomerResponseRateWidget';
import ATCCWidget from '../../../components/widgets/charts/ATCCWidget';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'State',
  },
  {
    title: 'Commercial All State:',
  },
];

const CommercialAllState = () => {
  return (
    <PageContainer title="Commercial All State" description="this is Charts page">
      {/* breadcrumb */}
      <Breadcrumb title="Commercial All State" items={BCrumb} />
      {/* end breadcrumb */}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={12}>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={8}>
              <Grid container spacing={3} direction="column">
                <Grid item style={{ height: '500px' }}>
                  <EnergyAllStates />
                </Grid>
                <Grid item style={{ height: '500px' }}>
                  <BillingsandCollections />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} lg={4}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <ATCCWidget />
                </Grid>
                <Grid item xs={12}>
                  <BillingEfficiencyWidget />
                </Grid>
                <Grid item xs={12}>
                  <CollectionEfficiencyWidget />
                </Grid>
                <Grid item xs={12}>
                  <CustomerResponseRateWidget />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default CommercialAllState;
