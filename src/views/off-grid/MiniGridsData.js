import React from 'react';
import { Box, Grid } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';

import WelcomeCard from 'src/components/dashboards/ecommerce/MinigridsWelcomeCard';
import MiniGridsMap from 'src/components/mini-grids-components/MiniGridsMap';
import InstalledCapacity from 'src/components/mini-grids-components/InstalledCapacity';
import PeopleConnected from 'src/components/mini-grids-components/PeopleConnected';
import TotalInvestment from 'src/components/mini-grids-components/TotalInvestment';
import ElectricityConsumed from 'src/components/mini-grids-components/ElectricityConsumed';
import CommunitiesConnected from 'src/components/mini-grids-components/CommunitiesConnected';
import InstalledCapacitySource from 'src/components/mini-grids-components/InstalledCapacitySource';
import YearlyElectricityConsumption from 'src/components/mini-grids-components/YearlyElectricityConsumption';
import NumOfConnections from 'src/components/mini-grids-components/NumOfConnections';
import NumberofRegisteredPrograms from 'src/components/mini-grids-components/NumberofRegisteredPrograms';

const MiniGridsData = () => {
  return (
    <PageContainer title="Mini Grids" description="This is the Mini Grids Dashboard page">
      <Box mt={3}>
        <Grid container spacing={3}>
          {/* column */}
          <Grid item sm={12}>
            <WelcomeCard />
          </Grid>

          <Grid item xs={12}>
            <MiniGridsMap />
          </Grid>
          <Grid item sm={12}>
            <InstalledCapacitySource />
          </Grid>
          <Grid item sm={12} lg={6}>
            <InstalledCapacity />
          </Grid>
          <Grid item lg={6} sm={12}>
            <PeopleConnected />
          </Grid>
          <Grid item lg={6} sm={12}>
            <TotalInvestment />
          </Grid>
          <Grid item lg={6} sm={12}>
            <ElectricityConsumed />
          </Grid>
          <Grid item lg={6} sm={12}>
            <CommunitiesConnected />
          </Grid>
          <Grid item lg={6} sm={12}>
            <NumberofRegisteredPrograms />
          </Grid>

          <Grid item xs={12}>
            <YearlyElectricityConsumption />
          </Grid>
          <Grid item xs={12}>
            <NumOfConnections />
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default MiniGridsData;
