import {
  AppBar,
  Box,
  IconButton,
  Stack,
  Toolbar,
  Typography,
  styled,
  useMediaQuery,
} from '@mui/material';
import { toggleMobileSidebar, toggleSidebar } from 'src/store/customizer/CustomizerSlice';
import { useDispatch, useSelector } from 'react-redux';

import Cart from './Cart';
import Client from './client-tm';
import { IconMenu2 } from '@tabler/icons';
import Language from './Language';
import MobileRightSidebar from './MobileRightSidebar';
import Navigation from './Navigation';
import Notifications from './Notifications';
import Profile from './Profile';
import PropTypes from 'prop-types';
import React from 'react';
import Search from './Search';

// components

const Header = () => {
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));
  const lgDown = useMediaQuery((theme) => theme.breakpoints.down('lg'));

  // drawer
  const customizer = useSelector((state) => state.customizer);
  const dispatch = useDispatch();

  const AppBarStyled = styled(AppBar)(({ theme }) => ({
    boxShadow: 'none',
    background: theme.palette.background.paper,
    justifyContent: 'center',
    backdropFilter: 'blur(4px)',
    [theme.breakpoints.up('lg')]: {
      minHeight: customizer.TopbarHeight,
    },
  }));

  const ToolbarStyled = styled(Toolbar)(({ theme }) => ({
    width: '100%',
    color: theme.palette.text.secondary,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  }));

  const CenterContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexGrow: 1,
  }));

  return (
    <AppBarStyled position="sticky" color="default">
      <ToolbarStyled>
        <IconButton
          color="inherit"
          aria-label="menu"
          onClick={lgUp ? () => dispatch(toggleSidebar()) : () => dispatch(toggleMobileSidebar())}
        >
          <IconMenu2 size="20" />
        </IconButton>

        <Search />

        <CenterContainer>{lgUp ? <Navigation /> : null}</CenterContainer>

        <Stack spacing={1} direction="row" alignItems="center">
          {lgDown ? <MobileRightSidebar /> : null}
          <Client />
        </Stack>
      </ToolbarStyled>
    </AppBarStyled>
  );
};

Header.propTypes = {
  sx: PropTypes.object,
  toggleSidebar: PropTypes.func,
};

export default Header;
