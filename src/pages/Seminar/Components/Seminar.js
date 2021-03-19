import React from "react";

const Seminar = (props) => {
    return (
        <div className="seminarBox">
            <p>{props.seminarid}</p>
            <p>{props.bildeid}</p>
            <p>{props.navn}</p>
            <p>{props.arrangor}</p>
            <p>{props.adresse}</p>
            <p>{props.oppstart}</p>
            <p>{props.varighet}</p>
            <p>{props.beskrivelse}</p>
            <p>{props.tilgjengelighet}</p>
        </div>
    );
};

export default Seminar;