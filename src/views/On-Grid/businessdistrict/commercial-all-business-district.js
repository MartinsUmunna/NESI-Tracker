import React, { useState } from 'react';
import { Grid } from '@mui/material';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import StateFilter from 'src/layouts/full/shared/breadcrumb/StateFilter';
import PageContainer from 'src/components/container/PageContainer';

import CommercialBusinessDistrictEnergy from '../../../components/widgets/charts/CommercialBusinessDistrictEnergy';
import CommercialBusinessDistrictATCC from '../../../components/widgets/charts/CommercialBusinessDistrictATCC';
import CommercialBusinessDistrictBillColl from '../../../components/widgets/charts/CommercialBusinessDistrictBillColl';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'State',
  },
  {
    title: 'Commercial All Business District',
  },
];

const CommercialAllBusinessDistricts = () => {
  const [filters, setFilters] = useState({
    year: 'All',
    month: 'All',
    state: 'All',
  });

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <PageContainer title="Commercial All Business District" description="this is Charts page">
      {/* breadcrumb */}
      <Breadcrumb 
        title="Commercial All Business District" 
        items={BCrumb} 
        onFilterChange={handleFilterChange} 
      />
      {/* end breadcrumb */}
      <Grid container spacing={3}>
      <Grid item xs={4}>
        <StateFilter />
        </Grid>
        <Grid item xs={12}>
          <CommercialBusinessDistrictEnergy filters={filters} />
        </Grid>
        <Grid item xs={12}>
          <CommercialBusinessDistrictATCC filters={filters} />
        </Grid>
        <Grid item xs={12}>
          <CommercialBusinessDistrictBillColl filters={filters} />
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default CommercialAllBusinessDistricts;
