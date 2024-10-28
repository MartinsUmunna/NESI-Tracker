import React from 'react';
import { Grid } from '@mui/material';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import StaffCollectionBusinessDistrict from '../../../components/widgets/charts/StaffCollectionBusinessDistrict';
import RetentionVsChurnBusinessDistrict from '../../../components/widgets/charts/RetentionVsChurnBusinessDistrict';
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
    title: 'Staff All Business District',
  },
];

const StaffAllBusinessDistricts = () => {
  return (
    <PageContainer title="Staff All Business District" description="this is Charts page">
      {/* breadcrumb */}
      <Breadcrumb title="Staff All Business District" items={BCrumb} />
      {/* end breadcrumb */}
      <Grid container spacing={3}>
      <Grid item xs={4}>
          <StateFilter />
        </Grid>
      <Grid item xs={12}>
          <StaffCollectionBusinessDistrict />
        </Grid>
        <Grid item xs={12}>
          <RetentionVsChurnBusinessDistrict />
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

export default StaffAllBusinessDistricts;
