import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import React, { useState } from 'react';
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import OsmMapInputSearch from './OsmMapInputSearch';
import { Properties } from './tagUtils';

// setup
const provider = new OpenStreetMapProvider();

// search
//const results = await provider.search({ query: input.value });

const defaultPosition = [45.460672, -73.57277];

// search
const queryOsm = async (value, { lat, lng }, zoom, locationBias, fuzziness = 1) => {
  const response = await fetch(`http://localhost:2322/api?q=${value}&fuzziness=${fuzziness}&lon=${lng}&lat=${lat}&osm_tag=!highway${zoom > 0 ? `&zoom=${zoom}` : ''}&location_bias_scale=${locationBias}`, {
      mode: 'cors',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
  });
  const json = await response.json();
  if (json.type === 'FeatureCollection') {
      return json.features;
  }
  return [];
}

function OsmMapFind() {
  const [results, setResults] = useState([]);
  const [hints, setHints] = useState([]);
  const [position, setPosition] = useState({ lat:defaultPosition[0], lng: defaultPosition[1] });
  const [zoom, setZoom] = useState(13);
  const [value, setValue] = useState("");
  const [hintValue, setHintValue] = useState("");
  const [useZoom, setUseZoom] = useState(true);
  const [locationBiasScale, setLocationBiasScale] = useState(0.2);

  React.useEffect(async () => {
    const results = await queryOsm(value, position, useZoom ? zoom : -1, locationBiasScale, 0);
    console.log(results);
    setResults(results);
  }, [value, locationBiasScale, useZoom, position, zoom]);

  React.useEffect(async () => {
    const results = await queryOsm(hintValue, position, useZoom ? zoom : -1, locationBiasScale);
    console.log(results);
    setHints(results);
  }, [hintValue, locationBiasScale, useZoom, position, zoom]);

  function MapStateWatcher() {
    const map = useMapEvents({
      zoomend(e) {
        console.log("zoomed");
          setZoom(map.getZoom());
      },
      moveend(e) {
        console.log("moved");
          setPosition(map.getCenter());
      }
    });
    return null;
  }

  return (
      <React.Fragment>
        <OsmMapInputSearch 
          setValue={setValue} 
          useZoom={useZoom}
          setUseZoom={setUseZoom}
          locationBiasScale={locationBiasScale}
          setLocationBiasScale={setLocationBiasScale}
          setHintValue={setHintValue}
          hints={hints}
          value={value}
        />
        <MapContainer 
          center={defaultPosition} 
          zoom={13} 
          scrollWheelZoom={true}>
          
          <MapStateWatcher/>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          {results.map((result, index) => (
            <Marker
              key={`marker-${index}`}
              position={[result.geometry.coordinates[1], result.geometry.coordinates[0]]}
            >
              <Popup>
                <Properties properties={result.properties}/>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </React.Fragment>
  );
}

export default OsmMapFind;
