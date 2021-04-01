import React, { useState, useContext} from 'react';

import Module from './Module';
import { ModuleContext } from './CourseContext';

const ModuleList = () => {
    const [modules, setModules] = useContext(ModuleContext);

    return (
        <div className="">
            {modules.map(mod => (
                    <Module modulkode={mod.modulkode} studietype={mod.studietype} navn={mod.navn} beskrivelse={mod.beskrivelse} campus={mod.campus} studiepoeng={mod.studiepoeng} lenke={mod.lenke}/>
            ))}
        </div>
    );
}

export default ModuleList;