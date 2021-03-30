// React spesifikt
import React, { useState, useContext } from 'react';

// 3rd-party Packages

// Studentreisen-assets og komponenter
import SeminarKommende from './SeminarKommende';
import '../CSS/Seminar.css'; 

const SeminarListKommende = ({seminarsKommende}) => {
    return (
        <div className="seminar-list" >
            <h1 className="SeminarHeading">Kommende seminarer</h1>
            {seminarsKommende.map(seminar => (
                <SeminarKommende key={seminar.seminarid} seminarid={seminar.seminarid} bildeid={seminar.bildeid} navn={seminar.navn} arrangor={seminar.arrangor} adresse={seminar.adresse} oppstart={seminar.oppstart} varighet={seminar.varighet} beskrivelse={seminar.beskrivelse} tilgjengelighet={seminar.tilgjengelighet} plassering={seminar.plassering} />    
            ))}
        </div>
    );
}

export default SeminarListKommende;