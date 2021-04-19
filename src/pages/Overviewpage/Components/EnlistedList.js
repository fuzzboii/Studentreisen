import React, { useState, useContext} from 'react';
import {EnlistedContext} from './EnlistedContext';
import EnlistedSeminar from './EnlistedSeminar';


const EnlistedList = () => {
    const [enlists, setEnlists] = useContext(EnlistedContext);

    return(
        <div className="seminarSection scrollMd">
        {enlists.length == 0 &&
            <h4 className="no-seminar">Du har ingen påmeldte seminarer...</h4>
            }
        {enlists.map((seminar,i) => (
            <EnlistedSeminar key={i} id={seminar.seminarid} navn={seminar.navn} adresse={seminar.adresse} dato={seminar.oppstart}/>

        ))}
        </div>
    );

};

export default EnlistedList;