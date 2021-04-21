// React spesifikt
import { useState, useEffect, useContext, Component} from 'react';
import {useLocation, useParams} from 'react-router-dom';
import { useHistory } from "react-router-dom";
import React from 'react';

// 3rd-party Packages
import EventIcon from '@material-ui/icons/Event';
import moment from 'moment';
import 'moment/locale/nb';
import DeleteIcon from '@material-ui/icons/Delete';
import axios from 'axios';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import CancelIcon from '@material-ui/icons/Cancel';
import { Alert } from '@material-ui/lab';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

// Studentreisen-assets og komponenter
import Loader from '../../../global/Components/Loader';
import NoAccess from '../../../global/Components/NoAccess';
import CookieService from '../../../global/Services/CookieService';
import '../CSS/Seminar.css';

const SeminarDetailsExpired = (props) => {

    let { seminarid } = useParams();
    
    const history = useHistory();

    const [seminarsExpired, setSeminars] = useState([]);

    const [openDelete, setOpenDelete] = React.useState(false);
    
    const handleClickOpenDelete = () => {
        setOpenDelete(true);
    };

    useEffect(() => {
        fetchData();
    },[]);

    const handleCloseDelete = () => {
        setOpenDelete(false);
    };

    //Henting av kommende data til seminarene
    const fetchData = async () => {
                    
        const res = await axios.get(process.env.REACT_APP_APIURL + "/seminar/getAllSeminarExpiredData");
        console.log(res.data);
        setSeminars(res.data);
    };
    
/*     //Sletting av seminar
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
    }; */
 
    // Alert, melding
    const [alertTextDelete, setAlertTextDelete] = useState();
    
    // Alert, synlighet
    const [alertDisplay, setAlertDisplay] = useState("none");
    
    // Alert, alvorlighet
    const [alertSeverity, setAlertSeverity] = useState("error");
    
    // States for sletting av seminar
    const [availability, setAvailability] = useState();

    // Henter authtoken-cookie
    const token = CookieService.get("authtoken");

    // Utføres når seminaret slettes / Gjøres utilgjengelig
    const onSubmitSlett = () => {
        setAlertDisplay("none");
        setAlertTextDelete("");
        console.log(alertDisplay);
        const data = {
            token : token,
            seminarid : seminarid, 
            availability : 0
            
        }
        axios.post(process.env.REACT_APP_APIURL + "/seminar/updateAvailabilitySeminar", data).then( res => {
            console.log(res.data.status)
            if (res.data.status === "error") {
                setAlertDisplay("")
                setAlertTextDelete(res.data.message)
                setAlertSeverity("error")
            } else {
                setAlertDisplay("")
                setAlertTextDelete("Seminar slettet, du sendes nå tilbake til seminar oversikten")
                setAlertSeverity("success")
                setTimeout(handleCloseDelete, 3000)

                window.setTimeout(() => {
                    history.push("/seminar");
                }, 3000)
            }
        })

    }
    
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
                                    {(seminar.brukerid == props.brukerid || props.type === 4) &&
                                    <div className="SeminarDetails-ButtonSlettWrapper">
                                        <Button className="SeminarDetailsButtonSlett" size="small" variant="outlined" color="secondary" startIcon={<DeleteIcon />}  onClick={handleClickOpenDelete}> {/*onClick={() => deleteSeminar(seminar.seminarid, seminar.varighet, seminar.plassering)}>*/}
                                        Slett
                                        </Button>
                                        <Dialog open={openDelete} onClose={handleCloseDelete} aria-labelledby="form-dialog-title"> 
                                            <DialogTitle id="form-dialog-title">Slett</DialogTitle>
                                                <DialogContent>
                                                    <DialogContentText>
                                                        Er du sikker på at du ønsker å slette seminaret? Trykker du på "slett" gjøres seminaret utilgjengelig.
                                                    </DialogContentText>

                                                    {/* Alert */}
                                                    <Alert id="SeminarDelete_Alert" className="fade_in" style={{display: alertDisplay}} variant="filled" severity={alertSeverity}>
                                                    {alertTextDelete}
                                                    </Alert> 
                                                </DialogContent>
                                            
                                            {/* Funksjonsknapper */}
                                            <DialogActions>
                                            <Button onClick={handleCloseDelete} color="secondary" startIcon={<CancelIcon />}>
                                                Avbryt
                                            </Button>
                                            <Button onClick={onSubmitSlett} color="primary" startIcon={<DeleteIcon />}>
                                                Slett
                                            </Button>
                                            </DialogActions>
 
                                        </Dialog>                                        
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