import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Menu, Avatar, Typography, Divider, Button, IconButton } from '@mui/material';
import * as dropdownData from './data';

import { IconMail } from '@tabler/icons';
import { Stack } from '@mui/system';

import CLientLogo from 'src/assets/images/logos/EMRC-Logo.png';
import unlimitedLogo from 'src/assets/images/backgrounds/unlimited-bg.png';
import Scrollbar from 'src/components/custom-scroll/Scrollbar';

const Client = () => {

  return (
    
    <Box >
      
      <IconButton 
        size="large"
        aria-label="show 11 new notifications"
        color="inherit"
        aria-controls="msgs-menu"
        sx={{
            borderRadius: "0px"
          }}


      >
        
        <Avatar 
          src={CLientLogo}
          sx={{
            width: 70,
            height: 35,
            borderRadius: "0px"
          }}
        />
      </IconButton>

    </Box>
  );
};

export default Client;
