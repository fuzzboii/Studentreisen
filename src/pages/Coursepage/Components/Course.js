import React from "react";
import { MyCardContent } from '../Styles/apistyles';
import LanguageIcon from '@material-ui/icons/Language';
import SchoolIcon from '@material-ui/icons/School';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import Box from '@material-ui/core/Box';


const Course = (props) => {

    return (
            <Box className='course-section' boxShadow={1}>
                <MyCardContent>
                    <div className="course-sectionTop">             
                        <p className="kursnavn">{props.navn}</p>
                        <div className="kursinfo">
                            <p>{props.emnekode}</p>
                            <div className="iconBox">
                                <CalendarTodayIcon className="language-icon2" fontSize="inherit"/>
                                <p>{props.semester}</p>
                            </div>
                            <div className="iconBox">
                                <SchoolIcon className="language-icon2" fontSize="inherit"/>
                                <p>{props.studiepoeng}</p>
                            </div>
                        </div>
                    </div>
                    <div className="iconBox">
                        <LanguageIcon className="language-icon" fontSize="inherit"/>
                        <p className="undervisningsspråk">{props.språk}</p>
                    </div>
                </MyCardContent>
            </Box>
        
    );
};

export default Course;
/*<p className="kursbeskrivelse">{props.beskrivelse}</p> */