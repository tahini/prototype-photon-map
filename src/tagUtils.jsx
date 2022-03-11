import React from "react";

export function Properties({properties}) {
    return (
        <React.Fragment>
            {properties.name && properties.housenumber && properties.street &&
            <div>
                <b>{properties.name}</b>
                <br/>
                {properties.housenumber} {properties.street}{properties.city ? `, ${properties.city}` : ''}{properties.country ? `, ${properties.country}` : ''}
            </div>
            }
            {properties.name && !(properties.housenumber && properties.street) &&
            <div>
                <b>{properties.name}</b>
            </div>
            }
            {!properties.name && (properties.housenumber && properties.street) &&
            <div>
                {properties.housenumber} {properties.street}{properties.city ? `, ${properties.city}` : ''}{properties.country ? `, ${properties.country}` : ''}
            </div>
            }
        </React.Fragment>
    );
}