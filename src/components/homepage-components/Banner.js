import React from 'react';
import { Grid, Box, Container, useMediaQuery, styled, Stack, Typography, Avatar, Button } from '@mui/material';
import BannerContent from './BannerContent';
import bannerbgImg1 from 'src/assets/images/landingpage/bannerimg1.svg';
import bannerbgImg2 from 'src/assets/images/landingpage/bannerimg2.svg';



// images
import mainDemo from '../../assets/images/landingpage/demos/demo-rtl.jpg';  
import darkDemo from '../../assets/images/landingpage/demos/demo-rtl.jpg';  
import horizontalDemo from '../../assets/images/landingpage/demos/demo-rtl.jpg';  
import minisidebarDemo from '../../assets/images/landingpage/demos/demo-rtl.jpg';  
import rtlDemo from '../../assets/images/landingpage/demos/demo-rtl.jpg';  


const StyledBox = styled(Box)(() => ({
  overflow: 'auto',
  position: 'relative',
  '.MuiButton-root': {
    display: 'none',
  },
  '&:hover': {
    '.MuiButton-root': {
      display: 'block',
      transform: 'translate(-50%,-50%)',
      position: 'absolute',
      left: '50%',
      right: '50%',
      top: '50%',
      minWidth: '100px',
      zIndex: '9',
    },
    '&:before': {
      content: '""',
      position: 'absolute',
      top: '0',
      left: ' 0',
      width: '100%',
      height: '100%',
      zIndex: '8',
      backgroundColor: 'rgba(55,114,255,.2)',
    },
  },
}));




const demos = [
  {
    link: '/overview/Industry',
    img: mainDemo,
    title: 'Overview',
  },
  {
    link: '/commercial/GenerationData',
    img: darkDemo,
    title: 'Commercial',
  },
  {
    link: '/financial/Disco',
    img: horizontalDemo,
    title: 'Financial',
  },
  {
    link: '/technical/CustomerData',
    img: minisidebarDemo,
    title: 'Technical',
  },
  {
    link: '/staff/MiniGridsData',
    img: rtlDemo,
    title: 'Staff Manager',
  },
];

const Banner = () => {
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('md'));

  const SliderBox = styled(Box)(() => ({
    '@keyframes slideup': {
      '0%': {
        transform: 'translate3d(0, 0, 0)',
      },
      '100% ': {
        transform: 'translate3d(0px, -100%, 0px)',
      },
    },

    animation: 'slideup 35s linear infinite',
  }));

  const SliderBox2 = styled(Box)(() => ({
    '@keyframes slideDown': {
      '0%': {
        transform: 'translate3d(0, -100%, 0)',
      },
      '100% ': {
        transform: 'translate3d(0px, 0, 0px)',
      },
    },

    animation: 'slideDown 35s linear infinite',
  }));



  return (
    <Box mb={10} sx={{ overflow: 'hidden' }}>
      <Container maxWidth="lg">
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12}>
            <BannerContent />
          </Grid>
          
        </Grid>
      </Container>
    </Box>
  );
};

export default Banner;
