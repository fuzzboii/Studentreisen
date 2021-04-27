import React, {useState} from "react";
import {Link} from 'react-router-dom';
import Box from '@material-ui/core/Box';
import CardContent from '@material-ui/core/CardContent';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import {makeStyles} from '@material-ui/core/styles';

const RelevantField = (props) => {
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

    const classes = useStyles();
    
    return(
            <Box className="relevance-list" boxShadow={1}>
                <CardContent>
                    <h3 className="relevanceHeader">Relevante fagfelt</h3>
                    {props.fields !== undefined &&
                    <>
                    {props.fields.map( (field, index) => (
                        <Link key={index} className="link2 linkFlex" to={`/course/felt=${field.beskrivelse}`}>
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