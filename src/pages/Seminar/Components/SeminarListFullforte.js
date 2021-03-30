// React spesifikt
import React, { useState, useContext } from 'react';
import {Link} from 'react-router-dom';
// 3rd-party Packages

// Studentreisen-assets og komponenter
import SeminarFullforte from './SeminarFullforte';
import '../CSS/Seminar.css'; 

const SeminarListFullforte = ({seminarsFullfort}) => {
    return (
        <div className="seminar-list" >
            <h1 className="SeminarHeading">Fullførte seminarer</h1>
            {seminarsFullfort.map(seminar => (
                <Link className='Seminar-Link' to={`/seminar/seminarfullforte=${seminar.seminarid}`}>
                    <SeminarFullforte key={seminar.seminarid} seminarid={seminar.seminarid} bildeid={seminar.bildeid} navn={seminar.navn} arrangor={seminar.arrangor} adresse={seminar.adresse} oppstart={seminar.oppstart} varighet={seminar.varighet} beskrivelse={seminar.beskrivelse} tilgjengelighet={seminar.tilgjengelighet} plassering={seminar.plassering} />    
                </Link>
                
            ))}
        </div>
    );
}

export default SeminarListFullforte;