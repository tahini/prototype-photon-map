import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import React, { useState } from 'react';
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import OsmMapInputSearch from './OsmMapInputSearch';

// setup
const provider = new OpenStreetMapProvider();

// search
//const results = await provider.search({ query: input.value });

const defaultPosition = [45.460672, -73.57277];

function OsmMapFind() {
  const [results, setResults] = useState([]);
  const [position, setPosition] = useState(defaultPosition);
  const [zoom, setZoom] = useState(13);
  
  const onZoomEnd = (ev) => {
    console.log(ev);
  }

  const onMoveEnd = (ev) => {
    console.log(ev);
  }

  return (
      <React.Fragment>
        <OsmMapInputSearch setResults={setResults} lat={position[0]} lon={position[1]}/>
        <MapContainer 
          center={position} 
          zoom={zoom} 
          scrollWheelZoom={true}>
            
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          {results.map(result => (
            <Marker
              key={result.properties.osm_id}
              position={[result.geometry.coordinates[1], result.geometry.coordinates[0]]}
            >
              <Popup>
                {`${result.properties.name}`}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </React.Fragment>
  );
}

export default OsmMapFind;
