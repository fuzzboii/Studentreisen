import React, { useState, useContext} from 'react';

import Module from './Module';

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