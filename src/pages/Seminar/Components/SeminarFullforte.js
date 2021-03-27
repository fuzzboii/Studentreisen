import React from "react";
import { SeminarCard, SeminarCardActionArea, SeminarCardContent, SeminarCardMedia, SeminarTypography, SeminarCardActions, SeminarButton, SeminarAccordion, SeminarAccordionSummary, SeminarAccordionDetails, SeminarExpandMoreIcon } from '../CSS/apistylesSeminar';
import '../CSS/Seminar.css'; 
import moment from 'moment';
import 'moment/locale/nb';
import DateRangeIcon from '@material-ui/icons/DateRange';

const SeminarFullforte = (props) => {
    const [width, setWidth] = React.useState(window.innerWidth);
    const breakpoint = 1023;
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
                        <h2 className="Seminar-Navn">{props.navn}</h2> 
                        <p className="Seminar-OppstartVarighet">{moment.locale('nb'), moment(props.oppstart).format("MMM DD YYYY, hh:mm")} - {moment.locale('nb'), moment(props.varighet).format("MMM DD YYYY")}</p>  
                    </div>
                </SeminarAccordionSummary>
                <SeminarAccordionDetails className="Seminar-AccordationDetails">
                    <h3 className="Seminar-StedHeading">Sted</h3>
                    <div className="AdressDesktop"></div>
                    <p className="Seminar-Adresse">{props.adresse}</p>
                    <h3 className="Seminar-ArrangorHeading">Arrangør</h3>
                    <p className="Seminar-Arrangor">{props.arrangor}</p>
                    <SeminarCardActions className="Seminar-CardActions">
                        <SeminarButton className="Seminar-buttonLes" size="small" color="default">
                        Les mer..
                        </SeminarButton>                        
                        <SeminarButton disabled>
                        Fullført
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
                    <SeminarCardMedia
                        image={"/uploaded/" + props.plassering} />
                    <SeminarCardContent className="Seminar-CardContent">
                        <div className="Seminar-CardHeading">
                            <h2 className="Seminar-NavnDesktop">{props.navn}</h2>
                        </div>
                        <div className="Seminar-CardDetails">
                            <DateRangeIcon className="DateIcon"/>
                            <div className="Seminar-DateDesktop">
                                <div className="Seminar-OppstartDesktop">{moment.locale('nb'), moment(props.oppstart).format("MMM DD YYYY, hh:mm")} - </div>
                                <div className="Seminar-VarighetDesktop">{moment.locale('nb'), moment(props.varighet).format("MMM DD YYYY")}</div>                                
                            </div>
                            
                            <h3 className="Seminar-StedHeading">Sted</h3>
                            <p className="Seminar-AdresseDesktop">{props.adresse}</p>
                            <h3 className="Seminar-ArrangorHeading">Arrangør</h3>
                            <p className="Seminar-ArrangorDesktop">{props.arrangor}</p>
                        </div>
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


export default SeminarFullforte;