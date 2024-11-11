import React, { useRef, useState, useEffect } from 'react';
import { Box, Grid, Button, Typography, ButtonGroup } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import PageContainer from 'src/components/container/PageContainer';
import WelcomeCard from 'src/components/dashboards/ecommerce/DistributionWelcomeCard';
import DiscoMap_StatesCovered from 'src/components/distribution-components/DiscoMap_StatesCovered';
import DistributionATCC from 'src/components/distribution-components/DistributionATCC';
import DistributionTariff from 'src/components/distribution-components/DistributionTariff';
import DistributionEnergyBilled from 'src/components/distribution-components/DistributionEnergyBilled';
import DiscoStatsTable from 'src/components/distribution-components/DiscoStatsTable';
import DistributionEnergyRecieved from 'src/components/distribution-components/DistributionEnergyRecieved';
import DiscoStatsTableRecieved from 'src/components/distribution-components/DiscoStatsTableRecieved';
import DistributionRevenueCollected from 'src/components/distribution-components/DistributionRevenueCollected';
import DiscoTableRevenueCollected from 'src/components/distribution-components/DiscoTableRevenueCollected';
import DistributionRevenueBilled from 'src/components/distribution-components/DistributionRevenueBilled';
import DiscoTableRevenueBilled from 'src/components/distribution-components/DiscoTableRevenueBilled';
import DiscoTableATCC from 'src/components/distribution-components/DiscoTableATCC';
import DiscoTableTariff from 'src/components/distribution-components/DiscoTableTariff';
import DiscoTableLoadOffTake from 'src/components/distribution-components/DiscoTableLoadOffTake';
import DiscoTableMarketInvoice from 'src/components/distribution-components/DiscoTableMarketInvoice';
import DiscoMeteringProgress from 'src/components/distribution-components/DiscoMeteringProgress';
import DiscoTableMarketInvoiceNBET from 'src/components/distribution-components/DiscoTableMarketInvoiceNBET';

const Disco = () => {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const sectionRefs = {
    atcc: useRef(null),
    tariff: useRef(null),
    energyReceived: useRef(null),
    energyBilled: useRef(null),
    revenueBilled: useRef(null),
    revenueCollected: useRef(null),
    loadOfftake: useRef(null),
    invoices: useRef(null),
    metering: useRef(null),
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionRef) => {
    sectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <PageContainer title="Distribution" description="This is the Distribution Dashboard page">
      <Box>
        <Box mt={3} mb={3} display="flex" alignItems="center" flexWrap="wrap">
          <Typography variant="h4" gutterBottom sx={{ marginRight: 2 }}>
            Jump to Section:
          </Typography>
          <ButtonGroup variant="outlined" size="small" sx={{ flexGrow: 1 }}>
            <Button
              onClick={() => scrollToSection(sectionRefs.atcc)}
              sx={{ flex: 1 }}
            >
              ATCC
            </Button>
            <Button
              onClick={() => scrollToSection(sectionRefs.tariff)}
              sx={{ flex: 1 }}
            >
              Tariff
            </Button>
            <Button
              onClick={() => scrollToSection(sectionRefs.energyReceived)}
              sx={{ flex: 1 }}
            >
              Energy Received
            </Button>
            <Button
              onClick={() => scrollToSection(sectionRefs.energyBilled)}
              sx={{ flex: 1 }}
            >
              Energy Billed
            </Button>
            <Button
              onClick={() => scrollToSection(sectionRefs.revenueBilled)}
              sx={{ flex: 1 }}
            >
              Revenue Billed
            </Button>
            <Button
              onClick={() => scrollToSection(sectionRefs.revenueCollected)}
              sx={{ flex: 1 }}
            >
              Revenue Collected
            </Button>
            <Button
              onClick={() => scrollToSection(sectionRefs.loadOfftake)}
              sx={{ flex: 1 }}
            >
              Load Offtake
            </Button>
            <Button
              onClick={() => scrollToSection(sectionRefs.invoices)}
              sx={{ flex: 1 }}
            >
              Invoices
            </Button>
            <Button
              onClick={() => scrollToSection(sectionRefs.metering)}
              sx={{ flex: 1 }}
            >
              Metering
            </Button>
          </ButtonGroup>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <WelcomeCard />
          </Grid>
          <Grid item xs={12}>
            <DiscoMap_StatesCovered />
          </Grid>
          <Grid item xs={12} ref={sectionRefs.atcc}>
            <DistributionATCC />
          </Grid>
          <Grid item xs={12}>
            <DiscoTableATCC />
          </Grid>
          <Grid item xs={12} ref={sectionRefs.tariff}>
            <DistributionTariff />
          </Grid>
          <Grid item xs={12}>
            <DiscoTableTariff />
          </Grid>
          <Grid item xs={12} ref={sectionRefs.energyReceived}>
            <DistributionEnergyRecieved />
          </Grid>
          <Grid item xs={12}>
            <DiscoStatsTableRecieved />
          </Grid>
          <Grid item xs={12} ref={sectionRefs.energyBilled}>
            <DistributionEnergyBilled />
          </Grid>
          <Grid item xs={12}>
            <DiscoStatsTable />
          </Grid>
          <Grid item xs={12} ref={sectionRefs.revenueBilled}>
            <DistributionRevenueBilled />
          </Grid>
          <Grid item xs={12}>
            <DiscoTableRevenueBilled />
          </Grid>
          <Grid item xs={12} ref={sectionRefs.revenueCollected}>
            <DistributionRevenueCollected />
          </Grid>
          <Grid item xs={12}>
            <DiscoTableRevenueCollected />
          </Grid>
          <Grid item xs={12} ref={sectionRefs.loadOfftake}>
            <DiscoTableLoadOffTake />
          </Grid>
          <Grid item xs={12} ref={sectionRefs.invoices}>
            <DiscoTableMarketInvoiceNBET />
          </Grid>
          <Grid item xs={12}>
            <DiscoTableMarketInvoice />
          </Grid>
          <Grid item xs={12} ref={sectionRefs.metering}>
            <DiscoMeteringProgress />
          </Grid>
        </Grid>
      </Box>

      {showBackToTop && (
        <Button
          variant="contained"
          color="primary"
          onClick={scrollToTop}
          style={{
            position: 'fixed',
            bottom: '80px',
            right: '20px',
            borderRadius: '50%',
            minWidth: '50px',
            height: '50px',
            zIndex: 1000,
          }}
        >
          <KeyboardArrowUpIcon />
        </Button>
      )}
    </PageContainer>
  );
};

export default Disco;
