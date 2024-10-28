import React, { useState } from 'react';
import { Grid, Box } from '@mui/material';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import StaffCollectionBusinessDistrict_II from '../../../components/widgets/charts/StaffCollectionBusinessDistrict_II';
import RetentionVsChurnBusinessDistrict_II from '../../../components/widgets/charts/RetentionVsChurnBusinessDistrict_II';
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
    title: 'Staff By Business District',
  },
];

const StaffByBusinessDistricts = () => {
  const [selectedDistrict, setSelectedDistrict] = useState('');

  const handleFilterChange = (district) => {
    setSelectedDistrict(district);
  };

  return (
    <PageContainer title="Staff By Business District" description="this is Charts page">
      {/* breadcrumb */}
      <Breadcrumb title="Staff By Business District" items={BCrumb} />
      {/* end breadcrumb */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box sx={{ width: 'fit-content' }}>
              <BusinessDistrictFilter onFilterChange={handleFilterChange} />
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <StaffCollectionBusinessDistrict_II filteredDistrict={selectedDistrict} />
        </Grid>
        <Grid item xs={12}>
          <RetentionVsChurnBusinessDistrict_II filteredDistrict={selectedDistrict} />
        </Grid>
        
        
      </Grid>
    </PageContainer>
  );
};

export default StaffByBusinessDistricts;