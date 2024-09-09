import React from 'react';
import { CardContent, Typography, Avatar, Box } from '@mui/material';
import BlankCard from 'src/components/shared/BlankCard.js';
import { IconArrowUpRight } from '@tabler/icons';

const AverageATCC = () => {
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
          Average ATCC
        </Typography>
        
        <Typography variant="h3" fontWeight={600} sx={{ my: 2 }}>
          65%
        </Typography>
        
        <Typography variant="subtitle2" color="textSecondary" textAlign="center">
          (last month)
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
            3.5%
          </Typography>
        </Box>
      </CardContent>
    </BlankCard>
  );
};

export default AverageATCC;