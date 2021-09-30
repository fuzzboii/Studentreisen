// React spesifikt
import React from "react";
import {Link} from 'react-router-dom';

// 3rd-party Packages
import DateRangeIcon from '@material-ui/icons/DateRange';
import moment from 'moment';
import 'moment/locale/nb';

// Studentreisen-assets og komponenter
import '../CSS/Seminar.css'; 
import { SeminarCard, SeminarCardActionArea, SeminarCardContent, SeminarCardMedia, SeminarTypography, SeminarCardActions, SeminarButton, SeminarAccordion, SeminarAccordionSummary, SeminarAccordionDetails, SeminarExpandMoreIcon } from '../CSS/apistylesSeminar';
import noimage from '../../../assets/noimage.jpg'; 

const SeminarExpired = (props) => {
    const [width, setWidth] = React.useState(window.innerWidth);
    const breakpoint = 1023;
    React.useEffect(() => {
        const handleResizeWindow = () => setWidth(window.innerWidth);

        window.addEventListener("resize", handleResizeWindow);
        return () => {
        window.removeEventListener("resize", handleResizeWindow);
        };
    }, []);
    
    // Om seminaret ikke har ett bilde, vis et standardbilde
    const uploadedimg = props.plassering !== null ? "/uploaded/" + props.plassering : noimage;
    
    if (width < breakpoint) {
        return (
            <div className="Seminar-Mobile">
            <SeminarAccordion>
                <SeminarAccordionSummary expandIcon={<SeminarExpandMoreIcon />} aria-controls="panel1a-content" id="Seminar-AccordionSummary">
                    <div className="Seminar-HeaderContent">
                        <h2 className="Seminar-Navn">{props.navn}</h2> 
                        <p className="Seminar-OppstartVarighet">{moment.locale('nb'), moment(props.oppstart).format("MMM DD YYYY, HH:mm")} - {moment.locale('nb'), moment(props.varighet).format("MMM DD YYYY")}</p>  
                    </div>
                </SeminarAccordionSummary>
                <SeminarAccordionDetails className="Seminar-AccordationDetails">
                    <h3 className="Seminar-StedHeading">Sted</h3>
                    <div className="AdressDesktop"></div>
                    <p className="Seminar-Adresse">{props.adresse}</p>
                    <h3 className="Seminar-ArrangorHeading">Arrangør</h3>
                    <p className="Seminar-Arrangor">{props.fnavn} {props.enavn}</p>
                    <SeminarCardActions className="Seminar-CardActions">
                        <Link className='Seminar-Link' to={`/seminar/seminarutgatte=${props.seminarid}`}>
                        <SeminarButton className="Seminar-buttonLes" size="small" color="default">
                        Les mer..
                        </SeminarButton>
                        </Link>                        
                        <SeminarButton disabled>
                        Utgått
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
                <Link className='Seminar-Link' to={`/seminar/seminarutgatte=${props.seminarid}`}>
                <SeminarCardActionArea>
                    <SeminarCardMedia
                        image={uploadedimg} />
                    <SeminarCardContent className="Seminar-CardContent">
                        <div className="Seminar-CardHeading">
                            <h2 className="Seminar-NavnDesktop">{props.navn}</h2>
                        </div>
                        <div className="Seminar-CardDetails">
                            <DateRangeIcon className="DateIcon"/>
                            <div className="Seminar-DateDesktop">
                                <div className="Seminar-OppstartDesktop">{moment.locale('nb'), moment(props.oppstart).format("MMM DD YYYY, HH:mm")} - </div>
                                <div className="Seminar-VarighetDesktop">{moment.locale('nb'), moment(props.varighet).format("MMM DD YYYY")}</div>                                
                            </div>
                            
                            <h3 className="Seminar-StedHeading">Sted</h3>
                            <p className="Seminar-AdresseDesktop">{props.adresse}</p>
                            <h3 className="Seminar-ArrangorHeading">Arrangør</h3>
                            <p className="Seminar-ArrangorDesktop">{props.fnavn} {props.enavn}</p>
                        </div>
                    </SeminarCardContent>
                </SeminarCardActionArea>
                </Link>
                <SeminarCardActions className="Seminar-CardActions">
                    <SeminarButton disabled>
                        Utgått
                    </SeminarButton>
                </SeminarCardActions>
            </SeminarCard>
            </div>
        );
        
}


export default SeminarExpired;