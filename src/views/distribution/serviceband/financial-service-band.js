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
import RevenueCostFinancialSB from '../../../components/distribution-components/service-band-chart-cards/revenue-cost-sb'
import TariffFinancialSB from '../../../components/distribution-components/service-band-chart-cards/tariff-sb'
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
    title: 'Financial Service Band',
  },
];

const FinancialServiceBand = () => {
  return (
    <PageContainer title="Financial Service Band" description="this is Charts page">
      {/* breadcrumb */}
      <Breadcrumb title="Financial Service Band" items={BCrumb} />
      {/* end breadcrumb */}
      <Grid container spacing={3}>
      <Grid item xs={4}>
          <StateFilter />
        </Grid>
        <Grid item xs={12}>
          <RevenueCostFinancialSB />
        </Grid>
        <Grid item xs={12}>
          <TariffFinancialSB />
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default FinancialServiceBand;
