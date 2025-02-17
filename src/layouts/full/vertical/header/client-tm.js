import * as dropdownData from './data';

import { Avatar, Box, Button, Divider, IconButton, Menu, Typography } from '@mui/material';
import React, { useState } from 'react';

import CLientLogo from 'src/assets/images/logos/EMRC-Logo.png';
import { IconMail } from '@tabler/icons';
import { Link } from 'react-router-dom';
import Scrollbar from 'src/components/custom-scroll/Scrollbar';
import { Stack } from '@mui/system';
import unlimitedLogo from 'src/assets/images/backgrounds/unlimited-bg.png';

const Client = () => {
  return (
    <Box>
      <IconButton
        size="large"
        aria-label="show 11 new notifications"
        color="inherit"
        aria-controls="msgs-menu"
        sx={{
          borderRadius: '0px',
        }}
      >
        <Avatar
          src={CLientLogo}
          sx={{
            width: 70,
            height: 35,
            borderRadius: '0px',
          }}
        />
      </IconButton>
    </Box>
  );
};

export default Client;
