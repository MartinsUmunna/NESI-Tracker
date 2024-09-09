import React from 'react';
import { CardContent, Typography, Avatar, Box } from '@mui/material';
import BlankCard from 'src/components/shared/BlankCard.js';
import { IconArrowUpRight } from '@tabler/icons';

const TCNWheelingCapacity = () => {
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
          TCN Wheeling Capacity
        </Typography>
        
        <Typography variant="h3" fontWeight={600} sx={{ my: 2 }}>
          6,000 MW
        </Typography>
        
        
        
      </CardContent>
    </BlankCard>
  );
};

export default TCNWheelingCapacity;