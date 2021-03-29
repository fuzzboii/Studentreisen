import React from "react";
import { MyCardContent } from '../Styles/apistyles';
import Box from '@material-ui/core/Box';


const Module = (props) => {

    return (
            <Box className='module-section' boxShadow={1}>
                <MyCardContent>
                    <div className="course-sectionTop">             
                        <p className="kursnavn">{props.navn}</p>
                        <div className="kursinfo">
                            <p>{props.modulkode}</p>
                                <p>{props.studietype}</p>
                                <p>{props.beskrivelse}</p>
                        </div>
                    </div>
                        <p className="undervisningsspråk">{props.lenke}</p>
                </MyCardContent>
            </Box>
        
    );
};

export default Module;