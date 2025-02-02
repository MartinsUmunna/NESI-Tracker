import React from 'react';
import { Grid } from '@mui/material';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import Customers from '../../../components/widgets/charts/Customers';
import ServiceBandCustomers from '../../../components/widgets/charts/ServiceBandCustomers';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'State',
  },
  {
    title: 'Commercial Customer',
  },
];

const CommercialCustomer = () => {
  return (
    <PageContainer title="Commercial Customer" description="this is Charts page">
      {/* breadcrumb */}
      <Breadcrumb title="Commercial Customer" items={BCrumb} />
      {/* end breadcrumb */}
      <Grid container spacing={3}>
        
        
        
        
        <Grid item xs={12}>
          <Customers />
        </Grid>
        <Grid item xs={12}>
          <ServiceBandCustomers />
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

export default CommercialCustomer;
