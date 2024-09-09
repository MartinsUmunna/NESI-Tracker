import React from 'react';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import { Stack, Typography, Box, Divider } from '@mui/material';
import DashboardCard from 'src/components/shared/DashboardCard.js';

const CapacityIndustry = () => {
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const secondary = theme.palette.secondary.main;

  const optionsDonut = {
    chart: {
      type: 'donut',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      toolbar: {
        show: false,
      },
    },
    labels: ["Renewable", "Non-Renewable (Hydro)"],
    colors: [primary, secondary],
    plotOptions: {
      pie: {
        donut: {
          size: '85%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Total Capacity',
              formatter: function () {
                return '100%'
              }
            },
            value: {
              fontSize: '22px',
              fontWeight: 'bold',
              formatter: function (val) {
                return val + '%';
              }
            }
          }
        }
      }
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    tooltip: {
      enabled: false,
    },
    stroke: {
      width: 0
    },
  };

  const seriesInstalled = [70, 30];
  const seriesAvailable = [70, 30];

  return (
    <DashboardCard title="Capacity">
      <Stack direction="row" spacing={2} justifyContent="space-between" mt={3}>
        <Box width="48%">
          <Typography variant="h6" color="textSecondary" gutterBottom align="center">
            Installed Capacity
          </Typography>
          <Chart
            options={optionsDonut}
            series={seriesInstalled}
            type="donut"
            height="212px"
          />
          <Stack direction="row" justifyContent="center" spacing={2} mt={2}>
            <Box display="flex" alignItems="center">
              <Box width={10} height={10} bgcolor={primary} borderRadius="50%" mr={1} />
              <Typography variant="caption">Renewable</Typography>
            </Box>
            <Box display="flex" alignItems="center">
              <Box width={10} height={10} bgcolor={secondary} borderRadius="50%" mr={1} />
              <Typography variant="caption">Non-Renewable (Hydro)</Typography>
            </Box>
          </Stack>
        </Box>
        <Divider orientation="vertical" flexItem />
        <Box width="48%">
          <Typography variant="h6" color="textSecondary" gutterBottom align="center">
            Available Capacity
          </Typography>
          <Chart
            options={optionsDonut}
            series={seriesAvailable}
            type="donut"
            height="212px"
          />
          <Stack direction="row" justifyContent="center" spacing={2} mt={2}>
            <Box display="flex" alignItems="center">
              <Box width={10} height={10} bgcolor={primary} borderRadius="50%" mr={1} />
              <Typography variant="caption">Renewable</Typography>
            </Box>
            <Box display="flex" alignItems="center">
              <Box width={10} height={10} bgcolor={secondary} borderRadius="50%" mr={1} />
              <Typography variant="caption">Non-Renewable (Hydro)</Typography>
            </Box>
          </Stack>
        </Box>
      </Stack>
    </DashboardCard>
  );
};

export default CapacityIndustry;