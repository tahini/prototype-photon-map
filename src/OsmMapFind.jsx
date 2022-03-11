import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import React, { useState } from 'react';
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import OsmMapInputSearch from './OsmMapInputSearch';

// setup
const provider = new OpenStreetMapProvider();

// search
//const results = await provider.search({ query: input.value });

const defaultPosition = [45.460672, -73.57277];

// search
const queryOsm = async (value, { lat, lng }, zoom, locationBias) => {
  const response = await fetch(`http://localhost:2322/api?q=${value}&lon=${lng}&lat=${lat}${zoom > 0 ? `&zoom=${zoom}` : ''}&location_bias_scale=${locationBias}`, {
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

function getPopupText(properties) {
  let text = '';
  let altText = '';
  if (properties.name) {
    text += `<b>${properties.name}</b>`;
  }
  if (properties.housenumber && properties.street) {
    altText += `${properties.housenumber} ${properties.street}${properties.city ? `, ${properties.city}` : ''}${properties.country ? `, ${properties.country}` : ''}`
  }
  return text !== '' && altText !== '' ? `${text}<br/>${altText}` : text !== '' ? text : altText;
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
    const results = await queryOsm(value, position, useZoom ? zoom : -1, locationBiasScale);
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
                {getPopupText(result.properties)}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </React.Fragment>
  );
}

export default OsmMapFind;
