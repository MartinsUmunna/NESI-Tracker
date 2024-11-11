import React from 'react';
import { Box, Grid } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';

import WelcomeCard from 'src/components/dashboards/ecommerce/WorldWelcomeCard';
import WorldEnergyMix from  'src/components/world-components/WorldEnergyMix';
import GHGByContinentandSector from 'src/components/world-components/GHGByContinentandSector';
import GHGByCountry from 'src/components/world-components/GHGByCountry';
import LowCarbonShareEnergy from 'src/components/world-components/LowCarbonShareEnergy';
import SolarShareEnergy from 'src/components/world-components/SolarShareEnergy';


const WorldData = () => {
    return (
      <PageContainer title="World Data" description="this is Staff Overview Dashboard page">
        <Box mt={3}>
          <Grid container spacing={3}>
            {/* column */}
            <Grid item xs={12} >
              <WelcomeCard />
            </Grid>
            <Grid item xs={12} >
              <WorldEnergyMix />
            </Grid>
            <Grid item xs={12} >
              <GHGByContinentandSector />
            </Grid>
            <Grid item xs={12} >
              <GHGByCountry />
            </Grid>
            <Grid item xs={12} >
              <LowCarbonShareEnergy />
            </Grid>
            <Grid item xs={12} >
              <SolarShareEnergy />
            </Grid>


            </Grid>
      </Box>
    </PageContainer>
  );
};

export default WorldData;
