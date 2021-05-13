// React spesifikt
import React, { useState, useContext } from 'react';

// 3rd-party Packages

// Studentreisen-assets og komponenter
import SeminarUpcoming from './SeminarUpcoming';
import '../CSS/Seminar.css'; 

const SeminarListUpcoming = ({seminarsUpcoming, enlists, innloggetbruker}) => {
    return (
        <div className="seminar-list" >
            <h1 className="SeminarHeading">Kommende seminarer</h1>
            {seminarsUpcoming.map(seminar => (
                <SeminarUpcoming key={seminar.seminarid} enlists={enlists} innloggetbruker={innloggetbruker} seminarid={seminar.seminarid} bildeid={seminar.bildeid} navn={seminar.navn} brukerid={seminar.brukerid} adresse={seminar.adresse} oppstart={seminar.oppstart} varighet={seminar.varighet} beskrivelse={seminar.beskrivelse} tilgjengelighet={seminar.tilgjengelighet} plassering={seminar.plassering} fnavn={seminar.fnavn} enavn={seminar.enavn} />    
            ))}
        </div>
    );
}

export default SeminarListUpcoming;