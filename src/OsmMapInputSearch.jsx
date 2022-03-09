import React from 'react';


// search
const queryOsm = async (value, center) => {
    const response = await fetch(`http://localhost:2322/api?q=${value}&lon=${center[0]}&lat=${center[1]}`, {
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

function OsmMapInputSearch({setResults, lat, lon}) {
    const updateResults = async (value) => {
        const results = await queryOsm(value, [lon, lat]);
        console.log(results);
        setResults(results);
    }
    return (
        <React.Fragment>
            <label htmlFor="mapText">Recherche: </label>
            <input 
                id="mapText" 
                type="text"
                onChange={(e) => updateResults(e.target.value)}/>
        </React.Fragment>
    );
}

export default OsmMapInputSearch;
