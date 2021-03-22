import React from "react";

import { SeminarCard, SeminarCardActionArea, SeminarCardContent, SeminarCardMedia, SeminarTypography, SeminarCardActions, SeminarButton, SeminarAccordion, SeminarAccordionSummary, SeminarAccordionDetails, SeminarExpandMoreIcon } from '../CSS/apistylesSeminar';
import '../CSS/Seminar.css'; 
import moment from 'moment';
import 'moment/locale/nb';


const Seminar = (props) => {
    const [width, setWidth] = React.useState(window.innerWidth);
    const breakpoint = 720;
    React.useEffect(() => {
        const handleResizeWindow = () => setWidth(window.innerWidth);

        window.addEventListener("resize", handleResizeWindow);
        return () => {
        window.removeEventListener("resize", handleResizeWindow);
        };
    }, []);

    if (width < breakpoint) {
        return (
            <div className="Seminar-Mobile">
            <SeminarAccordion>
                <SeminarAccordionSummary expandIcon={<SeminarExpandMoreIcon />} aria-controls="panel1a-content" id="Seminar-AccordionSummary">
                    <div className="Seminar-HeaderContent">
                        <div className="Seminar-Oppstart">{moment.locale('nb'), moment(props.oppstart).format("MMM DD YYYY")}</div>
                        <div className="Seminar-Navn">{props.navn}</div>   
                    </div>
                </SeminarAccordionSummary>
                <SeminarAccordionDetails className="Seminar-AccordationDetails">
                    <div className="Seminar-beskrivelse">{props.beskrivelse}</div>
                    <SeminarCardActions className="Seminar-CardActions">
                        <SeminarButton className="Seminar-buttonPaameld" size="small" color="primary">
                        Påmeld
                        </SeminarButton>
                        <SeminarButton className="Seminar-buttonLes" size="small" color="default">
                        Les mer..
                        </SeminarButton>

                    </SeminarCardActions>
                </SeminarAccordionDetails>
            </SeminarAccordion>
            </div>
        );
        }
        return (
            <div className="Seminar-Desktop">
            <SeminarCard className="Seminar-Cards">
                <SeminarCardActionArea>
                    <SeminarCardMedia/>
                    <SeminarCardContent className="Seminar-CardContent">
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
                <SeminarCardActions className="Seminar-CardActions">
                    <SeminarButton className="Seminar-buttonPaameld" size="small" color="primary">
                        Påmeld
                    </SeminarButton>
                </SeminarCardActions>
            </SeminarCard>
            </div>
        );
}


export default Seminar;