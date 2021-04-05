import React from "react";
import {Link} from 'react-router-dom';
import { MyCardContent } from '../Styles/apistyles';

import Box from '@material-ui/core/Box';
import SchoolIcon from '@material-ui/icons/School';
import PlaceIcon from '@material-ui/icons/Place';
import ImportContactsIcon from '@material-ui/icons/ImportContacts';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';


const Module = (props) => {

    return (
    
        <Box className='module-section' boxShadow={1}>
            <Link className='link' to={`/course/modulkode=${props.modulkode}`}> 
                <MyCardContent>
                    <div className="moduleBody"> 

                        <div className="header">            
                            <h1 className="kursnavn">{props.navn}</h1>
                            <p>{props.modulkode}</p>
                        </div>

                        <p className="modulbeskrivelse">{props.beskrivelse}</p> 

                    </div>
                    <div className="moduleWrap">

                        <div className="iconBoxMod">
                            <AccountBalanceIcon className="position-icon" fontSize="inherit"/>
                            <p>{props.studietype}</p>
                        </div>

                        <div className="iconBoxMod">
                            <PlaceIcon className="position-icon" fontSize="inherit"/>
                            <p>{props.campus}</p>
                        </div>          

                        <div className="iconBoxMod">
                            <SchoolIcon className="position-icon" fontSize="inherit"/>
                            <p>{props.studiepoeng}</p>
                        </div>

                    </div>
                </MyCardContent>
            </Link>
        </Box>
    
        
    );
};

export default Module;