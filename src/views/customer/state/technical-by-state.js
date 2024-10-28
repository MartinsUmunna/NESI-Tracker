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
import StateMapboxTechnicalBS from '../../../components/customer-components/by-state-chart-cards/statemapbox-bs';
import HighestPeakFeedersBS from '../../../components/customer-components/by-state-chart-cards/highest-peak-feeders-bs';
import LowestPeakFeedersBS from '../../../components/customer-components/by-state-chart-cards/lowest-peak-feeders-bs';
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
    title: 'Technical by State',
  },
];

const TechnicalByState = () => {
  return (
    <PageContainer title="Technical By State" description="this is Charts page">
      {/* breadcrumb */}
      <Breadcrumb title="Technical by State" items={BCrumb} />
      {/* end breadcrumb */}
      <Grid container spacing={3}>
      <Grid item xs={4}>
          <StateFilter />
        </Grid>
        <Grid item xs={12}>
          <StateMapboxTechnicalBS />
        </Grid>

        <Grid item xs={12}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <HighestPeakFeedersBS />
            </Grid>
            <Grid item xs={12} sm={6}>
              <LowestPeakFeedersBS />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default TechnicalByState;
