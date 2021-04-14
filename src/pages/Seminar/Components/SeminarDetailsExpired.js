// React spesifikt
import { useState, useEffect, useContext, Component} from 'react';
import {useLocation, useParams} from 'react-router-dom';

// 3rd-party Packages
import EventIcon from '@material-ui/icons/Event';
import moment from 'moment';
import 'moment/locale/nb';
import DeleteIcon from '@material-ui/icons/Delete';
import SaveIcon from '@material-ui/icons/Save';
import EditIcon from '@material-ui/icons/Edit';
import axios from 'axios';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';

// Studentreisen-assets og komponenter
import Loader from '../../../global/Components/Loader';
import NoAccess from '../../../global/Components/NoAccess';
import CookieService from '../../../global/Services/CookieService';
import '../CSS/Seminar.css';

const SeminarDetailsExpired = (props) => {

    useEffect(() => {
        fetchData();
    },[]);

    let { seminarid } = useParams();
    const [seminarsExpired, setSeminars] = useState([]);
    
    //Henting av kommende data til seminarene
    const fetchData = async () => {
                    
        const res = await axios.get(process.env.REACT_APP_APIURL + "/seminar/getAllSeminarExpiredData");
        console.log(res.data);
        setSeminars(res.data);

    };
    
    //Sletting av seminar
    const deleteSeminar = async (seminarid, varighet, bilde) => {
        console.log("TODO:\n\tImplementere feilmeldinger");
        try {
            axios
                .post(process.env.REACT_APP_APIURL + "/tools/deleteSeminar", {seminarid : seminarid, sluttdato : varighet, bilde : bilde, token : CookieService.get("authtoken")})
                // Utføres ved mottatt resultat
                .then(res => {
                    if(res.data.success) {
                        window.location.href="/seminar";
                    } else {
                        // Vis feilmelding
                    }
                }).catch(e => {
                    // Vis feilmelding
                });
        } catch(e) {
            // Vis feilmelding
        }
    };
    
    {/*Utgåtte seminarer */}
    return(
        <>
        {props.loading &&
            // Om vi er i loading fasen (Før mottatt data fra API) vises det et Loading ikon
            <section id="loading">
                <Loader />
            </section>
        }
        {!props.loading && props.auth &&
            <div className="SeminarDetails">
            {seminarsExpired.map(seminar => { if(seminarid == seminar.seminarid)           
                return ( 
                    <div className="SeminarDetails-Content">
                        {/*Header seksjonen */}
                        <div className="SeminarDetails-Header">
                            <div className="SeminarDetailsHeading">
                                <div className="SeminarDetails-Navn">
                                    <h1 className="SeminarDetailsNavn">{seminar.navn}</h1>
                                </div>

                                {/* Seksjonen for påmelding, og slett - knapper */}
                                <div className="SeminarDetails-Buttons">
                                    <div className="SeminarDetails-ButtonPameldWrapper">
                                        <Button className="SeminarDetailsButtonPameld" size="small" variant="outlined" disabled>
                                        Utgått
                                        </Button>
                                    </div>

                                    {/*Sletting av seminaret, med test på brukertype */}
                                    {props.type === 4 &&
                                    <div className="SeminarDetails-ButtonSlettWrapper">
                                        <Button className="SeminarDetailsButtonSlett" size="small" variant="outlined" color="secondary" startIcon={<DeleteIcon />}  onClick={() => deleteSeminar(seminar.seminarid, seminar.varighet, seminar.plassering)}>
                                        Slett
                                        </Button>
                                    </div>}
                                </div>
                            </div>

                            {/*Oppstart og sluttdato seksjonen */}
                            <div className="SeminarDetails-Date">
                                <EventIcon className="SeminarDetails-DateIcon"/> 
                                <div className="SeminarDetails-OppstartVarighet">
                                    <p className="SeminarDetails-Oppstart">{moment.locale('nb'), moment(seminar.oppstart).format("MMM DD YYYY, hh:mm")} -</p>
                                    <p className="SeminarDetails-Varighet">{moment.locale('nb'), moment(seminar.varighet).format("MMM DD YYYY")}</p>    
                                </div>
                            </div>
                        </div>

                        {/*Bilde og informasjon seksjonen */}
                        <Box className="SeminarDetails-Box" boxShadow={1}>    
                            <div className="SeminarDetails-Image">
                                <img src={"/uploaded/" + seminar.plassering} alt="Seminar Image" className="SeminarDetails-img" imgstart=""  />
                            </div>
                            <div className="SeminarDetails-Information">
                                <h2 className="SeminarDetails-ArrangorHeading">Arrangør</h2>
                                    <p className="SeminarDetails-Arrangor">{seminar.fnavn} {seminar.enavn}</p>
                                <h2 className="SeminarDetails-AdresseHeading">Adresse</h2>
                                    <p className="SeminarDetails-Adresse">{seminar.adresse}</p>
                                <h2 className="SeminarDetails-BeskrivelseHeading">Beskrivelse</h2>
                                    <p className="SeminarDetails-Beskrivelse">{seminar.beskrivelse}</p>
                            </div>                                  
                        </Box>   
                    </div>

                )
            })}
            </div>
        }{!props.loading && !props.auth &&
            // Ugyldig eller ikke-eksisterende token 
            <NoAccess />
        }
        </>        
    );
}

export default SeminarDetailsExpired;