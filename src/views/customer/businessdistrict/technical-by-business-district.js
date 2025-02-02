import React from 'react';
import { Grid, Box } from '@mui/material';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import YearlyBreakup from '../../../components/dashboards/modern/YearlyBreakup';
import Projects from '../../../components/dashboards/modern/Projects';
import Customers from '../../../components/dashboards/modern/Customers';
import SalesTwo from '../../../components/dashboards/ecommerce/SalesTwo';
import MonthlyEarnings from '../../../components/dashboards/modern/MonthlyEarnings';
import SalesOverview from '../../../components/dashboards/ecommerce/SalesOverview';
import RevenueUpdates from '../../../components/dashboards/modern/RevenueUpdates';
import YearlySales from '../../../components/dashboards/ecommerce/YearlySales';
import MostVisited from '../../../components/widgets/charts/MostVisited';
import PageImpressions from '../../../components/widgets/charts/PageImpressions';
import Followers from '../../../components/widgets/charts/Followers';
import Views from '../../../components/widgets/charts/Views';
import Earned from '../../../components/widgets/charts/Earned';
import CurrentValue from '../../../components/widgets/charts/CurrentValue';
import BDMapboxTechnicalBBD from '../../../components/customer-components/by-business-district-chart-cards/business-district-mapbox-bbd';
import HighestPeakFeedersBBD from '../../../components/customer-components/by-business-district-chart-cards/highest-peak-feeders-bbd';
import LowestPeakFeedersBBD from '../../../components/customer-components/by-business-district-chart-cards/lowest-peak-feeders-bbd';
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
    title: 'Technical By Business District',
  },
];

const TechnicalByBusinessDistricts = () => {
  const handleFilterChange = (filter) => {
    // Implement the filter change logic here
    console.log(filter);
  };

  return (
    <PageContainer title="Technical By Business District" description="this is Charts page">
      {/* breadcrumb */}
      <Breadcrumb title="Technical By Business District" items={BCrumb} />
      {/* end breadcrumb */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box sx={{ width: 'fit-content' }}>
          <BusinessDistrictFilter onFilterChange={handleFilterChange} />
        </Box>
      </Box>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <BDMapboxTechnicalBBD />
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <HighestPeakFeedersBBD />
            </Grid>
            <Grid item xs={12} sm={6}>
              <LowestPeakFeedersBBD />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default TechnicalByBusinessDistricts;
