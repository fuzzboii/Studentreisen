// React spesifikt
import { useState, useEffect, useContext, Component} from 'react';
import {useLocation, useParams} from 'react-router-dom';
import React from 'react';
import { useHistory } from "react-router-dom";

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

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { FormControl, InputLabel, Input } from '@material-ui/core';
import CancelIcon from '@material-ui/icons/Cancel';
import { Alert } from '@material-ui/lab';

// Studentreisen-assets og komponenter
import Loader from '../../../global/Components/Loader';
import NoAccess from '../../../global/Components/NoAccess';
import CookieService from '../../../global/Services/CookieService';
import '../CSS/Seminar.css';


const SeminarDetailsUpcoming = (props) => {

    let { seminarid } = useParams();
    
    const history = useHistory();
    
    const [seminarsUpcoming, setSeminars] = useState([]);
    
    const [openEdit, setOpenEdit] = React.useState(false);
    const [openDelete, setOpenDelete] = React.useState(false);
    
    const handleClickOpenEdit = () => {
      setOpenEdit(true);
    };
    const handleClickOpenDelete = () => {
        setOpenDelete(true);
      };

    useEffect(() => {
        fetchData();
    },[openEdit]);

    const handleCloseEdit = () => {
      setOpenEdit(false);
    };
    const handleCloseDelete = () => {
        setOpenDelete(false);
      };

    //Henting av kommende data til seminarene
    const fetchData = async () => {
                    
        const res = await axios.get(process.env.REACT_APP_APIURL + "/seminar/getAllSeminarUpcomingData");
        console.log(res.data);
        setSeminars(res.data);
        res.data.map(prop => {
            if (prop.seminarid == seminarid) {
                setTitle(prop.navn);
                setStartdate(prop.oppstart);
                setEnddate(prop.varighet);
                setAdress(prop.adresse);
                setDescription(prop.beskrivelse);
                setAvailability(prop.tilgjengelighet);

            }
        })
    };

    //Sletting av seminar
/*     const deleteSeminar = async (seminarid, varighet, bilde) => {

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
    const [alertTextEdit, setAlertTextEdit] = useState();
    const [alertTextDelete, setAlertTextDelete] = useState();
    
    // Alert, synlighet
    const [alertDisplay, setAlertDisplay] = useState("none");
    
    // Alert, alvorlighet
    const [alertSeverity, setAlertSeverity] = useState("error");
    
    // States for endring av seminar
    const [title, setTitle] = useState();
    const [startdate, setStartdate] = useState();
    const [enddate, setEnddate] = useState();
    const [adress, setAdress] = useState();
    const [description, setDescription] = useState();
    
    // States for sletting av seminar
    const [availability, setAvailability] = useState();

    // Henter authtoken-cookie
    const token = CookieService.get("authtoken");

    // Setter data i feltene basert på input felt id
    const onInputChange = e => {
        if(e.target.id === "SeminarEdit_input_title") {
            setTitle(e.target.value);
            setAlertDisplay("none");
            setAlertTextEdit("");

        } else if(e.target.id === "SeminarEdit_input_startdate") {
            setStartdate(e.target.value); 
            setAlertDisplay("none");
            setAlertTextEdit("");

        } else if(e.target.id === "SeminarEdit_input_enddate") {
            setEnddate(e.target.value);
            setAlertDisplay("none");
            setAlertTextEdit("");


        } else if(e.target.id === "SeminarEdit_input_address") {
            setAdress(e.target.value);
            setAlertDisplay("none");
            setAlertTextEdit("");


        } else if(e.target.id === "SeminarEdit_input_desc") {
            setDescription(e.target.value);
            setAlertDisplay("none");
            setAlertTextEdit("");

        }
    }

    // Utføres når seminaret oppdateres
    const onSubmit = e => {
        e.preventDefault()

        const data = {
            token : token,
            seminarid : seminarid, 
            title: title, 
            startdate: moment(startdate).format('YYYY-MM-DDTHH:mm:ss'),
            enddate: moment(enddate).format('YYYY-MM-DD'), 
            address: adress, 
            description: description
        }
        axios.post(process.env.REACT_APP_APIURL + "/seminar/updateSeminar", data).then( res => {
            console.log(res.data.status)
            if (res.data.status === "error") {
                setAlertDisplay("")
                setAlertTextEdit(res.data.message)
                setAlertSeverity("error")
            } else {
                setAlertDisplay("")
                setAlertTextEdit("Seminar oppdatert")
                setAlertSeverity("success")
                setTimeout(handleCloseEdit, 1500);
            }
        })

    }

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
            
            {seminarsUpcoming.map(seminar => { if(seminarid == seminar.seminarid)           
                return ( 
                    <div className="SeminarDetails-Content">
                        {/*Header seksjonen */}
                        <div className="SeminarDetails-Header">
                            <div className="SeminarDetailsHeading">
                                <div className="SeminarDetails-Navn">
                                    <h1 className="SeminarDetailsNavn">{seminar.navn}</h1>
                                </div>
                                
                                {/* Seksjonen for påmelding, slett, og rediger - knapper */}
                                <div className="SeminarDetails-Buttons">    
                                    {/*Påmelding til seminaret */}
                                    <div className="SeminarDetails-ButtonPameldWrapper">
                                        <Button className="SeminarDetailsButtonPameld" size="small" variant="contained" color="primary">
                                        Påmeld
                                        </Button>
                                    </div>
                                    
                                    {/*Endring av seminaret, med test på brukertype */}
                                    {props.type === 4 &&
                                    <div className="SeminarDetails-ButtonRedigerWrapper">      
                                        <Button className="SeminarDetailsButtonRediger" size="small" variant="outlined" color="primary" startIcon={<EditIcon />} onClick={handleClickOpenEdit}>
                                        Rediger
                                        </Button>
                                        <Dialog open={openEdit} onClose={handleCloseEdit} aria-labelledby="form-dialog-title"> 
                                            <DialogTitle id="form-dialog-title">Rediger</DialogTitle>
                                            <DialogContent>
                                                <DialogContentText>
                                                    For å gjøre endringer på seminaret, skriv de nye endringene i feltene. Klikk deretter på oppdater.
                                                </DialogContentText>
                                                <form id="SeminarEdit_form" >
                                                    {/* Tittel */}
                                                    <FormControl id="Seminar_formcontrol">
                                                        <InputLabel>Tittel</InputLabel>
                                                        <Input id="SeminarEdit_input_title" variant="outlined" value={title} onChange={onInputChange} required={false} />
                                                    </FormControl>

                                                    {/* Startdato */}
                                                    <FormControl id="Seminar_formcontrol">
                                                        <InputLabel>Startdato</InputLabel>
                                                        <Input id="SeminarEdit_input_startdate" type="datetime-local" variant="outlined" value={moment.locale('nb'), moment(startdate).format('YYYY-MM-DDTHH:mm:ss')} onChange={onInputChange} required={false} />
                                                    </FormControl>

                                                    {/* Sluttdato */}
                                                    <FormControl id="Seminar_formcontrol">
                                                        <InputLabel>Sluttdato</InputLabel>
                                                        <Input id="SeminarEdit_input_enddate" type="date" variant="outlined" value={moment.locale('nb'), moment(enddate).format('YYYY-MM-DD')} onChange={onInputChange} required={false} />
                                                    </FormControl>
                                                    
                                                    {/* Adresse */}
                                                    <FormControl id="Seminar_formcontrol">
                                                        <InputLabel>Adresse</InputLabel>
                                                        <Input id="SeminarEdit_input_address" variant="outlined" value={adress} onChange={onInputChange} required={false} />
                                                    </FormControl>
                                                    
                                                    {/* Beskrivelse */}
                                                    <FormControl id="Seminar_formcontrol">
                                                        <InputLabel>Beskrivelse</InputLabel>
                                                        <Input id="SeminarEdit_input_desc" variant="outlined" value={description} onChange={onInputChange} required={false} multiline rows="5" />
                                                    </FormControl>
                                                    
                                                    {/* Alert */}
                                                    <Alert id="SeminarEdit_Alert" className="fade_in" style={{display: alertDisplay}} variant="filled" severity={alertSeverity}>
                                                        {alertTextEdit}
                                                    </Alert>  
                                                </form>                                         
                                            </DialogContent>
                                            
                                            {/* Funksjonsknapper */}

                                            <DialogActions>
                                            <Button onClick={handleCloseEdit} color="secondary" startIcon={<CancelIcon />}>
                                                Avbryt
                                            </Button>
                                            <Button onClick={onSubmit} color="primary" startIcon={<SaveIcon />}>
                                                Oppdater
                                            </Button>
                                            </DialogActions>
 
                                        </Dialog>
                                    </div>}
                                    
                                    {/*Sletting av seminaret, med test på brukertype */}
                                    {props.type === 4 &&
                                    <div className="SeminarDetails-ButtonSlettWrapper">
                                        <Button className="SeminarDetailsButtonSlett" size="small" variant="outlined" color="secondary" startIcon={<DeleteIcon />} onClick={handleClickOpenDelete}> {/*onClick={() => deleteSeminar(seminar.seminarid, seminar.varighet, seminar.plassering)}>*/}
                                        Slett
                                        </Button>
                                        <Dialog open={openDelete} onClose={handleCloseDelete} aria-labelledby="form-dialog-title"> 
                                            <DialogTitle id="form-dialog-title">Slett</DialogTitle>
                                                <DialogContent>
                                                    <DialogContentText>
                                                        Er du sikker på at du ønsker å slette seminaret? Trykker du på "slett" gjøres seminaret utilgjengelig.
                                                    </DialogContentText>

                                                    {/* Alert */}
                                                    <Alert id="SeminarEdit_Alert" className="fade_in" style={{display: alertDisplay}} variant="filled" severity={alertSeverity}>
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

export default SeminarDetailsUpcoming;