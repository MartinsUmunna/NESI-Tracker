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
import RevenueCostFinancialAS from '../../../components/distribution-components/all-state-chart-cards/revenue-cost-as';
import TariffFinancialAS from '../../../components/distribution-components/all-state-chart-cards/tariff-as';
import FinancialTariffAllStates from  '../../../components/distribution-components/all-state-chart-cards/FinancialTariffAllStates';
import MYTOALLOWEDTARIFF from '../../../components/distribution-components/all-state-chart-cards/MYTOAllowedTariffWidget';
import CollectionTariif from '../../../components/distribution-components/all-state-chart-cards/CollectionTariffWidget';
import TariffLoss from '../../../components/distribution-components/all-state-chart-cards/TariffLossWidget';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'State',
  },
  {
    title: 'Financial All State',
  },
];

const FinancialAllState = () => {
  return (
    <PageContainer title="Financial All State" description="this is Financial All State page">
      {/* breadcrumb */}
      <Breadcrumb title="Financial All State" items={BCrumb} />
      {/* end breadcrumb */}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={12}>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={8}>
              <Grid container spacing={3} direction="column">
                <Grid item style={{ height: '500px' }}>
                  <FinancialTariffAllStates />
                </Grid>
               
              </Grid>
            </Grid>
            <Grid item xs={12} lg={4}>
              <Grid container spacing={3}>
              <Grid item xs={12}>
                  <MYTOALLOWEDTARIFF />
                </Grid>
                <Grid item xs={12}>
                  <CollectionTariif />
                </Grid>
                <Grid item xs={12}>
                  <TariffLoss />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default FinancialAllState;