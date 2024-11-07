import React, { useEffect, useRef } from 'react';
import { useTheme } from '@mui/material/styles';
import { Grid, Typography, Box, Paper } from '@mui/material';
import EnergyComparisonAllStatesDashboardWidgetCard from 'src/components/shared/EnergyComparisonAllStatesDashboardWidgetCard';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const minigridsData = {
  'type': 'FeatureCollection',
  'features': [
    {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [7.473, 9.277]
      },
      'properties': {
        'title': '3kW Solar minigrid in Igu community',
        'description': 'Was installed in xxxxx by the xxxxx'
      }
    },
    {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [7.093, 8.684]
      },
      'properties': {
        'title': '40kW Solar minigrid in Yebu community',
        'description': 'Was installed in 2017 by Havenhill Synergy Limited'
      }
    },
    {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [7.293, 8.884]
      },
      'properties': {
        'title': '20kW Biogas minigrid in Rije community',
        'description': 'Was installed in 2017 by Ajima Farms'
      }
    },
    {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [7.793, 8.884]
      },
      'properties': {
        'title': '4kW Solar minigrid in Ruguwa community',
        'description': 'Was installed in xxxxx by the xxxxx'
      }
    },
    {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [7.371, 9.370]
      },
      'properties': {
        'title': '40kW Solar minigrid in Gnami community',
        'description': 'Was installed in xxxxx by the xxxxx'
      }
    },
    {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [8.064, 10.587]
      },
      'properties': {
        'title': '50kW Solar Hybrid minigrid in Makami community',
        'description': 'Was installed in xxxxx by the xxxxx'
      }
    },
    {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [7.864, 11.387]
      },
      'properties': {
        'title': '24kW Solar minigrid in Charwa/Chakun community',
        'description': 'Was installed in xxxxx by the xxxxx'
      }
    },
    {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [7.664, 13.087]
      },
      'properties': {
        'title': '16kW Solar minigrid in Kindigi community',
        'description': 'Was installed in xxxxx by the xxxxx'
      }
    },
    {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [7.464, 12.487]
      },
      'properties': {
        'title': '30kW Solar minigrid in Bambami community',
        'description': 'Was installed in 2020 by the IBK Services Limited'
      }
    },
    {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [5.364, 12.887]
      },
      'properties': {
        'title': '10kW Solar minigrid in Dundaye community',
        'description': 'Was installed in xxxxx by the xxxxx'
      }
    },
    {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [4.369, 13.575]
      },
      'properties': {
        'title': '80kW Solar minigrid in Kurdula community',
        'description': 'Was installed in 2018 by Go Solar'
      }
    },
    {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [4.799, 12.075]
      },
      'properties': {
        'title': '60kW Solar minigrid in Torankawa community',
        'description': 'Was installed in 2019 by  Protogy Global Services'
      }
    },
    {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [4.066, 12.904]
      },
      'properties': {
        'title': '60kW Solar minigrid in Torankawa community',
        'description': 'Was installed in 2019 by Protogy Global Services'
      }
    },
    {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [5.424, 9.062]
      },
      'properties': {
        'title': '64kW Solar Hybrid minigrid in Rokota community',
        'description': 'Was installed in 2019 by PowerGen Renewable Energy'
      }
    },
    {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [7.240, 9.664]
      },
      'properties': {
        'title': '40kW Solar minigrid in Goton Sarki community',
        'description': 'Was installed in 2020 by AY Global Integrated Consult'
      }
    },
    {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [6.205, 9.352]
      },
      'properties': {
        'title': '41kW Solar minigrid in Swasun community',
        'description': 'Was installed in xxxxx by the xxxxx'
      }
    },
    {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [6.305, 9.152]
      },
      'properties': {
        'title': '38kW Solar minigrid in Bisanti community',
        'description': 'Was installed in 2015 by GVE'
      }
    },
    {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [4.824, 10.056]
      },
      'properties': {
        'title': '100kW Solar minigrid in Tunga Jika community',
        'description': 'Was installed in xxxxx by the xxxxx'
      }
    },
    {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [9.616, 11.528]
      },
      'properties': {
        'title': 'Minigrid in Ahoto community',
        'description': 'Was installed in xxxxx by the xxxxx'
      }
    },
    {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [10.693, 12.317]
      },
      'properties': {
        'title': '10kW Solar minigrid in Gololo community',
        'description': 'Was installed in xxxxx by the xxxxx'
      }
    },
    {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [10.791, 11.829]
      },
      'properties': {
        'title': '10kW Solar minigrid in Tarmasuwa community',
        'description': 'Was installed in xxxxx by the xxxxx'
      }
    },
    {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [10.064, 11.570]
      },
      'properties': {
        'title': '18kW Solar minigrid in Gaza community',
        'description': 'Was installed in xxxxx by the xxxxx'
      }
    },
    {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [9.638, 11.052]
      },
      'properties': {
        'title': '8kW Solar Hybrid minigrid in Bayan Fada community',
        'description': 'Was installed in xxxxx by the xxxxx'
      }
    },
    {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [11.781, 10.039]
      },
      'properties': {
        'title': '47kW Solar minigrid in Kolaku community',
        'description': 'Was installed inin 2017 by the GVE'
      }
    },
    {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [11.431, 9.717]
      },
      'properties': {
        'title': '38kW Solar minigrid in Kolwa community',
        'description': 'Was installed in xxxxx by the xxxxx'
      }
    },
    {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [11.040, 9.802]
      },
      'properties': {
        'title': '18kW Solar minigrid in Ayaba community',
        'description': 'Was installed in in 2017 by GVE'
      }
    },
    {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [11.678, 9.465]
      },
      'properties': {
        'title': '85kW Solar Hybrid minigrid in Dakkiti community',
        'description': 'Was installed in xxxxx by the xxxxx'
      }
    },
    {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [9.725, 8.319]
      },
      'properties': {
        'title': '91kW Solar Hybrid minigrid in Sarkin Kudu community',
        'description': 'Was installed in xxxxx by the xxxxx'
      }
    },
    {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [9.725, 8.475]
      },
      'properties': {
        'title': '150kW Solar Hybrid minigrid in Kuka community',
        'description': 'Was installed in xxxxx by the xxxxx'
      }
    },
    {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [9.573, 8.674]
      },
      'properties': {
        'title': '150kW Solar Hybrid minigrid in Shimankar community',
        'description': 'Was installed in xxxxx by the xxxxx'
      }
    },
    {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [9.373, 8.874]
      },
      'properties': {
        'title': '53kW Solar minigrid in Angwan Rina community',
        'description': 'Was installed in xxxxx by the xxxxx'
      }
    },
    {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [9.273, 8.974]
      },
      'properties': {
        'title': '53kW Solar minigrid in Demshin community',
        'description': 'Was installed in xxxxx by the xxxxx'
      }
    },
    {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [9.283, 7.324]
      },
      'properties': {
        'title': '24kW Solar minigrid in Pakau community',
        'description': 'Was installed in xxxxx by the xxxxx'
      }
    },
    {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [6.778, 7.552]
      },
      'properties': {
        'title': '80kW Solar Hybrid minigrid in Obangede community',
        'description': 'Was installed in 2019 by New Moon'
      }
    },
    {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [6.622, 7.304]
      },
      'properties': {
        'title': '80kW Solar Hybrid minigrid in Upake community',
        'description': 'Was installed in xxxxx by the xxxxx'
      }
    },
    {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [3.250, 8.343]
      },
      'properties': {
        'title': '100kW Solar Hybrid minigrid in Budo Are community',
        'description': 'Was installed in xxxxx by the xxxxx'
      }
    },
    {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [4.427, 7.318]
      },
      'properties': {
        'title': '24kW Solar minigrid in Onibambu & Idi Ita community',
        'description': 'Was installed in xxxxx by the xxxxx'
      }
    },
    {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [4.455, 6.890]
      },
      'properties': {
        'title': '100kW Solar Hybrid minigrid in Olooji community',
        'description': 'Was installed in 2020 by ACOB'
      }
    },
    {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [4.216, 6.846]
      },
      'properties': {
        'title': '85kW Solar Hybrid minigrid in Gbamu Gbamu community',
        'description': 'Was installed in 2018 by Rubitec Sola'
      }
    },
    {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [3.910, 6.846]
      },
      'properties': {
        'title': '15kW Solar minigrid in OGD Farm E community',
        'description': 'Was installed in xxxxx by the xxxxx'
      }
    },
    {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [4.871, 7.101]
      },
      'properties': {
        'title': '6kW Solar minigrid in Ligun Water Side community',
        'description': 'Was installed in xxxxx by the xxxxx'
      }
    },
    {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [4.545, 6.713]
      },
      'properties': {
        'title': '30kW Solar Hybrid minigrid in Obadoore community',
        'description': 'Was installed in xxxxx by the xxxxx'
      }
    },
    {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [5.692, 6.822]
      },
      'properties': {
        'title': '4kW Solar minigrid in Ofetebe community',
        'description': 'Was installed in 2013 by F-SGP;UNDP'
      }
    },
    {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [4.794, 6.157]
      },
      'properties': {
        'title': '30kW Solar Hybrid minigrid in Ugbonla community',
        'description': 'Was installed in 2021 by A4& T Power Solution'
      }
    },
    {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [4.965, 5.957]
      },
      'properties': {
        'title': '15kW Solar minigrid in Gbagira community',
        'description': 'Was installed in 2019 by A4 &T Power Solutions'
      }
    },
    {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [5.103, 6.394]
      },
      'properties': {
        'title': '100kW Solar Hybrid minigrid in Adebayo community',
        'description': 'Was installed in 2021 by ACOB'
      }
    },
    {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [5.692, 6.339]
      },
      'properties': {
        'title': '24kW Solar minigrid in Ogbekpen, Ikpoba community',
        'description': 'Was installed in 2016 by the Arnergy Solar'
      }
    },
    {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [5.592, 6.174]
      },
      'properties': {
        'title': '24kW Solar minigrid in Obayantor community',
        'description': 'Was installed in xxxxx by the xxxxx'
      }
    },
    {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [5.992, 6.674]
      },
      'properties': {
        'title': '2kW Solar minigrid in Uniarho community',
        'description': 'Was installed in xxxxx by the xxxxx'
      }
    },
    {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [6.697, 6.505]
      },
      'properties': {
        'title': '27kW Solar minigrid in Okpechalla/Atachile community',
        'description': 'Was installed in xxxxx by the xxxxx'
      }
    },
    {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [6.747, 6.305]
      },
      'properties': {
        'title': '80kW Solar minigrid in Onono-Anam Phase 2 community',
        'description': 'Was installed in xxxxx by the xxxxx'
      }
    },
    {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [8.222, 6.105]
      },
      'properties': {
        'title': '100kW Solar Hybrid minigrid in Eka Awoke community',
        'description': 'Was installed in 2020 by Cloud Energy'
      }
    },
    {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [7.779, 6.305]
      },
      'properties': {
        'title': '33kW Solar Hybrid minigrid in Umuntumuna Obeagu Isu community',
        'description': 'Was installed in 2018 by Zylab Technologies Nigeria Ltd'
      }
    },
    {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [7.749, 6.305]
      },
      'properties': {
        'title': '66kW Solar Hybrid minigrid in Orie Obeagu Isu community',
        'description': 'Was installed in 2018 by Zylab Technologies Nigeria Ltd'
      }
    },
    {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [8.082, 5.319]
      },
      'properties': {
        'title': '50kW Solar minigrid in Umon Island community',
        'description': 'Was installed in 2017 by Nayo Technologies Ltd'
      }
    },
    {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [8.782, 6.319]
      },
      'properties': {
        'title': '18kW Solar minigrid in Esham community',
        'description': 'Was installed in xxxxx by the xxxxx'
      }
    },
    {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [7.868, 4.619]
      },
      'properties': {
        'title': '80kW Solar Hybrid minigrid in Akpabom community',
        'description': 'Was installed in 2019 by GVE'
      }
    },
    {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [7.139, 5.076]
      },
      'properties': {
        'title': '11kW Solar minigrid in Umuokwu community',
        'description': 'Was installed in xxxxx by the xxxxx'
      }
    },
    {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [7.061, 5.046]
      },
      'properties': {
        'title': '11kW Solar minigrid in Umuode community',
        'description': 'Was installed in xxxxx by the xxxxx'
      }
    },
    {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [7.081, 5.096]
      },
      'properties': {
        'title': '7kW Solar minigrid in Umuagwu community',
        'description': 'Was installed in xxxxx by the xxxxx'
      }
    },
    {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [7.179, 5.186]
      },
      'properties': {
        'title': '52kW Solar minigrid in Egbeke (Upgraded) community',
        'description': 'Was installed in 2012 by GVE'
      }
    },
    {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [6.324, 4.630]
      },
      'properties': {
        'title': '67kW Solar Hybrid minigrid in Akipelai community',
        'description': 'Was installed in 2020 by Renewvia Energy'
      }
    },
    {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [6.279, 4.680]
      },
      'properties': {
        'title': '67kW Solar Hybrid minigrid in Oloibri community',
        'description': 'Was installed in 2020 by Renewvia Energy'
      }
    }
    
    // Add all other minigrid points here...
  ]
};

const MapComponent = ({ token }) => {
  const mapContainerRef = useRef(null);

  useEffect(() => {
    mapboxgl.accessToken = token;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [8.84449, 8.17349],
      zoom: 5
    });

    map.addControl(new mapboxgl.NavigationControl(), 'top-right');

    map.on('load', () => {
      // Add source for states
      map.addSource('states', {
        'type': 'geojson',
        'data': 'https://api.maptiler.com/data/f3595596-b0f2-4649-8577-6c34ebeafb89/features.json?key=nOBwBWHrMl0UpUMsjHCF'
      });

      // Add layer for state fills
      map.addLayer({
        'id': 'state-fills',
        'type': 'fill',
        'source': 'states',
        'layout': {},
        'paint': {
          'fill-color': '#627BC1',
          'fill-opacity': ['case', ['boolean', ['feature-state', 'hover'], false], 0.5, 0.3]
        }
      });

      // Add layer for state borders
      map.addLayer({
        'id': 'state-borders',
        'type': 'line',
        'source': 'states',
        'layout': {},
        'paint': {
          'line-color': '#627BC1',
          'line-width': 2
        }
      });

      // Add state labels
      map.addLayer({
        'id': 'state-labels',
        'type': 'symbol',
        'source': 'states',
        'layout': {
          'text-field': ['get', 'name'],
          'text-variable-anchor': ['center'],
          'text-radial-offset': 0.5,
          'text-justify': 'auto',
          'text-size': 12
        },
        'paint': {
          'text-color': '#000000',
          'text-halo-color': '#ffffff',
          'text-halo-width': 1
        }
      });

      // Add source and layer for minigrids
      map.addSource('minigrids', {
        'type': 'geojson',
        'data': minigridsData
      });

      map.addLayer({
        'id': 'minigrids',
        'type': 'circle',
        'source': 'minigrids',
        'paint': {
          'circle-radius': 5,
          'circle-color': '#2251ff'
        }
      });

      

      // Add hover effect for states
      let hoveredStateId = null;

      map.on('mousemove', 'state-fills', (e) => {
        if (e.features.length > 0) {
          if (hoveredStateId) {
            map.setFeatureState({ source: 'states', id: hoveredStateId }, { hover: false });
          }
          hoveredStateId = e.features[0].id;
          map.setFeatureState({ source: 'states', id: hoveredStateId }, { hover: true });
        }
      });

      map.on('mouseleave', 'state-fills', () => {
        if (hoveredStateId) {
          map.setFeatureState({ source: 'states', id: hoveredStateId }, { hover: false });
        }
        hoveredStateId = null;
      });

      // Add click event for states
      map.on('click', 'state-fills', (e) => {
        const clickedFeature = e.features[0];
        const bounds = new mapboxgl.LngLatBounds();
        clickedFeature.geometry.coordinates[0].forEach(coord => bounds.extend(coord));
        map.fitBounds(bounds, { padding: 50 });
      });

      // Add popups for minigrids
      map.on('click', 'minigrids', (e) => {
        const coordinates = e.features[0].geometry.coordinates.slice();
        const { title, description } = e.features[0].properties;

        new mapboxgl.Popup()
          .setLngLat(coordinates)
          .setHTML(`
            <div class="popup">
              <h4 class="popup-title">${title}</h4>
              <p class="popup-description">${description}</p>
            </div>
          `)
          .addTo(map);
      });

      // Change cursor on minigrid hover
      map.on('mouseenter', 'minigrids', () => {
        map.getCanvas().style.cursor = 'pointer';
      });

      map.on('mouseleave', 'minigrids', () => {
        map.getCanvas().style.cursor = '';
      });
    });

    return () => map.remove();
  }, [token]);

  return <div ref={mapContainerRef} style={{ width: '100%', height: '500px' }} />;
};

const MiniGridsMap = () => {
  const theme = useTheme();

  return (
    <EnergyComparisonAllStatesDashboardWidgetCard title="Mini Grids Map">
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <MapComponent token="pk.eyJ1IjoibWFydGluc2FuYWx5dGljcyIsImEiOiJjbHpxdXc0MWcxcHd5MmpxdXljc2ZieWJpIn0.t4ZnMZ3-qKEK9DxdE845xw" />
        </Grid>
        <Grid item xs={12} md={4}>
          <Box sx={{ maxHeight: 500, overflow: 'auto' }}>
            {minigridsData.features.map((feature, index) => (
              <Paper key={index} sx={{ margin: 1, padding: 2, backgroundColor: theme.palette.background.paper }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{feature.properties.title}</Typography>
                <Typography variant="body2">{feature.properties.description}</Typography>
              </Paper>
            ))}
          </Box>
        </Grid>
      </Grid>
    </EnergyComparisonAllStatesDashboardWidgetCard>
  );
};
export default MiniGridsMap;