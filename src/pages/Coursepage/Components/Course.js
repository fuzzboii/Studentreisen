import React from "react";
import { MyCard, MyCardContent, MyContainer } from '../Styles/apistyles';
import LanguageIcon from '@material-ui/icons/Language';
import '../Styles/courseStyles.css';

const Course = (props) => {

    return (
        <div className="course-section">
                <MyCardContent>
                    <div className="course-sectionTop">             
                        <p className="kursnavn">{props.navn}</p>
                        <div className="kursinfo">
                            <p>{props.emnekode}</p>
                            <p>{props.semester}</p>
                            <p>{props.studiepoeng}</p>
                        </div>
                    </div>
                    <div className="iconBox">
                        <LanguageIcon/>
                        <p className="undervisningsspråk">Undervisningsspråk: {props.språk}</p>
                    </div>
                </MyCardContent>
        </div>
    );
};

export default Course;
/*<p className="kursbeskrivelse">{props.beskrivelse}</p> */