import React, { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Box, Typography, Slider, FormControl, InputLabel, Select, MenuItem, Chip } from '@mui/material';
import BlankCard from 'src/components/shared/BlankCard';

mapboxgl.accessToken = 'pk.eyJ1IjoibWFydGluc2FuYWx5dGljcyIsImEiOiJjbTBwYXQ4c2swMzBiMmtzNjdxZnp4bTY3In0.giNAUdEA7uVxDQW8ir1M9w';

const SolarShareEnergyMap = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [yearRange, setYearRange] = useState([1971, 2023]);
  const [data, setData] = useState(null);
  const [selectedRegions, setSelectedRegions] = useState(['World']);

  const regions = [
    'World', 'Africa', 'Asia', 'Europe', 'North America', 'South America', 'Oceania',
    'Czechia', 'Eastern Africa (EI)', 'Europe (EI)', 'European Union (27)',
    'High-income countries', 'Lower-middle-income countries',
    'Middle Africa (EI)', 'Middle East (EI)', 'Non-OECD (EI)',
    'North America (EI)', 'North Macedonia', 'OECD (EI)',
    'South and Central America (EI)', 'Trinidad and Tobago', 'USSR',
    'United States', 'Upper-middle-income countries', 'Western Africa (EI)'
  ];

  const regionCoordinates = {
    'World': { center: [0, 20], zoom: 1.5 },
    'Africa': { center: [20, 0], zoom: 2.5 },
    'Asia': { center: [100, 30], zoom: 2.5 },
    'Europe': { center: [15, 50], zoom: 3 },
    'North America': { center: [-100, 40], zoom: 2.5 },
    'South America': { center: [-60, -15], zoom: 2.5 },
    'Oceania': { center: [134, -25], zoom: 3 }
  };

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v10',
      center: [0, 20],
      zoom: 1.5
    });

    map.current.on('load', () => {
      fetch('/solar_share_energy_data.geojson')
        .then(response => response.json())
        .then(result => {
          setData(result);
          map.current.addSource('solar-data', {
            type: 'geojson',
            data: result
          });

          map.current.addLayer({
            id: 'solar-heatmap',
            type: 'heatmap',
            source: 'solar-data',
            paint: {
              'heatmap-weight': [
                'interpolate',
                ['linear'],
                ['get', 'SolarShare'],
                0, 0,
                0.5, 1
              ],
              'heatmap-intensity': [
                'interpolate',
                ['linear'],
                ['zoom'],
                0, 1,
                9, 3
              ],
              'heatmap-color': [
                'interpolate',
                ['linear'],
                ['heatmap-density'],
                0, 'rgba(33,102,172,0)',
                0.2, 'rgb(103,169,207)',
                0.4, 'rgb(209,229,240)',
                0.6, 'rgb(253,219,199)',
                0.8, 'rgb(239,138,98)',
                1, 'rgb(178,24,43)'
              ],
              'heatmap-radius': [
                'interpolate',
                ['linear'],
                ['zoom'],
                0, 2,
                9, 20
              ],
              'heatmap-opacity': 0.8
            }
          });

          updateMap();
        });
    });
  }, []);

  useEffect(() => {
    if (!map.current || !data) return;
    updateMap();
  }, [yearRange, selectedRegions, data]);

  const updateMap = () => {
    if (!map.current.getSource('solar-data')) return;

    const filteredData = {
      type: 'FeatureCollection',
      features: data.features.filter(feature => 
        feature.properties.Year >= yearRange[0] &&
        feature.properties.Year <= yearRange[1] &&
        (selectedRegions.includes('World') || selectedRegions.includes(feature.properties.Entity))
      )
    };

    map.current.getSource('solar-data').setData(filteredData);

    // Zoom to selected region
    if (selectedRegions.length === 1 && regionCoordinates[selectedRegions[0]]) {
      const { center, zoom } = regionCoordinates[selectedRegions[0]];
      map.current.flyTo({ center, zoom });
    }
  };

  const handleYearRangeChange = (event, newValue) => {
    setYearRange(newValue);
  };

  const handleRegionChange = (event) => {
    setSelectedRegions(event.target.value);
  };

  return (
    <BlankCard>
      <Box sx={{ height: '80vh', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ p: 2 }}>
          <Typography variant="h5" gutterBottom>
            Solar Share Energy Heatmap
          </Typography>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Regions</InputLabel>
            <Select
              multiple
              value={selectedRegions}
              onChange={handleRegionChange}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
            >
              {regions.map((region) => (
                <MenuItem key={region} value={region}>
                  {region}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Typography gutterBottom>Year Range: {yearRange[0]} - {yearRange[1]}</Typography>
          <Slider
            value={yearRange}
            onChange={handleYearRangeChange}
            onChangeCommitted={handleYearRangeChange}
            valueLabelDisplay="auto"
            min={1971}
            max={2023}
          />
        </Box>
        <Box ref={mapContainer} sx={{ flex: 1 }} />
        <Box sx={{ position: 'absolute', bottom: 32, right: 32, background: 'white', padding: 2, borderRadius: 1 }}>
          <Typography variant="subtitle2" gutterBottom>Solar Share</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ width: 20, height: 20, background: 'rgb(33,102,172)', mr: 1 }} />
              <Typography variant="body2">Low</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ width: 20, height: 20, background: 'rgb(103,169,207)', mr: 1 }} />
              <Typography variant="body2">Medium-Low</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ width: 20, height: 20, background: 'rgb(253,219,199)', mr: 1 }} />
              <Typography variant="body2">Medium</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ width: 20, height: 20, background: 'rgb(239,138,98)', mr: 1 }} />
              <Typography variant="body2">Medium-High</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ width: 20, height: 20, background: 'rgb(178,24,43)', mr: 1 }} />
              <Typography variant="body2">High</Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </BlankCard>
  );
};

export default SolarShareEnergyMap;