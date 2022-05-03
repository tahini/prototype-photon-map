import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import React, { useState } from 'react';
import OsmMapInputSearch from './OsmMapInputSearch';
import { Properties } from './tagUtils';

const PHOTON_URL = 'https://photon.transition.city';
// const PHOTON_URL = 'http://localhost:2322';

const defaultPosition = [45.460672, -73.57277];

let queryId = 0;

// search
const queryOsm = async (value, { lat, lng }, zoom, locationBias, fuzziness = 1) => {
  const response = await fetch(`${PHOTON_URL}/api?q=${value}&fuzziness=${fuzziness}&lon=${lng}&lat=${lat}&debug=1&osm_tag=!highway${zoom > 0 ? `&zoom=${Math.min(zoom, 16)}` : ''}&location_bias_scale=${locationBias}`, {
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
  const [position, setPosition] = useState({ lat:defaultPosition[0], lng: defaultPosition[1] });
  const [zoom, setZoom] = useState(13);
  const [value, setValue] = useState("");
  const [useZoom, setUseZoom] = useState(true);
  const [locationBiasScale, setLocationBiasScale] = useState(0.2);
  const [id, setId] = useState(1);

  React.useEffect(async () => {
    const localQueryId = ++queryId;
    const results = await queryOsm(value, position, useZoom ? zoom : -1, locationBiasScale);
    if (localQueryId !== queryId) {
      return;
    }
    console.log(results);
    setResults(results);
  }, [value, locationBiasScale, useZoom, id]);

  function MapStateWatcher() {
    let zooming = false;
    const map = useMapEvents({
      zoomend(e) {
          zooming = true;
          // console.log("zoomed");
          setZoom(map.getZoom());
      },
      moveend(e) {
          if (!zooming) {
            setPosition(map.getCenter());
          }
          zooming = false;
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
          value={value}
          hints={results}
          id = {id}
          setId = {setId}
          setResults={setResults}
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
