import React, { useRef, useState, useEffect } from 'react';
import { 
  Box,
  Grid,
  Button,
  Typography,
  Popper,
  Fade,
  Paper,
  ClickAwayListener,
  IconButton
} from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import MenuIcon from '@mui/icons-material/Menu';
import NavigationIcon from '@mui/icons-material/Navigation';
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
  const [activeSection, setActiveSection] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  const [hoveredSection, setHoveredSection] = useState(null);

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

  const sections = [
    { key: 'atcc', label: 'ATCC', icon: '📊' },
    { key: 'tariff', label: 'Tariff', icon: '💰' },
    { key: 'energyReceived', label: 'Energy Received', icon: '⚡' },
    { key: 'energyBilled', label: 'Energy Billed', icon: '📝' },
    { key: 'revenueBilled', label: 'Revenue Billed', icon: '💵' },
    { key: 'revenueCollected', label: 'Revenue Collected', icon: '🏦' },
    { key: 'loadOfftake', label: 'Load Offtake', icon: '🔌' },
    { key: 'invoices', label: 'Invoices', icon: '📑' },
    { key: 'metering', label: 'Metering', icon: '⚡' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);

      // Determine active section based on scroll position
      const sectionEntries = Object.entries(sectionRefs);
      for (const [key, ref] of sectionEntries) {
        if (ref.current) {
          const rect = ref.current.getBoundingClientRect();
          if (rect.top >= 0 && rect.top <= window.innerHeight * 0.5) {
            setActiveSection(key);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setOpen((prev) => !prev);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const scrollToSection = (sectionKey) => {
    sectionRefs[sectionKey].current?.scrollIntoView({ behavior: 'smooth' });
    setActiveSection(sectionKey);
    handleClose();
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <PageContainer title="Distribution" description="Distribution Dashboard">
      <Box sx={{ position: 'relative' }}>
        {/* Navigation Menu */}
        <Box
          sx={{
            position: 'sticky',
            top: 0,
            zIndex: 1100,
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            padding: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              variant="contained"
              onClick={handleClick}
              startIcon={<MenuIcon />}
              sx={{
                borderRadius: 2,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                },
              }}
            >
              Navigate Sections
            </Button>

            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              {activeSection && sections.find(s => s.key === activeSection)?.label}
            </Typography>
          </Box>
        </Box>

        <Popper
          open={open}
          anchorEl={anchorEl}
          placement="bottom-start"
          transition
          sx={{ zIndex: 1200 }}
        >
          {({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={350}>
              <Paper
                sx={{
                  mt: 1,
                  p: 2,
                  borderRadius: 2,
                  boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                  maxWidth: '80vw',
                  maxHeight: '70vh',
                  overflow: 'auto',
                }}
              >
                <ClickAwayListener onClickAway={handleClose}>
                  <Grid container spacing={1}>
                    {sections.map((section) => (
                      <Grid item xs={12} sm={6} md={4} key={section.key}>
                        <Button
                          fullWidth
                          onClick={() => scrollToSection(section.key)}
                          onMouseEnter={() => setHoveredSection(section.key)}
                          onMouseLeave={() => setHoveredSection(null)}
                          sx={{
                            justifyContent: 'flex-start',
                            padding: 2,
                            borderRadius: 2,
                            backgroundColor: activeSection === section.key ? 'primary.light' : 'transparent',
                            color: activeSection === section.key ? 'primary.contrastText' : 'text.primary',
                            transition: 'all 0.3s ease',
                            transform: hoveredSection === section.key ? 'scale(1.05)' : 'scale(1)',
                            '&:hover': {
                              backgroundColor: activeSection === section.key ? 'primary.main' : 'action.hover',
                              transform: 'scale(1.05)',
                            },
                          }}
                        >
                          <Box sx={{ mr: 1 }}>{section.icon}</Box>
                          {section.label}
                        </Button>
                      </Grid>
                    ))}
                  </Grid>
                </ClickAwayListener>
              </Paper>
            </Fade>
          )}
        </Popper>

        {/* Main Content */}
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

        {/* Back to Top Button */}
        {showBackToTop && (
          <IconButton
            onClick={scrollToTop}
            sx={{
              position: 'fixed',
              bottom: '2rem',
              right: '2rem',
              backgroundColor: 'primary.main',
              color: 'white',
              borderRadius: '50%',
              width: 56,
              height: 56,
              boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: 'primary.dark',
                transform: 'scale(1.1)',
              },
            }}
          >
            <NavigationIcon />
          </IconButton>
        )}
      </Box>
    </PageContainer>
  );
};

export default Disco;