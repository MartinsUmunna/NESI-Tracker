import React from 'react';
import { Card, CardContent, Typography, useTheme } from '@mui/material';
import welcomeImg from 'src/assets/images/backgrounds/ComingSoon-bg.svg';

const AfricaWelcomeCard = () => {
  const theme = useTheme();  
  const primaryLight = theme.palette.primary.light;  

  return (
    <Card
      elevation={0}
      sx={{
        backgroundColor: primaryLight,
        backgroundImage: `url(${welcomeImg})`,  
        backgroundSize: 'cover',  
        backgroundPosition: 'center',  
        height: 270,  
        display: 'flex',
        alignItems: 'center', 
        justifyContent: 'center',  
        padding: theme.spacing(2)  
      }}
    >
      <CardContent sx={{ padding: 0, "&:last-child": { paddingBottom: 0 } }}>  
        <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold', fontSize: 65 }}>  
          Africa Report
        </Typography>
      </CardContent>
    </Card>
  );
};

export default AfricaWelcomeCard;
