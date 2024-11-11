import React from 'react';
import { Box, Grid } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer'; // Ensure you have the correct path to PageContainer
import ATCCWidgetOverview from '../../components/dashboards/modern/ATCCWidgetOverview';
import BillingEfficiencyWidgetOverview from '../../components/dashboards/modern/BillingEfficiencyWidgetOverview';
import CollectionEfficiencyWidgetOverview from '../../components/dashboards/modern/CollectionEfficiencyWidgetOverview';
import ScrollerMetrics from 'src/components/industry-components/ScrollerMetrics';
import RevenueBilledWidgetOverview from '../../components/dashboards/modern/RevenueBilledWidgetOverview';
import CollectionsWidgetOverview from '../../components/dashboards/modern/CollectionsWidgetOverview';
import IndustryEnergy from 'src/components/industry-components/IndustryEnergy';
import CapacityIndustry from 'src/components/industry-components/CapacityIndustry';
import AverageDiscoTariff from 'src/components/industry-components/AverageDiscoTariff';
import AverageATCC from 'src/components/industry-components/AverageATCC';
import AverageBillingEfficiency from 'src/components/industry-components/AverageBillingEfficiency';
import AverageCollectionEfficiency from 'src/components/industry-components/AverageCollectionEfficiency';
import TransmissionLossFactorVsGridCollapse from 'src/components/industry-components/TransmissionLossFactorVsGridCollapse';
import AllTimePeak from 'src/components/industry-components/AllTimePeak';
import EnergySentOut from 'src/components/industry-components/EnergySentOut';
import EnergyRecieved from 'src/components/industry-components/EnergyRecieved';
import TCNWheelingCapacity from 'src/components/industry-components/TCNWheelingCapacity';
import GlobalEnergyTrends from 'src/components/industry-components/GlobalEnergyTrends';
import TATWidgetOverview from '../../components/dashboards/modern/TATWidgetOverview';
import WelcomeCard from 'src/components/dashboards/ecommerce/IndustryWelcomeCard';
import Welcome from 'src/layouts/full/shared/welcome/Welcome';
import ShareofAvailableCapacity from 'src/components/industry-components/ShareofAvailableCapacity';

const Industry = () => {
  return (
    <PageContainer title="Industry" description="This is the Industry Dashboard page">
      <Box>
        <Grid container spacing={3}>
          {/* Welcome Card */}
          <Grid item xs={12}>
              <WelcomeCard />
          </Grid>
          {/* column */}
          <Grid item xs={12} lg={12}>
            <ShareofAvailableCapacity />
          </Grid> 
          <Grid item xs={12} lg={12}>
            <IndustryEnergy />
          </Grid> 
          {/* column */}
          <Grid item xs={12} >
            <Grid container spacing={3}>
              <Grid item sm={12} lg={3}>
                <AverageDiscoTariff />
              </Grid>
              <Grid item sm={12} lg={3}>
                <AverageATCC />
              </Grid>
              <Grid item sm={12} lg={3}>
                <AverageBillingEfficiency />
              </Grid>
              <Grid item sm={12} lg={3}>
                <AverageCollectionEfficiency />
              </Grid>
              <Grid item sm={12} lg={8} >
                <CapacityIndustry />
              </Grid>
              <Grid item sm={12} lg={4} >
                <TransmissionLossFactorVsGridCollapse />
              </Grid>
              <Grid item sm={12} lg={3}>
                <AllTimePeak />
              </Grid>
              <Grid item sm={12} lg={3}>
                <EnergySentOut />
              </Grid>
              <Grid item sm={12} lg={3}>
                <EnergyRecieved />
              </Grid>
              <Grid item sm={12} lg={3}>
                <TCNWheelingCapacity />
              </Grid>
              <Grid item sm={12} >
                <GlobalEnergyTrends />
              </Grid>
                
            </Grid>
          </Grid>
          {/* column */}
          
          {/* column */}
          <Grid item xs={12} lg={4}>
            <Grid container spacing={3}>
              
              
             
            </Grid>
          </Grid>
    
        </Grid>
        {/* column */}
        <Welcome />
      </Box>
    </PageContainer>
  );
};

export default Industry;
