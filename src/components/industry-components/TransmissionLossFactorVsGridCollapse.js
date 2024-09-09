import React from 'react';
import { CardContent, Typography, Avatar, Box, Divider } from '@mui/material';
import BlankCard from 'src/components/shared/BlankCard.js';
import { IconArrowUpRight } from '@tabler/icons';

const TransmissionLossFactorVsGridCollapse = () => {
  return (
    <BlankCard>
      <CardContent sx={{ 
        p: '25px', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center',
        height: '100%' 
      }}>
        <Typography variant="h6" gutterBottom textAlign="center">
          Transmission Loss Factor
        </Typography>
        
        <Typography variant="h3" fontWeight={600} sx={{ my: 2 }}>
          12.2%
        </Typography>
        
        <Typography variant="subtitle2" color="textSecondary" textAlign="center">
          (last year)
        </Typography>
        
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          mt: 1 
        }}>
          <Avatar sx={{ 
            bgcolor: 'error.light', 
            width: 24, 
            height: 24, 
            mr: 1 
          }}>
            <IconArrowUpRight width={16} color="#FA896B" />
          </Avatar>
          <Typography variant="subtitle2" color="textSecondary">
            10%
          </Typography>
        </Box>

        <Divider sx={{ width: '100%', my: 2 }} />

        <Typography variant="h6" gutterBottom textAlign="center">
          Grid Collapses This Year
        </Typography>
        
        <Typography variant="h3" fontWeight={600} sx={{ my: 2 }}>
          4
        </Typography>
        
        <Typography variant="subtitle2" color="textSecondary" textAlign="center">
          (last year)
        </Typography>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          mt: 1 
        }}>
          <Avatar sx={{ 
            bgcolor: 'error.light', 
            width: 24, 
            height: 24, 
            mr: 1 
          }}>
            <IconArrowUpRight width={16} color="#FA896B" />
          </Avatar>
          <Typography variant="subtitle2" color="textSecondary">
            2
          </Typography>
        </Box>
      </CardContent>
    </BlankCard>
  );
};

export default TransmissionLossFactorVsGridCollapse;