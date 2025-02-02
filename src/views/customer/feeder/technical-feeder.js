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
import AvailabilityTechnicalFeeder from '../../../components/customer-components/feeder-charts-cards/availability-feeder';
import StateMenuFilter from 'src/layouts/full/shared/breadcrumb/StateMenuFilter';
import BusinessDistrictFilter from 'src/layouts/full/shared/breadcrumb/BusinessDistrictFilter';
import FeederType from 'src/layouts/full/shared/breadcrumb/FeederType';


const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'State',
  },
  {
    title: 'Technical Feeder',
  },
];

const TechnicalFeeder = () => {
  const buttonStyles = {
    minWidth: '100px', // Adjust this value as needed
    margin: '5px',
  };
  return (
    <PageContainer title="Technical Feeder" description="this is Charts page">
      {/* breadcrumb */}
      <Breadcrumb title="Technical Feeder" items={BCrumb} />
      {/* end breadcrumb */}
      <Grid container item xs={12} justifyContent="space-between" alignItems="center">
          <Grid item xs={12} sm={6}>
            <Box display="flex" flexWrap="wrap">
              <BusinessDistrictFilter buttonStyles={buttonStyles} />
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box display="flex" justifyContent="flex-end" alignItems="center">
              <Box style={{ marginRight: '10px' }}>
                <StateMenuFilter />
              </Box>
              <Box>
                <FeederType buttonStyles={buttonStyles} />
              </Box>
            </Box>
          </Grid>
        </Grid>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <AvailabilityTechnicalFeeder />
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default TechnicalFeeder;
