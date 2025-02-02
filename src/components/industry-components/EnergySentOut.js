import React from 'react';
import { CardContent, Typography, Avatar, Box } from '@mui/material';
import BlankCard from 'src/components/shared/BlankCard.js';
import { IconArrowUpRight } from '@tabler/icons';

const EnergySentOut = () => {
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
          Energy Sent Out by Gencos (2023)
        </Typography>
        
        <Typography variant="h3" fontWeight={600} sx={{ my: 2 }}>
          4,044 MWh
        </Typography>
        
        
        
      </CardContent>
    </BlankCard>
  );
};

export default EnergySentOut;