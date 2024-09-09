import React from 'react';
import { useTheme } from '@mui/material/styles';
import { CardContent, Typography, Divider, Grid, Box } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TotalCostIcon from 'src/assets/images/svgs/icon-Totalcost.svg'; // Icon for All Time Peak
import BlankCard from 'src/components/shared/BlankCard.js';

const ScrollerMetrics = () => {
  // Using theme to maintain consistency
  const theme = useTheme();

  return (
    <BlankCard>
      <CardContent sx={{ p: '25px', position: 'relative' }}>
        <Box sx={{
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          animation: 'scroll 30s linear infinite',
          '@keyframes scroll': {
            '0%': { transform: 'translateX(100%)' },
            '100%': { transform: 'translateX(-100%)' }
          }
        }}>
          <Grid container spacing={0} alignItems="center" wrap="nowrap">
            {/* All Time Peak Generation MW */}
            <Grid item>
              <Typography variant="body2" sx={{ color: 'green' }}>
                All Time Peak Generation (MW): <Typography component="span" sx={{ fontWeight: 200 }}>5,801</Typography>
              </Typography>
            </Grid>
            <Divider orientation="vertical" flexItem />

            {/* Energy Sent Out By Gencos */}
            <Grid item>
              <Typography variant="body2" sx={{ color: 'blue' }}>
                Energy Sent Out By Gencos (MW): <Typography component="span" sx={{ fontWeight: 200 }}>7,000</Typography>
                <TrendingDownIcon color="error" sx={{ ml: 1, verticalAlign: 'middle' }} />
                <Typography component="span" sx={{ color: theme.palette.error.main }}>3% from last month</Typography>
              </Typography>
            </Grid>
            <Divider orientation="vertical" flexItem />

            {/* Energy Received By Discos */}
            <Grid item>
              <Typography variant="body2" sx={{ color: 'orange' }}>
                Energy Received By Discos (MW): <Typography component="span" sx={{ fontWeight: 200 }}>6,000</Typography>
              </Typography>
            </Grid>
            <Divider orientation="vertical" flexItem />

            {/* New Metrics */}
            <Grid item>
              <Typography variant="body2" sx={{ color: 'purple' }}>
                Average Energy Generated Yesterday (MW): <Typography component="span" sx={{ fontWeight: 200 }}>148.75</Typography>
              </Typography>
            </Grid>
            <Divider orientation="vertical" flexItem />

            

            <Grid item>
              <Typography variant="body2" sx={{ color: 'red' }}>
                Transmission Loss Factor (MW): <Typography component="span" sx={{ fontWeight: 200 }}>5,600</Typography>
              </Typography>
            </Grid>
            <Divider orientation="vertical" flexItem />

            <Grid item>
              <Typography variant="body2" sx={{ color: 'grey' }}>
                Grid Collapses: <Typography component="span" sx={{ fontWeight: 200 }}>3</Typography>
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </BlankCard>
  );
};

export default ScrollerMetrics;
