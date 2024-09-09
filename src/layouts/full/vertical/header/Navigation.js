import React from 'react';
import { Button, Avatar } from '@mui/material';
import { Link } from 'react-router-dom';

const AppDD = () => {
  // Replace 'logo_path' with your actual logo image path
  
  return (
    <>
    
      
       
   

      <Button color="inherit" sx={{color: (theme) => theme.palette.text.secondary}} variant="text" to='/home' component={Link}>
        Home
      </Button>
      <Button color="inherit" sx={{color: (theme) => theme.palette.text.secondary}} variant="text" to='/overview/Industry' component={Link}>
        Industry
      </Button>
      <Button color="inherit" sx={{color: (theme) => theme.palette.text.secondary}} variant="text" to='/commercial/GenerationData' component={Link}>
        Generation
      </Button>
      <Button color="inherit" sx={{color: (theme) => theme.palette.text.secondary}} variant="text" to="/transmission/TransmissionData" component={Link}>
        Transmission
      </Button>
      <Button color="inherit" sx={{color: (theme) => theme.palette.text.secondary}} variant="text" to="/financial/Disco" component={Link}>
        Distribution
      </Button>
      <Button color="inherit" sx={{color: (theme) => theme.palette.text.secondary}} variant="text" to="/technical/CustomerData" component={Link}>
        Customer
      </Button>
      <Button color="inherit" sx={{color: (theme) => theme.palette.text.secondary}} variant="text" to="/staff/MiniGridsData" component={Link}>
        Mini Grids
      </Button>
      <Button color="inherit" sx={{color: (theme) => theme.palette.text.secondary}} variant="text" to="/staff/EnergyReportData" component={Link}>
        Energy Insights
      </Button>
      <Button color="inherit" sx={{color: (theme) => theme.palette.text.secondary}} variant="text" to="/staff/MiniGridsData" component={Link}>
        Datasets
      </Button>
    </>
  );
};

export default AppDD;
