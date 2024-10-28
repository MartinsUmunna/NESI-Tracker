import React, { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Box, Typography, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import BlankCard from 'src/components/shared/BlankCard';

mapboxgl.accessToken = 'pk.eyJ1IjoibWFydGluc2FuYWx5dGljcyIsImEiOiJjbTBwYXQ4c2swMzBiMmtzNjdxZnp4bTY3In0.giNAUdEA7uVxDQW8ir1M9w';

const PetrolPricesMap = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [year, setYear] = useState(2023);
  const [month, setMonth] = useState('January');
  const [hoveredState, setHoveredState] = useState(null);

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v10',
      center: [8.6753, 9.0820], // center on Nigeria
      zoom: 5.5
    });

    map.current.on('style.load', () => {
      map.current.addSource('petrol-prices', {
        type: 'geojson',
        data: '/public/petrol_prices.geojson'
      });

      map.current.addLayer({
        id: 'petrol-prices-fill',
        type: 'fill',
        source: 'petrol-prices',
        paint: {
          'fill-color': [
            'interpolate',
            ['linear'],
            ['get', 'Price'],
            100, '#ffffcc',
            150, '#a1dab4',
            200, '#41b6c4',
            250, '#2c7fb8',
            300, '#253494'
          ],
          'fill-opacity': [
            'case',
            ['boolean', ['==', ['get', 'State'], ['literal', hoveredState]], false],
            1,
            0.75
          ]
        }
      });

      map.current.addLayer({
        id: 'state-borders',
        type: 'line',
        source: 'petrol-prices',
        paint: {
          'line-color': '#627BC1',
          'line-width': 1
        }
      });

      // Add hover effect
      map.current.on('mousemove', 'petrol-prices-fill', (e) => {
        if (e.features.length > 0) {
          const { State, Price } = e.features[0].properties;
          setHoveredState(State);

          // Show tooltip
          new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(`<strong>${State}</strong><br/>Price: ₦${parseFloat(Price).toFixed(2)}`)
            .addTo(map.current);
        }
      });

      // Remove hover effect when mouse leaves the state
      map.current.on('mouseleave', 'petrol-prices-fill', () => {
        setHoveredState(null);
        map.current.getCanvas().style.cursor = '';
      });

      // Add click to zoom functionality
      map.current.on('click', 'petrol-prices-fill', (e) => {
        if (e.features.length > 0) {
          const coordinates = e.features[0].geometry.coordinates[0];
          const bounds = coordinates.reduce((bounds, coord) => {
            return bounds.extend(coord);
          }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));

          map.current.fitBounds(bounds, {
            padding: 40,
            duration: 1000
          });
        }
      });

      // Initial filter
      filterMapData();
    });
  }, [hoveredState]);

  const filterMapData = () => {
    if (map.current.getLayer('petrol-prices-fill')) {
      map.current.setFilter('petrol-prices-fill', [
        'all',
        ['==', ['to-number', ['get', 'Year']], year],
        ['==', ['get', 'Month'], month]
      ]);
    }
  };

  useEffect(() => {
    if (map.current && map.current.isStyleLoaded()) {
      filterMapData();
    }
  }, [year, month]);

  const years = Array.from(new Set([2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023]));
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <BlankCard>
      <Box sx={{ height: '80vh' }}>
        <Typography variant="h6" gutterBottom sx={{ p: 2 }}>
          Petrol Prices Map
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'flex-start', p: 2, gap: 2 }}>
          <FormControl size="small" sx={{ minWidth: 80 }}>
            <InputLabel>Year</InputLabel>
            <Select
              value={year}
              label="Year"
              onChange={(e) => setYear(e.target.value)}
            >
              {years.map((y) => (
                <MenuItem key={y} value={y}>{y}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 100 }}>
            <InputLabel>Month</InputLabel>
            <Select
              value={month}
              label="Month"
              onChange={(e) => setMonth(e.target.value)}
            >
              {months.map((m) => (
                <MenuItem key={m} value={m}>{m}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <div ref={mapContainer} style={{ width: '100%', height: 'calc(100% - 120px)' }} />
      </Box>
    </BlankCard>
  );
};

export default PetrolPricesMap;