import React from 'react';
import { Box, Container, Button, styled, Typography, Grid, Avatar,  Chip } from '@mui/material';

import DemoTitle from './DemoTitle';

// images
import mainDemo from 'src/assets/images/landingpage/demos/demo-main.jpg';
import darkDemo from 'src/assets/images/landingpage/demos/demo-dark.jpg';
import horizontalDemo from 'src/assets/images/landingpage/demos/demo-horizontal.jpg';
import minisidebarDemo from 'src/assets/images/landingpage/demos/demo-firebase.jpg';
import rtlDemo from 'src/assets/images/landingpage/demos/demo-rtl.jpg';

import app1 from 'src/assets/images/landingpage/apps/app-calendar.jpg';
import app2 from 'src/assets/images/landingpage/apps/app-chat.jpg';
import app3 from 'src/assets/images/landingpage/apps/app-contact.jpg';
import app4 from 'src/assets/images/landingpage/apps/app-email.jpg';
import app5 from 'src/assets/images/landingpage/apps/app-note.jpg';
import app6 from 'src/assets/images/landingpage/apps/app-user-profile.jpg';
import app7 from 'src/assets/images/landingpage/apps/app-blog.jpg';
import app8 from 'src/assets/images/landingpage/apps/app-ticket.jpg';
import app9 from 'src/assets/images/landingpage/apps/app-ecommerce-shop.jpg';
import app10 from 'src/assets/images/landingpage/apps/app-ecommerce-detail.jpg';
import app11 from 'src/assets/images/landingpage/apps/app-ecommerce-checkout.jpg';
import app12 from 'src/assets/images/landingpage/apps/app-ecommerce-list.jpg';
import app13 from 'src/assets/images/landingpage/apps/app-blog-detail.jpg';

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
    link: '/On-Grid/GenerationData',
    img: darkDemo,
    title: 'Commercial',
  },
  {
    link: '/distribution/Disco',
    img: horizontalDemo,
    title: 'Financial',
  },
  {
    link: '/customer/CustomerData',
    img: minisidebarDemo,
    title: 'Technical',
  },
  {
    link: '/off-grid/MiniGridsData',
    img: rtlDemo,
    title: 'Staff Manager',
  },
];


const DemoSlider = () => {
  return (
    <Box
      pb="140px"
      overflow="hidden"
      sx={{
        pt: {
          sm: '60px',
          lg: '0',
        },
      }}
    >
      <Container maxWidth="lg">
        {/* Title */}

        {/* slider */}
        <Box mt={9}>
          <Grid container spacing={3} justifyContent="center">
            {demos.map((demo, index) => (
              <Grid item xs={12} lg={3} key={index}>
                <Box>
                  {/* <Link href={demo.link}> */}
                  <StyledBox>
                    <Avatar
                      src={demo.img}
                      sx={{
                        borderRadius: '8px',
                        width: '100%',
                        height: '100%',
                      }}
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      href={demo.link}
                      target="_blank"
                    >
                      View
                    </Button>
                  </StyledBox>
                  {/* </Link> */}
                  <Typography
                    variant="body1"
                    color="textPrimary"
                    textAlign="center"
                    fontWeight={500}
                    mt={2}
                  >
                    {demo.title}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default DemoSlider;
