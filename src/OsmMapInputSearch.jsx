import React from 'react';


function OsmMapInputSearch({setValue, useZoom, setUseZoom, locationBiasScale, setLocationBiasScale, hints, setHintValue}) {
    const hintStr = hints.map(hint => (<p>{`${hint.properties.name}`}</p>)) || '';
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
                }}/>
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
