// React spesifikt
import React, { useState, useContext} from 'react';

// Studentreisen-assets og komponenter
import {EnlistedContext} from './EnlistedContext';
import EnlistedSeminar from './EnlistedSeminar';


// Komponent for å mappe antall seminarer i en useState
const EnlistedList = () => {

    // Henter data som blir overført gjennom EnlistedProvider i EnlistedContext
    const [enlists, setEnlists] = useContext(EnlistedContext);

    return(
        <div className="seminarSection scrollMd">
        {enlists.length == 0 &&
            <h2 className="no-seminar">Du har ingen påmeldte seminarer...</h2>
            }
        {enlists.map((seminar,i) => (
            <EnlistedSeminar key={i} id={seminar.seminarid} navn={seminar.navn} adresse={seminar.adresse} dato={seminar.oppstart}/>

        ))}
        </div>
    );

};

export default EnlistedList;