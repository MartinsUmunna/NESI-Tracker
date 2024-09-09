import React, { useEffect, useRef } from 'react';
import { useTheme } from '@mui/material/styles';
import { Grid, Typography, Box, Paper } from '@mui/material';
import EnergyComparisonAllStatesDashboardWidgetCard from 'src/components/shared/EnergyComparisonAllStatesDashboardWidgetCard';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Define DisCo details including colors and customers
const discoDetails = {
  "Abuja Disco": { color: "#FF5733", customers: "3.5M", states: "FCT, Nassarawa, Niger, Kogi" },
  "Benin Disco": { color: "#C70039", customers: "2.2M", states: "Edo, Delta, Ondo, Ekiti" },
  "Eko Disco": { color: "#900C3F", customers: "4.0M", states: "Lagos South" },
  "Enugu Disco": { color: "#581845", customers: "2.8M", states: "Enugu, Imo, Anambra, Abia, Ebonyi" },
  "Ibadan Disco": { color: "#FFC300", customers: "3.3M", states: "Oyo, Ogun, Osun, Kwara" },
  "Ikeja Disco": { color: "#DAF7A6", customers: "5.1M", states: "Lagos North" },
  "Jos Disco": { color: "#33FFCE", customers: "1.9M", states: "Plateau, Benue, Bauchi, Gombe" },
  "Kaduna Disco": { color: "#33FF57", customers: "2.5M", states: "Kaduna, Kebbi, Sokoto, Zamfara" },
  "Kano Disco": { color: "#3380FF", customers: "2.7M", states: "Kano, Jigawa, Katsina" },
  "Portharcourt Disco": { color: "#5733FF", customers: "2.1M", states: "Akwa ibom, Cross River, Rivers, Bayelsa" },
  "Yola Disco": { color: "#8333FF", customers: "1.1M", states: "Adamawa, Borno, Taraba, Yobe" }
};

const MapComponent = ({ token }) => {
  const mapContainerRef = useRef(null);

  useEffect(() => {
    mapboxgl.accessToken = token;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [8.6753, 9.0820],
      zoom: 5.5
    });

    map.addControl(new mapboxgl.NavigationControl(), 'top-right');

    map.on('load', () => {
      map.addSource('discos', {
        type: 'geojson',
        data: 'https://data.nigeriase4all.gov.ng/geoserver/ows?service=WFS&version=1.0.0&request=GetFeature&typename=se4allWS%3Adisco_coverage&outputFormat=json&srs=EPSG%3A4326&srsName=EPSG%3A4326'
      });

      // Add a layer for each DisCo
      Object.entries(discoDetails).forEach(([name, details]) => {
        map.addLayer({
          id: name,
          type: 'fill',
          source: 'discos',
          paint: {
            'fill-color': details.color,
            'fill-opacity': 0.6
          },
          filter: ['==', 'disco_name', name]
        });

        // Add hover effect and popup for each layer
        map.on('mouseenter', name, (e) => {
          map.getCanvas().style.cursor = 'pointer';
          const coordinates = e.lngLat;
          const description = `<strong>${name}</strong><br>Customers: ${details.customers}<br>States: ${details.states}`;
          
          new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(description)
            .addTo(map);
        });

        map.on('mouseleave', name, () => {
          map.getCanvas().style.cursor = '';
          map.getCanvas().style.cursor = '';
        });
      });
    });

    return () => map.remove();
  }, [token]);

  return <div ref={mapContainerRef} style={{ width: '100%', height: '400px' }} />;
};

const Legend = () => {
  const theme = useTheme();

  return (
    <Box sx={{ maxHeight: 345, overflow: 'auto' }}>
      {Object.entries(discoDetails).map(([name, details], index) => (
        <Paper key={index} sx={{ margin: 1, padding: 2, backgroundColor: theme.palette.background.paper }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{name}</Typography>
          <Typography variant="body2">States Covered: {details.states}</Typography>
          <Typography variant="body2">Customers: {details.customers}</Typography>
        </Paper>
      ))}
    </Box>
  );
};

const DiscoMap_StatesCovered = () => {
  return (
    <EnergyComparisonAllStatesDashboardWidgetCard title="DisCo States Covered">
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <MapComponent token="pk.eyJ1IjoibWFydGluc2FuYWx5dGljcyIsImEiOiJjbHpxdXc0MWcxcHd5MmpxdXljc2ZieWJpIn0.t4ZnMZ3-qKEK9DxdE845xw" />
        </Grid>
        <Grid item xs={12} md={4}>
          <Legend />
        </Grid>
      </Grid>
    </EnergyComparisonAllStatesDashboardWidgetCard>
  );
};

export default DiscoMap_StatesCovered;