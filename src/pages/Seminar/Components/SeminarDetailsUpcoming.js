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
import Chip from '@material-ui/core/Chip';
import FaceIcon from '@material-ui/icons/Face';


// Studentreisen-assets og komponenter
import Loader from '../../../global/Components/Loader';
import NoAccess from '../../../global/Components/NoAccess';
import CookieService from '../../../global/Services/CookieService';
import '../CSS/Seminar.css';
import noimage from '../../../assets/noimage.jpg'; 



const SeminarDetailsUpcoming = (props) => {
    

    let { seminarid } = useParams();
    
    //Brukes for å sette bruker tilbake til forrige side
    const history = useHistory();
    
    //States for å liste opp kommende seminarer
    const [seminarsUpcoming, setSeminars] = useState([]);

    //States for å liste opp plasseringen til bildet
    const [plassering, setPlassering] = useState('');
    
    //States for å liste opp påmeldte brukere på seminarene
    const [enlists, setEnlists] = useState([]);

    //States for påmeldte brukere

    const [participants, setParticipants] = useState([]);
    const [totalparticipants, setTotalParticipants] = useState([]);

    //States for åpning av dialog boksen
    const [openEdit, setOpenEdit] = React.useState(false);
    const [openDelete, setOpenDelete] = React.useState(false);
    const [openParticipants, setOpenParticipants] = React.useState(false);

    //States for åpning av alert
    const [AlertOpenDialog, setAlertOpenDialog] = React.useState(false);
    const [AlertOpen, setAlertOpen] = React.useState(false);
    
    //States for påmelding knappen
    const [enlist, setEnlist] = React.useState(false);
    
    //States Alert, melding
    const [alertTextEdit, setAlertTextEdit] = useState();
    const [alertTextDelete, setAlertTextDelete] = useState();
    const [alertTextEnlist, setAlertTextEnlist] = useState();
    
    //States Alert, synlighet
    const [alertDisplay, setAlertDisplay] = useState("none");
    
    //States Alert, alvorlighet
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
    
    //Håndterer åpning av redigering, sletting, og deltagere
    const handleClickOpenEdit = () => {
        setOpenEdit(true);
    };
    const handleClickOpenDelete = () => {
        setOpenDelete(true);
    };
    const handleClickOpenParticipants = () => {
        setOpenParticipants(true);
    };

    //Use effect
    useEffect(() => {
        fetchData();
        fetchEnlistedData();
        fetchParticipantsData();
        
    },[openEdit]);

    //Håndterer lukking av redigering, sletting, og deltagere
    const handleCloseEdit = () => {
      setOpenEdit(false);
      setAlertOpenDialog(false);
    };
    const handleCloseDelete = () => {
        setOpenDelete(false);
    };
    const handleCloseParticipants = () => {
        setOpenParticipants(false);
    };
    
    //Henting av kommende data til seminarene og tester på seminarid
    const fetchData = async () => {
                    
        axios.get(process.env.REACT_APP_APIURL + "/seminar/getAllSeminarUpcomingData").then(res => {

        setSeminars(res.data);
        res.data.map(seminar => {
            if (seminar.seminarid == seminarid) {
                setTitle(seminar.navn);
                setStartdate(seminar.oppstart);
                setEnddate(seminar.varighet);
                setAdress(seminar.adresse);
                setDescription(seminar.beskrivelse);
                setAvailability(seminar.tilgjengelighet);
                setPlassering(seminar.plassering);
                
            }
        })
    })}
    
    
    //Henting av påmeldte seminarer for brukeren, deretter sjekk på påmelding og settes påmeldingen til true dersom brukeren er påmeldt på seminaret
    const fetchEnlistedData = async () => {
        const token = CookieService.get("authtoken");
        
        const data = {
            token: token,
        }
        
        axios.post(process.env.REACT_APP_APIURL + "/seminar/getEnlistedSeminars", data).then(res => {
        setEnlists(res.data);
            res.data.map(enlists => { 
                if (enlists.seminarid == seminarid) {
                    setEnlist(true);
                } 
            }
        )})
    }

    //Henting av påmeldte brukere på seminaret
    const fetchParticipantsData = async () => {
        const token = CookieService.get("authtoken");

        const data = {
            token: token,
            seminarid: seminarid,
        }
        axios.post(process.env.REACT_APP_APIURL + "/seminar/getParticipants", data).then(res => {
            const total = res.data.length;
            setParticipants(res.data);
            setTotalParticipants(res.data.length)
            
        })
    }   
 
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

    //Påmelder og avmelder brukeren til seminaret
    const onEnlist = () => {
        
        const data = {
            token : token,
            seminarid : seminarid, 
        }

        axios.post(process.env.REACT_APP_APIURL + "/seminar/postEnlist", data).then( res => {
            console.log(res.data.status)
            if (res.data.status === "error") {
                setAlertDisplay("")
                setAlertTextEnlist(res.data.message)
                setAlertSeverity("error")
            } else {
                setAlertOpen(true);
                setAlertDisplay("")
                setAlertTextEnlist("Du er nå påmeldt til seminaret")
                setAlertSeverity("success")
                setEnlist(true);

                window.setTimeout(() => {
                    setAlertOpen(false);
                }, 3000)
            }
        })    
    }

    const onUnenlist = () => {
        
        const data = {
            token : token,
            seminarid : seminarid, 
        }

        axios.post(process.env.REACT_APP_APIURL + "/seminar/deleteEnlist", data).then( res => {
            console.log(res.data.status)
            if (res.data.status === "error") {
                setAlertDisplay("")
                setAlertTextEnlist(res.data.message)
            } else {
                setAlertOpen(true);
                setAlertDisplay("")
                setAlertTextEnlist("Du er nå avmeldt fra seminaret")
                setAlertSeverity("info")
                setEnlist(false);

                window.setTimeout(() => {
                    setAlertOpen(false);
                }, 3000)
            }
        })
    }    

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
    
    //Når brukeren submitter oppdatereringen av seminaret
    const onSubmit = e => {
        // Stopper siden fra å laste inn på nytt
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
                setAlertOpenDialog(true);
                setAlertDisplay("")
                setAlertTextEdit("Seminar oppdatert")
                setAlertSeverity("success")
                setTimeout(handleCloseEdit, 1500);
            }
        })

    }
    
    //Når brukeren submitter slettingen av seminaret
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
                setAlertOpenDialog(true);
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
    
    // Om seminaret ikke har ett bilde, vis et standardbilde
    const uploadedimg = plassering !== null ? "/uploaded/" + plassering : noimage;

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
                                    {(seminar.brukerid != props.brukerid) &&
                                    <div className="SeminarDetails-ButtonPameldWrapper">
                                        {!enlist ?
                                        <>
                                        <Button className="SeminarDetailsButtonPameld" size="small" variant="contained" color="primary" onClick={onEnlist}>
                                        Påmeld
                                        </Button>
                                        </>
                                        :
                                        <Button className="SeminarDetailsButtonPameld" size="small" variant="contained" color="default" onClick={onUnenlist}>
                                        Avmeld
                                        </Button>
                                                                            
                                        }
                                    </div>
                                    
                                    }
                                    {/*Endring av seminaret, med test på brukertype */}
                                    {(seminar.brukerid == props.brukerid || props.type === 4) &&
                                    
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
                                                    {AlertOpenDialog && <Alert id="SeminarEdit_Alert" className="fade_in" style={{display: alertDisplay}} variant="filled" severity={alertSeverity} >
                                                        
                                                        {alertTextEdit}
                                                    </Alert>}  
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
                                    {(seminar.brukerid == props.brukerid || props.type === 4) &&
                                    
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
                                                    {AlertOpenDialog && <Alert id="SeminarDelete_Alert" className="fade_in" style={{display: alertDisplay}} variant="filled" severity={alertSeverity}>
                                                    {alertTextDelete}
                                                    </Alert> }
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
                                    <p className="SeminarDetails-Oppstart">{moment.locale('nb'), moment(seminar.oppstart).format("MMM DD YYYY, HH:mm")} -</p>
                                    <p className="SeminarDetails-Varighet">{moment.locale('nb'), moment(seminar.varighet).format("MMM DD YYYY")}</p>    
                                </div>
                            </div>
                        </div>

                        {/*Bilde og informasjon seksjonen */}
                        <Box className="SeminarDetails-Box" boxShadow={1}>    
                            
                            <div className="SeminarDetails-Image">
                                <img src={uploadedimg} alt="Seminar Image" className="SeminarDetails-img" imgstart=""  />
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
                        {/* Alert */}
                        {AlertOpen && <Alert id="SeminarEnlist_Alert" className="fade_in" style={{display: alertDisplay}} variant="filled" severity={alertSeverity} >   
                            {alertTextEnlist}
                        </Alert>}                          
                        
                        {/*Deltagere seksjonen */}
                        <div className="SeminarDetails-ButtonDeltagereWrapper">
                        <Chip
                            icon={<FaceIcon />}
                            label={totalparticipants + " Påmeldt"}
                            color="primary"
                        />
                        </div>
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