import React from "react";
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';


const Course = (props) => {

    return (
        <Paper>
    
            <p>{props.emnekode}</p>
            <p>{props.navn}</p>
            <p>{props.beskrivelse}</p>
            <p>{props.semester}</p>
            <p>{props.studiepoeng}</p>
            <p>{props.lenke}</p>
        
        </Paper>
    );
};

export default Course;