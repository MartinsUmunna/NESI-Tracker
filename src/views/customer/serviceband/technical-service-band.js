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
import AvailabilityTechnicalSBT from '../../../components/customer-components/service-bands-chart-cards/availability-service-bands';
import TechBreakdownTechnicalSBT from '../../../components/customer-components/service-bands-chart-cards/customer-breakdown-servicce-band';
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
    title: 'Technical Service Band',
  },
];

const TechnicalServiceBand = () => {
  return (
    <PageContainer title="Technical Service Band" description="this is Charts page">
      {/* breadcrumb */}
      <Breadcrumb title="Technical Service Band" items={BCrumb} />
      {/* end breadcrumb */}
      <Grid item xs={4}>
          <StateFilter />
        </Grid>
      <Grid container spacing={3}>

        <Grid item xs={12}>
          <AvailabilityTechnicalSBT />
        </Grid>
        <Grid item xs={12}>
          <TechBreakdownTechnicalSBT />
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default TechnicalServiceBand;
