import React, { useState, useContext } from 'react';
import Seminar from './Seminar';
import { SeminarContext } from './SeminarContext';
import '../CSS/Seminar.css'; 

const SeminarList = () => {
    const [seminars, setSeminars] = useContext(SeminarContext);

    return (
        <div className="seminar-list" >
            <h1 className="SeminarHeading">Seminarer</h1>
            {seminars.map(seminar => (
                <Seminar seminarid={seminar.seminarid} bildeid={seminar.bildeid} navn={seminar.navn} arrangor={seminar.arrangor} adresse={seminar.adresse} oppstart={seminar.oppstart} varighet={seminar.varighet} beskrivelse={seminar.beskrivelse} tilgjengelighet={seminar.tilgjengelighet} />
            ))}
        </div>
    );
}

export default SeminarList;