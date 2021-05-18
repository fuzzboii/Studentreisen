// React spesifikt
import React, { useState, useContext} from 'react';
import Module from './Module';

// Komponent for å mappe antall kursmodul i useStaten og lenke til et spesifikk kursmodul, data'en blir overført fra CourseNav.
const ModuleList = ({modules}) => {

    return (
        <div className="modulesList">
            {modules.map(mod => (
                <Module key={mod.modulkode} modulkode={mod.modulkode} studietype={mod.studietype} navn={mod.navn} beskrivelse={mod.beskrivelse} campus={mod.campus} studiepoeng={mod.studiepoeng} lenke={mod.lenke}/>
            ))}
        </div>
    );
}

export default ModuleList;