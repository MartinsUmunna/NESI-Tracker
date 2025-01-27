import React from 'react';
import { Card, CardContent, Typography, useTheme } from '@mui/material';
import welcomeImg from 'src/assets/images/backgrounds/generation-bg4.svg';

const GenerationWelcomeCard = () => {
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
        padding: theme.spacing(2),
      }}
    >
      <CardContent sx={{ padding: 0, '&:last-child': { paddingBottom: 0 } }}>
        <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold', fontSize: 40 }}>
          Generation Data
        </Typography>
      </CardContent>
    </Card>
  );
};

export default GenerationWelcomeCard;
