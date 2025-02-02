import React, { useState } from 'react';
import { Grid, Box } from '@mui/material';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import BusinessDistrictsATCC from '../../../components/dashboards/modern/BusinessDistrictsATCC';
import BusinessDistrictsBillingEfficiency from '../../../components/dashboards/modern/BusinessDistrictsBillingEfficiency';
import BusinessDistrictsCollectionEfficiency from '../../../components/dashboards/modern/BusinessDistrictsCollectionEfficiency';
import EnergyMetrics from 'src/components/dashboards/ecommerce/EnergyMetrics';
import CustomerMetricsBusinessDistrict from 'src/components/dashboards/ecommerce/CustomerMetricsBusinessDistrict';
import BusinessDistrictMap from '../../../components/widgets/charts/BusinessDistrictMap';
import BusinessDistrictFilter from '/src/layouts/full/shared/breadcrumb/BusinessDistrictFilter';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'State',
  },
  {
    title: 'Commercial By Business District',
  },
];

const CommercialByBusinessDistricts = () => {
  const [filters, setFilters] = useState({ year: 'All', month: 'All', district: '' });

  const handleFilterChange = (newFilters) => {
    setFilters(prevFilters => ({ ...prevFilters, ...newFilters }));
  };

  return (
    <PageContainer title="Commercial By Business District" description="this is Charts page">
      <Breadcrumb 
        title="Commercial By Business District" 
        items={BCrumb} 
      />
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box sx={{ width: 'fit-content' }}>
          <BusinessDistrictFilter onFilterChange={handleFilterChange} />
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <BusinessDistrictMap selectedDistrict={filters.district} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Grid container direction="column" spacing={3}>
              <Grid item>
                <BusinessDistrictsATCC filters={filters} />
              </Grid>
              <Grid item>
                <BusinessDistrictsBillingEfficiency filters={filters} />
              </Grid>
              <Grid item>
                <BusinessDistrictsCollectionEfficiency filters={filters} />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} md={6}>
            <EnergyMetrics filters={filters} />
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomerMetricsBusinessDistrict filters={filters} />
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default CommercialByBusinessDistricts;