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
import CostBreakdownFinancialABD from '../../../components/financial-components/all-business-district-chart-card/cost-breakdown-abd';
import TariffLossFinancialABD from '../../../components/financial-components/all-business-district-chart-card/tariffloss-abd';
import HighestTariffLossFinancialABD from '../../../components/financial-components/all-business-district-chart-card/highest-tariffloss-abd';
import LowestTariffLossFinancialABD from '../../../components/financial-components/all-business-district-chart-card/lowest-tariffloss-abd';
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
    title: 'Financial All Business District',
  },
];

const FinancialAllBusinessDistricts = () => {
  return (
    <PageContainer title="Financial All Business District" description="this is Charts page">
      {/* breadcrumb */}
      <Breadcrumb title="Financial All Business District" items={BCrumb} />
      {/* end breadcrumb */}
      <Grid container spacing={3}>
      <Grid item xs={4}>
          <StateFilter />
        </Grid>
        <Grid item xs={12} >
          <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
          <TariffLossFinancialABD />
        </Grid>
        {/* column */}
        <Grid item xs={12} lg={4}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} lg={12}>
              <HighestTariffLossFinancialABD />
            </Grid>
            <Grid item xs={12} sm={6} lg={12}>
              <LowestTariffLossFinancialABD />
            </Grid>
          </Grid>
        </Grid>
            <Grid item xs={12}>
              <CostBreakdownFinancialABD />
            </Grid>
        
          </Grid>
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default FinancialAllBusinessDistricts;
