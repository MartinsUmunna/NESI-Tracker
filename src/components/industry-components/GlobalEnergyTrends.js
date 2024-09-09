import React from 'react';
import { Box, Grid, Typography, Card, CardContent, CardMedia, Button } from '@mui/material';
import BlankCard from 'src/components/shared/BlankCard';
import { Link } from 'react-router-dom';  // Import Link from react-router-dom
import WorldEnergySupplybyContinet from "src/assets/images/Energy Trends/wind-energy-with-wind-turbines-background.jpg";
import WorldEnergySupplyMix from "src/assets/images/Energy Trends/sun-setting-silhouette-electricity-pylons.jpg";
import AfricaEnergySupply from "src/assets/images/Energy Trends/african-american-technician-checks-maintenance-solar-panels-group-three-black-engineers-meeting-solar-station.jpg";
import AfricaEnergySupplyMix from "src/assets/images/Energy Trends/vertical-shot-electric-tower-grassy-field-blue-sky.jpg";
import NigeriaEnergySupply from "src/assets/images/Energy Trends/niagara-falls-closeup-dusk.jpg";
import NigeriaEnergySupplyMix from "src/assets/images/Energy Trends/futuristic-solar-power-station-generates-clean-electricity-generated-by-ai.jpg";

const GlobalEnergyTrends = () => {
  const energyCards = [
    {
      title: "World Energy Supply by Continent Yearly",
      description: "Each continent has its unique energy profile, with varying degrees of reliance on fossil fuels like coal, oil, and natural gas, as well as renewable sources such as wind, solar, hydroelectric, and geothermal power.",
      image: WorldEnergySupplybyContinet,
      link: "/world-energy-supply"
    },
    {
      title: "World Energy Supply Mix Yearly",
      description: "Each continent has its unique energy profile, with varying degrees of reliance on fossil fuels like coal, oil, and natural gas, as well as renewable sources such as wind, solar, hydroelectric, and geothermal power.",
      image: WorldEnergySupplyMix,
      link: "/WorldEnergyMix"
    },
    {
      title: "Africa Energy Supply Total Yearly",
      description: "In January 2022, the total yearly energy supply in Africa is approximately 950-1,000 million tons of oil equivalent (Mtoe). This energy supply caters to a continent with a rapidly growing population and varied energy needs.",
      image: AfricaEnergySupply,
      link: "/africa-energy-supply"
    },
    {
      title: "Africa Energy Supply Mix Yearly",
      description: "Africa's energy supply is diversified, encompassing oil, natural gas, hydroelectric power, solar, wind, and biomass. While some countries rely heavily on fossil fuels like oil and gas, others tap into abundant renewable resources like hydropower, solar, and wind.",
      image: AfricaEnergySupplyMix,
      link: "/africa-energy-supply-mix"
    },
    {
      title: "Nigeria Energy Supply Yearly",
      description: "Nigeria's energy supply is primarily derived from oil and gas, contributing significantly to electricity generation and export. The country is investing in renewable sources like solar and hydroelectric power to diversify its energy mix.",
      image: NigeriaEnergySupply,
      link: "/nigeria-energy-supply"
    },
    {
      title: "Nigeria Energy Supply Mix Yearly",
      description: "Nigeria relies primarily on oil and gas for its energy needs, with hydropower and a growing emphasis on solar contributing to the mix. Efforts to diversify and incorporate more renewables aim to improve reliability and address challenges in the country's energy sector, including issues with access and supply reliability.",
      image: NigeriaEnergySupplyMix,
      link: "/nigeria-energy-supply-mix"
    },
  ];

  return (
    <BlankCard>
      <CardContent sx={{ p: '30px' }}>
        <Typography variant="h4" gutterBottom>Global Energy Trends</Typography>
        <Grid container spacing={3}>
          {energyCards.map((card, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={card.image}
                  alt={card.title}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h6" gutterBottom>{card.title}</Typography>
                    <Typography 
                      variant="body1" 
                      color="text.secondary" 
                      sx={{ fontSize: '1rem', mb: 2 }}  
                    >
                      {card.description}
                    </Typography>
                  </Box>
                  <Box mt={2}>
                    {/* Replace Button href with Link */}
                    <Button variant="outlined" component={Link} to={card.link}>Learn More</Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </BlankCard>
  );
};

export default GlobalEnergyTrends;
