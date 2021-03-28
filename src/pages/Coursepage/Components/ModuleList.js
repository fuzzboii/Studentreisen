import React, { useState, useContext} from 'react';
import {Link} from 'react-router-dom';
import Module from './Module';
import { ModuleContext } from './CourseContext';

const ModuleList = () => {
    const [modules, setModules] = useContext(ModuleContext);

    return (
        <div className="module-list">
            {modules.map(mod => (       
                <Link className='link' to={`/course/${mod.modulkode}`}>   
                    <Module modulkode={mod.modulkode} studietype={mod.studietype} navn={mod.navn} beskrivelse={mod.beskrivelse} lenke={mod.lenke}/>
                </Link>
            ))}
        </div>
    );
}

export default ModuleList;