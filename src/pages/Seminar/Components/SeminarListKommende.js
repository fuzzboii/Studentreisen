import React, { useState, useContext } from 'react';
import {Link} from 'react-router-dom';
import SeminarKommende from './SeminarKommende';
import { SeminarContext } from './SeminarContext';

import '../CSS/Seminar.css'; 

const SeminarListKommende = () => {
    const [seminars, setSeminars] = useContext(SeminarContext);

    return (
        <div className="seminar-list" >
            <h1 className="SeminarHeading">Kommende seminarer</h1>
            {seminars.map(seminar => (
                <Link className='link' to={`/seminarkommende/${seminar.seminarid}`}>
                    <SeminarKommende key={seminar.seminarid} seminarid={seminar.seminarid} bildeid={seminar.bildeid} navn={seminar.navn} arrangor={seminar.arrangor} adresse={seminar.adresse} oppstart={seminar.oppstart} varighet={seminar.varighet} beskrivelse={seminar.beskrivelse} tilgjengelighet={seminar.tilgjengelighet} plassering={seminar.plassering} />    
                </Link>    
            ))}
        </div>
    );
}

export default SeminarListKommende;