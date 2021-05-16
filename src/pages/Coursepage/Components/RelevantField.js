// React spesifikt
import React, {useState} from "react";
import {Link} from 'react-router-dom';

// Studentreisen-assets og komponenter
import Box from '@material-ui/core/Box';
import CardContent from '@material-ui/core/CardContent';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import {makeStyles} from '@material-ui/core/styles';

// Styling for Material Design komponenter
const useStyles = makeStyles((theme) => ({
    link: {
        display: 'flex',
        fontSize: '14px',
      
    },
    icon: {
      marginRight: theme.spacing(0),
      paddingTop: theme.spacing(0.3),
      height: 15,
      width: 15,
    },
  }));

// Komponent for å gi forslag om andre fagområder, data'en blir overført fra CourseNav og RelevantField
const RelevantField = (props) => {

    // Hook for å få tilgang på styling
    const classes = useStyles();
    
    return(
            <Box className="relevance-list" boxShadow={1}>
                <CardContent>
                    <h3 className="relevanceHeader">Relevante fagfelt</h3>
                    {props.fields !== undefined &&
                    <>
                    {props.fields.map( (field, index) => (
                        <Link key={index} className="link2 linkFlex" to={`/course/field/${field.beskrivelse}`}>
                            <ArrowForwardIosIcon className={classes.icon}/>
                            <p className="fieldFormat" key={index}>{field.beskrivelse}</p>
                        </Link>
                    ))}
                    </>
                    }
                </CardContent>
            </Box>
        
    );  
};

export default RelevantField;