import React from "react";
//import { SeminarButton, SeminarCard, SeminarCardActions, SeminarCardActionArea, SeminarCardContent, SeminarCardMedia, SeminarTypography } from '../CSS/apistylesSeminar';
import { SeminarCardActions, SeminarButton, SeminarAccordion, SeminarAccordionSummary, SeminarAccordionDetails, SeminarExpandMoreIcon } from '../CSS/apistylesSeminar';
import '../CSS/Seminar.css'; 
import moment from 'moment';
import 'moment/locale/nb';


const Seminar = (props) => {
    
    return (
        <div className="Seminar-Accordation">
            <SeminarAccordion>
                <SeminarAccordionSummary expandIcon={<SeminarExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
                        <div className="Seminar-Oppstart">{moment.locale('nb'), moment(props.oppstart).format("MMM DD YYYY")}</div>
                        <div className="Seminar-Navn">{props.navn}</div>   
                </SeminarAccordionSummary>
                <SeminarAccordionDetails className="Seminar-AccordationDetails">
                    <div className="Seminar-beskrivelse">{props.beskrivelse}</div>
                    <SeminarCardActions className="Seminar-CardActions">

                        <SeminarButton className="Seminar-buttonPaameld" size="small" color="primary">
                        Påmeld
                        </SeminarButton>
                    </SeminarCardActions>
                </SeminarAccordionDetails>
            </SeminarAccordion>
        </div>
        );
    }
/*
    return (
        <SeminarCard>
            <SeminarCardActionArea>
                <SeminarCardMedia/>
                <SeminarCardContent>
                    <SeminarTypography gutterBottom variant="h5" component="h2">
                        <p>{props.navn}</p>
                    </SeminarTypography>
                    <SeminarTypography variant="body2" color="textSecondary" component="p">
                        <p>{props.oppstart}</p>
                        <p>{props.varighet}</p>
                        <p>{props.beskrivelse}</p>
                        <p>{props.arrangor}</p>
                        <p>{props.adresse}</p>
                        <p>{props.tilgjengelighet}</p>
                    </SeminarTypography>
                </SeminarCardContent>
            </SeminarCardActionArea>
            <SeminarCardActions>
                <SeminarButton size="small" color="primary">
                    Rediger
                    </SeminarButton>
                <SeminarButton size="small" color="primary">
                    Påmeld
                </SeminarButton>
            </SeminarCardActions>
        </SeminarCard>


    );
};
*/


export default Seminar;