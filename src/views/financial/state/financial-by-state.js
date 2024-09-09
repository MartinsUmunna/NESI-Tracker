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
import StateMapboxFinancialBS from '../../../components/financial-components/by-state-chart-cards/statemapbox-bs';
import StateCostBreakdownFinancialBS from '../../../components/financial-components/by-state-chart-cards/statecost-breakdown-bs';
import StateFilter from 'src/layouts/full/shared/breadcrumb/StateFilter'
import TariffFinancialBS from '../../../components/financial-components/by-state-chart-cards/tarrifs-bs';
import OpexBreakdownFinancialBS from '../../../components/financial-components/by-state-chart-cards/opex-breakdown-bs';
const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'State',
  },
  {
    title: 'Financial by State',
  },
];

const FinancialByState = () => {
  return (
    <PageContainer title="Financial By State" description="this is Charts page">
      {/* breadcrumb */}
      <Breadcrumb title="Financial by State" items={BCrumb} />
      {/* end breadcrumb */}
      <Grid container spacing={3}>
      <Grid item xs={12}>
          <StateFilter />
        </Grid>
        <Grid item xs={12}>
          <StateMapboxFinancialBS />
        </Grid>
        <Grid item xs={12}>
          <OpexBreakdownFinancialBS />
        </Grid>
        

        <Grid item xs={12}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <StateCostBreakdownFinancialBS />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TariffFinancialBS />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default FinancialByState;
