import React from 'react';
import { Grid } from '@mui/material';
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
import AvailabilityTechnicalABD from '../../../components/customer-components/all-business-district-chart-cards/availability-abd';
import FeederNumberTechnicalABD from '../../../components/customer-components/all-business-district-chart-cards/feeder-number-abd';
import PeakLoadTechnicalABD from '../../../components/customer-components/all-business-district-chart-cards/peak-load-abd';
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
    title: 'Technical All Business District',
  },
];

const TechnicalAllBusinessDistricts = () => {
  return (
    <PageContainer title="Technical All Business District" description="this is Charts page">
      {/* breadcrumb */}
      <Breadcrumb title="Technical All Business District" items={BCrumb} />
      {/* end breadcrumb */}
      <Grid container spacing={3}>
      <Grid item xs={4}>
          <StateFilter />
        </Grid>
      
        <Grid item xs={12}>
          <AvailabilityTechnicalABD />
        </Grid>

        <Grid item xs={12}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <FeederNumberTechnicalABD />
            </Grid>
            <Grid item xs={12} sm={6}>
            <PeakLoadTechnicalABD />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default TechnicalAllBusinessDistricts;
