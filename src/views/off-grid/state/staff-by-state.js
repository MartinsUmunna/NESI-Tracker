import React from 'react';
import { Grid } from '@mui/material';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import StaffMetricsStates from '../../../components/widgets/charts/StaffMetricsStates';
import StaffCollectionsStates from 'src/components/dashboards/ecommerce/StaffCollectionsStates';
import StateFilter from 'src/layouts/full/shared/breadcrumb/StateFilter';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'State',
  },
  {
    title: 'Staff by State',
  },
];

const StaffByState = () => {
  return (
    <PageContainer title="Staff By State" description="this is Charts page">
      {/* breadcrumb */}
      <Breadcrumb title="Staff by State" items={BCrumb} />
      {/* end breadcrumb */}
      <Grid container spacing={3}>
      <Grid item xs={4}>
          <StateFilter />
        </Grid>
      <Grid item xs={12}>
          <StaffMetricsStates />
        </Grid>
     
        
        
        
        
        
        <Grid item xs={12} lg={4}>
          <Grid container spacing={3}>
            
            
            
          </Grid>
        </Grid>
        <Grid item xs={12} lg={4}>
          <Grid container spacing={3}>
            
            
           
            
          </Grid>
        </Grid>
        <Grid item xs={12} lg={4}>
          <Grid container spacing={3}>
            
            
          </Grid>
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default StaffByState;
