import React from 'react';
import { Properties } from './tagUtils';


function OsmMapInputSearch({setValue, value, useZoom, setUseZoom, locationBiasScale, setLocationBiasScale, hints, setHintValue}) {
    const hintStr = hints.map((hint, index) => (
        <div
            key={`${hint.properties.osm_id}_${index}`}
            onClick={(e) => {
                setValue(`${hint.properties.name ? hint.properties.name : ''} ${hint.properties.housenumber ? hint.properties.housenumber : ''} ${hint.properties.street ? hint.properties.street : ''} ${hint.properties.city ? hint.properties.city : ''}`);
            }}
        >
            <Properties properties={hint.properties}/>
        </div>)
    );
    return (
        <div >
            {hintStr}
            <label htmlFor="mapText">Recherche: </label>
            <input 
                id="mapText" 
                type="text"
                onKeyUp={(e) => { 
                    if(e.key === 'Enter'){
                        setValue(e.target.value);
                    } else {
                        setHintValue(e.target.value);
                    } 
                }}
                key={`input${value}`}
                defaultValue={value}/>
            <label htmlFor="useZoom">Utiliser le zoom </label>
            <input 
                id="useZoom" 
                type="checkbox"
                checked={useZoom}
                onChange={(e) => { 
                    setUseZoom(!useZoom);
                }}/>
            <input 
                id="location_bias_scale" 
                type="range" 
                min="0" max="1" 
                value={locationBiasScale} 
                onChange={(e) => {
                    setLocationBiasScale(e.target.value);
                }}
                step="0.05"/>
        </div>
    );
}

export default OsmMapInputSearch;
