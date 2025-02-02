import React from 'react';
import { Grid } from '@mui/material';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import Earned from '../../../components/widgets/charts/Earned';
import CollectionsPerStaffState from '../../../components/dashboards/ecommerce/CollectionsPerStaffState';
import StaffCountState from '../../../components/dashboards/ecommerce/StaffCountState';
import RetentionChurnRateState from '../../../components/dashboards/ecommerce/RetentionChurnRateState';


const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'State',
  },
  {
    title: 'Staff All State',
  },
];

const StaffAllState = () => {
  return (
    <PageContainer title="Staff All State" description="this is Charts page">
      {/* breadcrumb */}
      <Breadcrumb title="Staff All State" items={BCrumb} />
      {/* end breadcrumb */}
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6} style={{ height: '500px' }}>
          <CollectionsPerStaffState />
        </Grid>
        <Grid item xs={12} md={6} style={{ height: '500px' }}>
          <RetentionChurnRateState />
        </Grid> 
        <Grid item xs={12} >
          <StaffCountState />
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

export default StaffAllState;