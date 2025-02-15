import { Button, Menu, MenuItem } from '@mui/material';
import React, { useState } from 'react';

import { Link } from 'react-router-dom';

const AppDD = () => {
  const [anchorElOnGrid, setAnchorElOnGrid] = useState(null);
  const [anchorElOffGrid, setAnchorElOffGrid] = useState(null);

  const handleClickOnGrid = (event) => {
    setAnchorElOnGrid(event.currentTarget);
  };

  const handleCloseOnGrid = () => {
    setAnchorElOnGrid(null);
  };

  const handleClickOffGrid = (event) => {
    setAnchorElOffGrid(event.currentTarget);
  };

  const handleCloseOffGrid = () => {
    setAnchorElOffGrid(null);
  };

  return (
    <>
      <Button
        color="inherit"
        sx={{ color: (theme) => theme.palette.text.secondary }}
        variant="text"
        to="/dashboard/overview/Industry"
        component={Link}
      >
        Industry
      </Button>

      <Button
        color="inherit"
        sx={{ color: (theme) => theme.palette.text.secondary }}
        variant="text"
        to="/dashboard/econometrics/EconomicData"
        component={Link}
      >
        Economy
      </Button>

      <Button
        color="inherit"
        sx={{ color: (theme) => theme.palette.text.secondary }}
        variant="text"
        onClick={handleClickOnGrid}
      >
        On-Grid
      </Button>
      <Menu anchorEl={anchorElOnGrid} open={Boolean(anchorElOnGrid)} onClose={handleCloseOnGrid}>
        <MenuItem
          onClick={handleCloseOnGrid}
          component={Link}
          to="/dashboard/On-Grid/GenerationData"
        >
          Generation
        </MenuItem>
        <MenuItem
          onClick={handleCloseOnGrid}
          component={Link}
          to="/dashboard/transmission/TransmissionData"
        >
          Transmission
        </MenuItem>
        <MenuItem onClick={handleCloseOnGrid} component={Link} to="/dashboard/distribution/Disco">
          Distribution
        </MenuItem>
        <MenuItem
          onClick={handleCloseOnGrid}
          component={Link}
          to="/dashboard/customer/CustomerData"
        >
          Customer
        </MenuItem>
      </Menu>

      <Button
        color="inherit"
        sx={{ color: (theme) => theme.palette.text.secondary }}
        variant="text"
        onClick={handleClickOffGrid}
      >
        Off-Grid
      </Button>
      <Menu anchorEl={anchorElOffGrid} open={Boolean(anchorElOffGrid)} onClose={handleCloseOffGrid}>
        <MenuItem
          onClick={handleCloseOffGrid}
          component={Link}
          to="/dashboard/off-grid/MiniGridsData"
        >
          Mini Grids
        </MenuItem>
      </Menu>

      <Button
        color="inherit"
        sx={{ color: (theme) => theme.palette.text.secondary }}
        variant="text"
        to="/dashboard/off-grid/EnergyReportData"
        component={Link}
      >
        Energy Insights
      </Button>
      <Button
        color="inherit"
        sx={{ color: (theme) => theme.palette.text.secondary }}
        variant="text"
        to="/dashboard/dataset/Dataset_Data"
        component={Link}
      >
        Datasets
      </Button>
    </>
  );
};

export default AppDD;
