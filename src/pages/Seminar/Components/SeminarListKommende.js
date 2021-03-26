import React, { useState, useContext } from 'react';
import SeminarKommende from './SeminarKommende';
import { SeminarContext } from './SeminarContext';
import '../CSS/Seminar.css'; 

const SeminarListKommende = () => {
    const [seminars, setSeminars] = useContext(SeminarContext);

    return (
        <div className="seminar-list" >
            <h1 className="SeminarHeading">Kommende seminarer</h1>
            {seminars.map(seminar => (
                <SeminarKommende seminarid={seminar.seminarid} bildeid={seminar.bildeid} navn={seminar.navn} arrangor={seminar.arrangor} adresse={seminar.adresse} oppstart={seminar.oppstart} varighet={seminar.varighet} beskrivelse={seminar.beskrivelse} tilgjengelighet={seminar.tilgjengelighet} plassering={seminar.plassering} />
            ))}
        </div>
    );
}

export default SeminarListKommende;