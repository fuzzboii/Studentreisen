import React from "react";

const Course = (props) => {
    return (
        <div className="courseBox">
            <p>{props.emnekode}</p>
            <p>{props.navn}</p>
            <p>{props.beskrivelse}</p>
            <p>{props.semester}</p>
            <p>{props.studiepoeng}</p>
            <p>{props.lenke}</p>
        </div>
    );
};

export default Course;