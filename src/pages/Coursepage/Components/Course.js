import React from "react";
import Box from '@material-ui/core/Box';
import CardContent from '@material-ui/core/CardContent';
import LanguageIcon from '@material-ui/icons/Language';
import SchoolIcon from '@material-ui/icons/School';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';



const Course = (props) => {

    return (
            <Box className='course-section' boxShadow={1}>
                <CardContent>
                    <div className="course-sectionTop">             
                        <p className="kursnavn">{props.navn}</p>
                        <p className="kurskode">{props.emnekode}</p>
                    </div>
                    <div className="kursinfo">
                            <div className="iconBox">
                                <LanguageIcon className="language-icon" fontSize="inherit"/>
                                <p className="undervisningsspråk">{props.språk}</p>
                            </div>
                            <div className="iconBox">
                                <CalendarTodayIcon className="language-icon2" fontSize="inherit"/>
                                <p>{props.semester}</p>
                            </div>
                            <div className="iconBox">
                                <SchoolIcon className="language-icon2" fontSize="inherit"/>
                                <p>{props.studiepoeng}</p>
                            </div>
                        </div>
                </CardContent>
            </Box>
        
    );
};

export default Course;
/*<p className="kursbeskrivelse">{props.beskrivelse}</p> */