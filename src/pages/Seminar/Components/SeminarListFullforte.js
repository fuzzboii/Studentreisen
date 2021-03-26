import React, { useState, useContext } from 'react';
import SeminarFullforte from './SeminarFullforte';
import { SeminarFullfortContext } from './SeminarContext';
import '../CSS/Seminar.css'; 

const SeminarListFullforte = () => {
    const [seminars, setSeminars] = useContext(SeminarFullfortContext);

    return (
        <div className="seminar-list" >
            <h1 className="SeminarHeading">Fullførte seminarer</h1>
            {seminars.map(seminar => (
                <SeminarFullforte seminarid={seminar.seminarid} bildeid={seminar.bildeid} navn={seminar.navn} arrangor={seminar.arrangor} adresse={seminar.adresse} oppstart={seminar.oppstart} varighet={seminar.varighet} beskrivelse={seminar.beskrivelse} tilgjengelighet={seminar.tilgjengelighet} plassering={seminar.plassering} />
            ))}
        </div>
    );
}

export default SeminarListFullforte;