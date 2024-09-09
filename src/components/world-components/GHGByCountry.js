import React, { useState, useEffect, useMemo } from 'react';
import { useTheme } from '@mui/material/styles';
import { CardContent, Typography, Slider, Box } from '@mui/material';
import BlankCard from 'src/components/shared/BlankCard';
import Map, { Source, Layer } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const GHGByCountry = () => {
  const theme = useTheme();
  const [yearRange, setYearRange] = useState([1990, 2022]);
  const [geojsonData, setGeojsonData] = useState(null);
  const [viewport, setViewport] = useState({
    latitude: 0,
    longitude: 0,
    zoom: 1
  });

  const MAPBOX_TOKEN = "pk.eyJ1IjoibWFydGluc2FuYWx5dGljcyIsImEiOiJjbTBwYXQ4c2swMzBiMmtzNjdxZnp4bTY3In0.giNAUdEA7uVxDQW8ir1M9w";
  const GEOJSON_PATH = '/GHG_By_Country_New.geojson';

  useEffect(() => {
    fetch(GEOJSON_PATH)
      .then(response => response.json())
      .then(data => {
        setGeojsonData(data);
      })
      .catch(error => console.error('Error loading GeoJSON:', error));
  }, []);

  const handleChangeYearRange = (event, newValue) => {
    setYearRange(newValue);
  };

  const filteredGeojsonData = useMemo(() => {
    if (!geojsonData) return null;
    return {
      type: 'FeatureCollection',
      features: geojsonData.features.filter(f => 
        f.properties.Year >= yearRange[0] && f.properties.Year <= yearRange[1]
      )
    };
  }, [geojsonData, yearRange]);

  const layerStyle = {
    id: 'ghg-data',
    type: 'fill',
    paint: {
      'fill-color': [
        'interpolate',
        ['linear'],
        ['get', 'GHG'],  // Changed from 'emissions' to 'GHG'
        0, '#FFEDA0',
        1000000, '#FED976',
        10000000, '#FEB24C',
        50000000, '#FD8D3C',
        100000000, '#FC4E2A',
        500000000, '#E31A1C',
        1000000000, '#BD0026'
      ],
      'fill-opacity': 0.7
    }
  };

  const labelLayerStyle = {
    id: 'country-label',
    type: 'symbol',
    source: 'ghg-data',
    layout: {
      'text-field': ['get', 'GHG_Country'],  // Changed from 'country' to 'GHG_Country'
      'text-variable-anchor': ['center'],
      'text-radial-offset': 0.5,
      'text-justify': 'auto',
      'text-size': 10
    },
    paint: {
      'text-color': 'white'
    }
  };

  const legendItems = [
    { color: '#FFEDA0', label: '0' },
    { color: '#FED976', label: '1M' },
    { color: '#FEB24C', label: '10M' },
    { color: '#FD8D3C', label: '50M' },
    { color: '#FC4E2A', label: '100M' },
    { color: '#E31A1C', label: '500M' },
    { color: '#BD0026', label: '1B+' }
  ];

  const Legend = () => (
    <div style={{
      position: 'absolute',
      bottom: 20,
      right: 20,
      background: 'rgba(0,0,0,0.7)',
      padding: '10px',
      borderRadius: '5px'
    }}>
      <Typography variant="subtitle2" style={{ color: 'white', marginBottom: '5px' }}>
        Emissions (tons CO2 eq)
      </Typography>
      {legendItems.map((item, index) => (
        <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '2px' }}>
          <div style={{ width: '20px', height: '20px', backgroundColor: item.color, marginRight: '5px' }} />
          <Typography variant="caption" style={{ color: 'white' }}>{item.label}</Typography>
        </div>
      ))}
    </div>
  );

  return (
    <BlankCard>
      <CardContent sx={{ p: '25px', textAlign: 'left' }}>
        <Typography variant="h5" gutterBottom>
          GHG Emissions by Country from {yearRange[0]} to {yearRange[1]}
        </Typography>

        <Typography gutterBottom>Year Range: {yearRange[0]} - {yearRange[1]}</Typography>
        <Slider
          value={yearRange}
          onChange={handleChangeYearRange}
          valueLabelDisplay="auto"
          min={1990}
          max={2022}
          sx={{ mb: 4 }}
        />

        <Box sx={{ height: 600, width: '100%', position: 'relative' }}>
          <Map
            {...viewport}
            width="100%"
            height="100%"
            mapStyle="mapbox://styles/mapbox/dark-v10"
            onMove={evt => setViewport(evt.viewState)}
            mapboxAccessToken={MAPBOX_TOKEN}
          >
            {filteredGeojsonData && (
              <Source type="geojson" data={filteredGeojsonData}>
                <Layer {...layerStyle} />
                <Layer {...labelLayerStyle} />
              </Source>
            )}
          </Map>
          <Legend />
        </Box>
      </CardContent>
    </BlankCard>
  );
};

export default GHGByCountry;
