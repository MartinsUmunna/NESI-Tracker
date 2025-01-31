import React from 'react';
import { CardContent, Typography, Avatar, Box } from '@mui/material';
import BlankCard from 'src/components/shared/BlankCard.js';
import { IconArrowUpRight } from '@tabler/icons';

const EnergyRecieved = () => {
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
          Energy Recieved by DisCos (2024)
        </Typography>
        
        <Typography variant="h3" fontWeight={600} sx={{ my: 2 }}>
          24,230 GWh
        </Typography>
        
        
        
      </CardContent>
    </BlankCard>
  );
};

export default EnergyRecieved;