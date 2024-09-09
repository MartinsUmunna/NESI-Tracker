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
import AvailabilityTechnicalAS from '../../../components/technical-components/all-state-charts-cards/availability-as';
import FeederInfoTechnicalAS from '../../../components/technical-components/all-state-charts-cards/feeder-info-as';
import TechnicalMetricsStates from '../../../components/technical-components/all-state-charts-cards/TechnicalMetricsStates';
import FeederNumbersWidget from '../../../components/technical-components/all-state-charts-cards/FeederNumbersWidget';
import PeakLoadWidget from '../../../components/technical-components/all-state-charts-cards/PeakLoadWidget';
import CustomerWidget from '../../../components/technical-components/all-state-charts-cards/CustomerWidget';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'State',
  },
  {
    title: 'Technical All State',
  },
];

const TechnicalAllState = () => {
  return (
    <PageContainer title="Technical All State" description="this is Technical All State page">
      {/* breadcrumb */}
      <Breadcrumb title="Technical All State" items={BCrumb} />
      {/* end breadcrumb */}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={12}>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={8}>
              <Grid container spacing={3} direction="column">
                <Grid item style={{ height: '500px' }}>
                  <TechnicalMetricsStates />
                </Grid>
               
              </Grid>
            </Grid>
            <Grid item xs={12} lg={4}>
              <Grid container spacing={3}>
              <Grid item xs={12}>
                  <FeederNumbersWidget />
                </Grid>
                <Grid item xs={12}>
                  <PeakLoadWidget />
                </Grid>
                <Grid item xs={12}>
                  <CustomerWidget />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default TechnicalAllState;
