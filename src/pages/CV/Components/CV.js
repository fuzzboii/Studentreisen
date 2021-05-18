import '../Styles/CV.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CookieService from '../../../global/Services/CookieService';
import Loader from '../../../global/Components/Loader';
import NoAccess from '../../../global/Components/NoAccess';
import CardContent from '@material-ui/core/CardContent';
import Box from'@material-ui/core/Box';
import Grid from'@material-ui/core/Grid';
import moment from 'moment';
import { Avatar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Input from '@material-ui/core/Input';
import EditIcon from '@material-ui/icons/Edit';

function CV(props) {

    const [loading, setLoading] = useState(true);
    const [auth, setAuth] = useState(false);

    const token = CookieService.get("authtoken");

    // Hente brukernavn og profilbilde
    const [fnavn, setFnavn] = useState("");
    const [enavn, setEnavn] = useState("");
    const [tlf, setTlf] = useState();
    const [email, setEmail] = useState();
    const [profilbilde, setProfilbilde] = useState();
    
    // Oppretting av arrays for CV
    const [utdanning, setUtdanning] = useState([[-1, -1]]);
    const [seminar, setSeminar] = useState([[-1,-1]]);
    const [jobb, setJobb] = useState([[-1, -1]]);
    const [annet, setAnnet] = useState([[-1, -1]])

    // Oppretting av CV Innlegg
    const [valgt_type, setValgt_type] = useState("");
    const [opprett_innlegg, setOpprett_innlegg] = useState("");
    const [opprett_datoFra, setOpprett_datoFra] = useState("");
    const [opprett_datoTil, setOpprett_datoTil] = useState("");

    // Lagrer id for sletting av CV innlegg
    const [id, setID] = useState();

    // For redigering av CV innlegg
    const [redid, setRedid] = useState();
    const [redinnlegg, setRedinnlegg] = useState();
    const [reddatoFra, setReddatoFra] = useState("");
    const [reddatoTil, setReddatoTil] = useState("");

    const [redigeropenEducation, setRedigeropenEducation] = useState(false);
    const [redigeropenSeminar, setRedigeropenSeminar] = useState(false);
    const [redigeropenWork, setRedigeropenWork] = useState(false);
    const [redigeropenOther, setRedigeropenOther] = useState(false);

    const handleClickOpenRedigerEducation = (cv_education_id, innlegg, datoFra, datoTil) => {
        setRedigeropenEducation(true);
        setRedid(cv_education_id);
        setRedinnlegg(innlegg);
        setReddatoFra(datoFra);
        setReddatoTil(datoTil);
    };

    const handleClickOpenRedigerSeminar = (cv_seminar_id, innlegg, datoFra, datoTil) => {
        setRedigeropenSeminar(true);
        setRedid(cv_seminar_id);
        setRedinnlegg(innlegg);
        setReddatoFra(datoFra);
        setReddatoTil(datoTil);
    };

    const handleClickOpenRedigerWork = (cv_work_id, innlegg, datoFra, datoTil) => {
        setRedigeropenWork(true);
        setRedid(cv_work_id);
        setRedinnlegg(innlegg);
        setReddatoFra(datoFra);
        setReddatoTil(datoTil);
    };

    const handleClickOpenRedigerOther = (cv_other_id, innlegg, datoFra, datoTil) => {
        setRedigeropenOther(true);
        setRedid(cv_other_id);
        setRedinnlegg(innlegg);
        setReddatoFra(datoFra);
        setReddatoTil(datoTil);
    };

    const handleCloseRediger = () => {
        setRedigeropenEducation(false);
        setRedigeropenSeminar(false);
        setRedigeropenWork(false);
        setRedigeropenOther(false);
        setRedid(null);
        setRedinnlegg(null);
        setReddatoFra(null);
        setReddatoTil(null);
    };

    const handleCloseRedigerInnleggEdu = () => {
        setRedigeropenEducation(false);
        const config = {
            token: token,
            cv_education_id: redid,
            innlegg: redinnlegg,
            datoFra: moment(reddatoFra).format('YYYY-MM-DD'),
            datoTil: moment(reddatoTil).format('YYYY-MM-DD')
        }
        axios.post(process.env.REACT_APP_APIURL + "/cv/redigerInnleggEdu", config).then(() => {
            setRedid(null);
            setRedinnlegg(null);
            setReddatoFra(null);
            setReddatoTil(null);
            window.location.reload();
        })
    };

    const handleCloseRedigerInnleggSem = () => {
        setRedigeropenEducation(false);
        const config = {
            token: token,
            cv_seminar_id: redid,
            innlegg: redinnlegg,
            datoFra: moment(reddatoFra).format('YYYY-MM-DD'),
            datoTil: moment(reddatoTil).format('YYYY-MM-DD')
        }
        axios.post(process.env.REACT_APP_APIURL + "/cv/redigerInnleggSem", config).then(() => {
            setRedid(null);
            setRedinnlegg(null);
            setReddatoFra(null);
            setReddatoTil(null);
            window.location.reload();
        })
    };

    const handleCloseRedigerInnleggWor = () => {
        setRedigeropenEducation(false);
        const config = {
            token: token,
            cv_work_id: redid,
            innlegg: redinnlegg,
            datoFra: moment(reddatoFra).format('YYYY-MM-DD'),
            datoTil: moment(reddatoTil).format('YYYY-MM-DD')
        }
        axios.post(process.env.REACT_APP_APIURL + "/cv/redigerInnleggWork", config).then(() => {
            setRedid(null);
            setRedinnlegg(null);
            setReddatoFra(null);
            setReddatoTil(null);
            window.location.reload();
        })
    };

    const handleCloseRedigerInnleggOth = () => {
        setRedigeropenEducation(false);
        const config = {
            token: token,
            cv_other_id: redid,
            innlegg: redinnlegg,
            datoFra: moment(reddatoFra).format('YYYY-MM-DD'),
            datoTil: moment(reddatoTil).format('YYYY-MM-DD')
        }
        axios.post(process.env.REACT_APP_APIURL + "/cv/redigerInnleggOther", config).then(() => {
            setRedid(null);
            setRedinnlegg(null);
            setReddatoFra(null);
            setReddatoTil(null);
            window.location.reload();
        })
    };

    const useStyles = makeStyles ({
        avatar: {
            width: '10vh',
            height: '10vh',
        },
        cardcontent: {
            backgroundColor: 'white'
            },
    });

    const classes = useStyles();

    const fetch = () => {
        // Authtoken sendes ved for å hente pålogget brukers ID
        const config = {
            token: token
        }
        axios
            // Flere spørringer kjøres samtidig, vent til ALLE er ferdige
            .all([
                axios.post(process.env.REACT_APP_APIURL + "/cv/getBruker", config),
                axios.post(process.env.REACT_APP_APIURL + "/cv/getBrukerbilde", config),
                axios.post(process.env.REACT_APP_APIURL + "/cv/getCVEducation", config),
                axios.post(process.env.REACT_APP_APIURL + "/cv/getCVSeminar", config),
                axios.post(process.env.REACT_APP_APIURL + "/cv/getCVWork", config),
                axios.post(process.env.REACT_APP_APIURL + "/cv/getCVOther", config)
            ])
            // Alle spørringer gjennomført
            .then(axios.spread((res1, res2, res3, res4, res5, res6) => {
                setFnavn(res1.data.results[0].fnavn);
                setEnavn(res1.data.results[0].enavn);
                setTlf(res1.data.results[0].telefon);
                setEmail(res1.data.results[0].email);
                if (res2.data.results !== undefined) {
                    setProfilbilde(res2.data.results[0].plassering)}
                if (res3.data !== undefined) {    
                    setUtdanning(res3.data.results);}
                if (res3.data !== undefined) {      
                    setSeminar(res4.data.results);}
                if (res3.data !== undefined) {      
                    setJobb(res5.data.results);}
                if (res3.data !== undefined) {      
                    setAnnet(res6.data.results);}
                // Data er ferdig hentet fra server
                setLoading(false);
            }))
    }

    const [slettopenEducation, setSlettopenEducation] = useState(false);
    const [slettopenSeminar, setSlettopenSeminar] = useState(false);
    const [slettopenWork, setSlettopenWork] = useState(false);
    const [slettopenOther, setSlettopenOther] = useState(false);
    const [opprettopen, setOpprettopen] = useState(false);

    const handleCloseOpprettInnlegg = () => {
        setOpprettopen(false);
        const config ={
            token: token,
            opprett_cv_innlegg: opprett_innlegg,
            opprettdatoFra: opprett_datoFra,
            opprettdatoTil: opprett_datoTil
        };
        if (valgt_type === "Seminar") {
            axios.post(process.env.REACT_APP_APIURL + "/cv/postCVSeminar", config).then(() => {
                window.location.reload();
        })}
        if (valgt_type === "Utdanning") {
            axios.post(process.env.REACT_APP_APIURL + "/cv/postCVEducation", config).then(() => {
                window.location.reload();
        })}
        if (valgt_type === "Jobberfaring") {
            axios.post(process.env.REACT_APP_APIURL + "/cv/postCVWork", config).then(() => {
                window.location.reload();
        })}
        if (valgt_type === "Annet") {
            axios.post(process.env.REACT_APP_APIURL + "/cv/postCVOther", config).then(() => {
                window.location.reload();
        })}
      };

    const handleClickOpenOpprett =() => {
        setOpprettopen(true);
      };

    const handleCloseOpprett = () => {
        setOpprettopen(false);
      };

    const handleClickOpenSlettEducation = (cv_education_id) => {
        setSlettopenEducation(true);
        setID(cv_education_id);
      };

    const handleClickOpenSlettSeminar = (cv_seminar_id) => {
        setSlettopenSeminar(true);
        setID(cv_seminar_id);
      };

    const handleClickOpenSlettWork = (cv_work_id) => {
        setSlettopenWork(true);
        setID(cv_work_id);
      };

    const handleClickOpenSlettOther = (cv_other_id) => {
        setSlettopenOther(true);
        setID(cv_other_id);
      };
    
    const handleCloseSlett = () => {
        setSlettopenEducation(false);
        setSlettopenSeminar(false);
        setSlettopenWork(false);
        setSlettopenOther(false);
        setID(null);
      };

    const handleCloseSlettInnleggSem = () => {
        setSlettopenSeminar(false);
        const config = {
            token: token,
            cv_seminar_id: id           
        }
        axios.post(process.env.REACT_APP_APIURL + "/cv/slettInnleggSem", config).then(() => {
            window.location.reload();
        })
      };

    const handleCloseSlettInnleggEdu = () => {
        setSlettopenEducation(false);
        const config = {
            token: token,
            cv_education_id: id           
        }
        axios.post(process.env.REACT_APP_APIURL + "/cv/slettInnleggEdu", config).then(() => {
            window.location.reload();
        })
      };

    const handleCloseSlettInnleggWork = () => {
        setSlettopenWork(false);
        const config = {
            token: token,
            cv_work_id: id           
        }
        axios.post(process.env.REACT_APP_APIURL + "/cv/slettInnleggWork", config).then(() => {
            window.location.reload();
        })
      };

    const handleCloseSlettInnleggOther = () => {
        setSlettopenOther(false);
        const config = {
            token: token,
            cv_other_id: id           
        }
        axios.post(process.env.REACT_APP_APIURL + "/cv/slettInnleggOther", config).then(() => {
            window.location.reload();
        })
      };
    
    useEffect( () => {
        setAuth(props.auth)
        fetch();
    }, [props]);
    
    const handleOpprettInnlegg = (event) => {
        setOpprett_innlegg(event.target.value);
    };

    if (loading) {
        return (
            <section id="loading">
                <Loader />
            </section>
        )
    } 

    if (auth && !loading) {
        return (  
            <div id="main_cv">
                <Grid id="gridbox" className={classes.grid} 
                p={2}
                alignItems="center"
                justify="center"
                container
                width="100%" >
                    <Avatar
                        src={"/uploaded/" + profilbilde } 
                        className={classes.avatar}
                        p={2}
                        style={{alignSelf: 'center'
                    }}
                    />
                    <Box alignItems="center">
                        <p className='cv_profil_info'>{"Navn: " + fnavn + " " + enavn} </p>
                        <p className='cv_profil_info'>{"Epost: " + email}</p>
                        <p className='cv_profil_info'>{"Telefonnummer: " + tlf}</p>
                    </Box>
                </Grid>


                <Grid className={classes.grid}>
                    <Button id="innleggButton" variant="contained" size="large" color="primary" className={classes.margin} onClick={handleClickOpenOpprett}>
                        Opprett nytt innlegg
                    </Button>
                    <Dialog open={opprettopen} onClose={handleCloseOpprett} aria-labelledby="form-dialog-title">
                        <DialogTitle id="cv_dialog_title">Legg til på CV</DialogTitle>
                        <DialogContent>
                            <Select className='cv_select' onChange={(e) => setValgt_type(e.target.value)} required>
                                <MenuItem value={"Utdanning"}>Utdanning</MenuItem>
                                <MenuItem value={"Seminar"}>Seminar</MenuItem>
                                <MenuItem value={"Jobberfaring"}>Jobberfaring</MenuItem>
                                <MenuItem value={"Annet"}>Annet</MenuItem>
                            </Select>

                            <Input value={opprett_innlegg}
                                    onChange={handleOpprettInnlegg} required>
                                        Skriv inn innlegg her
                            </Input><br />

                            <Input
                            id="date"
                            label="datoFra"
                            type="date"
                            value={opprett_datoFra}
                            onChange={(e) => setOpprett_datoFra(e.target.value)}
                            InputLabelProps={{
                            shrink: true,
                            }}
                            />
                            <Input
                            id="date"
                            label="datoTil"
                            type="date"
                            value={opprett_datoTil}
                            onChange={(e) => setOpprett_datoTil(e.target.value)}
                            InputLabelProps={{
                            shrink: true,
                            }}
                            />
                        </DialogContent>
                        <DialogActions>
                        <Button onClick={handleCloseOpprett} color="primary">
                            Avbryt
                        </Button>
                        <Button onClick={() => {handleCloseOpprettInnlegg()}} color="primary" autoFocus>
                            Opprett
                        </Button>
                        </DialogActions>
                    </Dialog>
                    <CardContent>                    
                        <Box bgcolor="white" boxShadow={5}>
                            <h1>Utdannelse</h1>
                            {utdanning !== undefined && utdanning.map((utd, indexEdu) => (
                                
                                <div className="cv_returned_content">
                                    {utd.datoFra !== null &&
                                    <text className='cv_returned_datoFra' type="date">{moment.locale('nb'), moment(utd.datoFra).format("DD MMM YYYY")} &nbsp;&nbsp;</text>}
                                    {utd.datoTil !== null && 
                                    <text className='cv_returned_datoTil' type="date">- &nbsp;&nbsp;{moment.locale('nb'), moment(utd.datoTil).format("DD MMM YYYY")}</text>}
                                    <p className='cv_returned_innlegg'>{utd.innlegg}</p>
                                    <div className="cv_ButtonsWrapper">
                                    <Button className="cv_Delete"
                                        type="submit"
                                        size="small"
                                        color="secondary"
                                        className={classes.button}
                                        startIcon={<DeleteIcon />}
                                        key={indexEdu}
                                        onClick={() => {handleClickOpenSlettEducation(utd.cv_education_id)}}
                                        >
                                        
                                        </Button>
                                    
                                    <Dialog open={slettopenEducation} onClose={handleCloseSlett} aria-labelledby="form-dialog-title">
                                        <DialogTitle id="cv_dialog_title">Slette innlegget?</DialogTitle>
                                        <DialogContent>
                                            <DialogContentText id="alert-dialog-description">
                                                Er du sikker på at du ønsker å slette innlegget?
                                            </DialogContentText>
                                        </DialogContent>
                                        <DialogActions>
                                        <Button onClick={handleCloseSlett} color="primary">
                                            Avbryt
                                        </Button>
                                        <Button onClick={handleCloseSlettInnleggEdu} color="primary" autoFocus>
                                            Slett
                                        </Button>
                                        </DialogActions>
                                    </Dialog>
                                    
                                    <Button className="cv_Edit"
                                        type="submit"
                                        size="small"
                                        color="primary"
                                        className={classes.button}
                                        startIcon={<EditIcon />}
                                        onClick={() => {handleClickOpenRedigerEducation(utd.cv_education_id, utd.innlegg, utd.datoFra, utd.datoTil)}}
                                        >
                                        
                                    </Button>
                                    </div>
                                    <Dialog open={redigeropenEducation} onClose={handleCloseRediger} aria-labelledby="form-dialog-title">
                                        <DialogTitle id="cv_dialog_title">Rediger innlegg</DialogTitle>
                                        <DialogContent>
                                            <DialogContentText id="alert-dialog-description">
                                                Rediger ditt innlegg
                                            </DialogContentText>
                                            <input type="date" value={reddatoFra} onChange={e => setReddatoFra(e.target.value)} pattern="\d{4}-\d{2}-\d{2}"></input>
                                            <input type="date" value={reddatoTil} onChange={e => setReddatoTil(e.target.value)} pattern="\d{4}-\d{2}-\d{2}"></input><br />
                                            <Input type="text" value={redinnlegg} onChange={e => setRedinnlegg(e.target.value)} required></Input>
                                        </DialogContent>
                                        <DialogActions>
                                        <Button onClick={handleCloseRediger} color="primary">
                                            Avbryt
                                        </Button>
                                        <Button onClick={handleCloseRedigerInnleggEdu} color="primary" autoFocus>
                                            Bekreft
                                        </Button>
                                        </DialogActions>
                                    </Dialog>
                                    
                                </div>
                            ))}
                            {utdanning === undefined &&
                                <div>
                                    <p className='cv_returned_innlegg'>Ingen informasjon her enda.</p>
                                </div>}
                        </Box>
                        <Box bgcolor="white" boxShadow={5}>
                            <h1>Seminarer og sertifiseringer</h1>
                            {seminar !== undefined && seminar.map((sem, indexSem) => (
                                
                                <div className="cv_returned_content">
                                    {sem.datoFra !== null && 
                                    <text className='cv_returned_datoFra' type="date">{moment.locale('nb'), moment(sem.datoFra).format("DD MMM YYYY")} &nbsp;&nbsp;</text>}
                                    {sem.datoTil !== null && 
                                    <text className='cv_returned_datoTil' type="date">- &nbsp;&nbsp;{moment.locale('nb'), moment(sem.datoTil).format("DD MMM YYYY")}</text>}
                                    <p className='cv_returned_innlegg'>{sem.innlegg}</p>
                                    <div className="cv_ButtonsWrapper">
                                    <Button
                                    type="submit"
                                    size="small"
                                    color="secondary"
                                    className={classes.button}
                                    startIcon={<DeleteIcon />}
                                    key={indexSem}
                                    onClick={() => {handleClickOpenSlettSeminar(sem.cv_seminar_id)}}
                                    >
                                    
                                    </Button>
                                    
                                    <Dialog open={slettopenSeminar} onClose={handleCloseSlett} aria-labelledby="form-dialog-title">
                                        <DialogTitle id="cv_dialog_title">Slette innlegget?</DialogTitle>
                                        <DialogContent>
                                            <DialogContentText id="alert-dialog-description">
                                                Er du sikker på at du ønsker å slette innlegget?
                                            </DialogContentText>
                                        </DialogContent>
                                        <DialogActions>
                                        <Button onClick={handleCloseSlett} color="primary">
                                            Avbryt
                                        </Button>
                                        <Button onClick={handleCloseSlettInnleggSem} color="primary" autoFocus>
                                            Slett
                                        </Button>
                                        </DialogActions>
                                    </Dialog>
                                    
                                    <Button
                                        type="submit"
                                        size="small" 
                                        color="primary" 
                                        startIcon={<EditIcon />} 
                                        onClick={() => {handleClickOpenRedigerSeminar(sem.cv_seminar_id, sem.innlegg, sem.datoFra, sem.datoTil)}}
                                        >
                                       
                                    </Button>
                                    </div>
                                    <Dialog open={redigeropenSeminar} onClose={handleCloseRediger} aria-labelledby="form-dialog-title">
                                        <DialogTitle id="cv_dialog_title">Rediger innlegg</DialogTitle>
                                        <DialogContent>
                                            <DialogContentText id="alert-dialog-description">
                                                Rediger ditt innlegg
                                            </DialogContentText>
                                            <input type="date" value={reddatoFra} onChange={e => setReddatoFra(e.target.value)} pattern="\d{4}-\d{2}-\d{2}"></input>
                                            <input type="date" value={reddatoTil} onChange={e => setReddatoTil(e.target.value)} pattern="\d{4}-\d{2}-\d{2}"></input><br />
                                            <Input type="text" value={redinnlegg} onChange={e => setRedinnlegg(e.target.value)} required></Input>
                                        </DialogContent>
                                        <DialogActions>
                                        <Button onClick={handleCloseRediger} color="primary">
                                            Avbryt
                                        </Button>
                                        <Button onClick={handleCloseRedigerInnleggSem} color="primary" autoFocus>
                                            Bekreft
                                        </Button>
                                        </DialogActions>
                                    </Dialog>
                                </div>
                            ))}
                            {seminar === undefined &&
                                <div>
                                    <p className='cv_returned_innlegg'>Ingen informasjon her enda.</p>
                                </div>}
                        </Box>
                        <Box bgcolor="white" boxShadow={5}>
                            <h1>Jobberfaring</h1>
                            {jobb !== undefined && jobb.map((wor, indexWor) => (
                                <div className="cv_returned_content">
                                    {wor.datoFra !== null && 
                                    <text className='cv_returned_datoFra' type="date">{moment.locale('nb'), moment(wor.datoFra).format("DD MMM YYYY")} &nbsp;&nbsp;</text>}
                                    {wor.datoTil !== null && 
                                    <text className='cv_returned_datoTil' type="date">- &nbsp;&nbsp;{moment.locale('nb'), moment(wor.datoTil).format("DD MMM YYYY")}</text>}
                                    <p className='cv_returned_innlegg'>{wor.innlegg}</p>
                                    <div className="cv_ButtonsWrapper">
                                    <Button
                                    type="submit"
                                    size="small"
                                    color="secondary"
                                    className={classes.button}
                                    startIcon={<DeleteIcon />}
                                    key={indexWor}
                                    onClick={() => {handleClickOpenSlettWork(wor.cv_work_id)}}
                                    >
                                    
                                    </Button>
                                    <Dialog open={slettopenWork} onClose={handleCloseSlett} aria-labelledby="form-dialog-title">
                                        <DialogTitle id="cv_dialog_title">Slette innlegget?</DialogTitle>
                                        <DialogContent>
                                            <DialogContentText id="alert-dialog-description">
                                                Er du sikker på at du ønsker å slette innlegget?
                                            </DialogContentText>
                                        </DialogContent>
                                        <DialogActions>
                                        <Button onClick={handleCloseSlett} color="primary">
                                            Avbryt
                                        </Button>
                                        <Button onClick={handleCloseSlettInnleggWork} color="primary" autoFocus>
                                            Slett
                                        </Button>
                                        </DialogActions>
                                    </Dialog>

                                    <Button
                                        type="submit"
                                        size="small"
                                        color="primary"
                                        className={classes.button}
                                        startIcon={<EditIcon />}
                                        onClick={() => {handleClickOpenRedigerWork(wor.cv_work_id, wor.innlegg, wor.datoFra, wor.datoTil)}}
                                        >
                                    </Button>
                                    </div>
                                    <Dialog open={redigeropenWork} onClose={handleCloseRediger} aria-labelledby="form-dialog-title">
                                        <DialogTitle id="cv_dialog_title">Rediger innlegg</DialogTitle>
                                        <DialogContent>
                                            <DialogContentText id="alert-dialog-description">
                                                Rediger ditt innlegg
                                            </DialogContentText>
                                            <input type="date" value={reddatoFra} onChange={e => setReddatoFra(e.target.value)} pattern="\d{4}-\d{2}-\d{2}"></input>
                                            <input type="date" value={reddatoTil} onChange={e => setReddatoTil(e.target.value)} pattern="\d{4}-\d{2}-\d{2}"></input><br />
                                            <Input type="text" value={redinnlegg} onChange={e => setRedinnlegg(e.target.value)} required></Input>
                                        </DialogContent>
                                        <DialogActions>
                                        <Button onClick={handleCloseRediger} color="primary">
                                            Avbryt
                                        </Button>
                                        <Button onClick={handleCloseRedigerInnleggWor} color="primary" autoFocus>
                                            Bekreft
                                        </Button>
                                        </DialogActions>
                                    </Dialog>
                                </div>
                                ))}
                                {jobb === undefined &&
                                <div>
                                    <p className='cv_returned_innlegg'>Ingen informasjon her enda.</p>
                                </div>}
                        </Box>
                        <Box bgcolor="white" boxShadow={5}>
                        <h1>Annet</h1>
                            {annet !== undefined && annet.map((ann, indexAnn) => (
                                <div className="cv_returned_content">
                                    {ann.datoFra !== null && 
                                    <text className='cv_returned_datoFra' type="date">{moment.locale('nb'), moment(ann.datoFra).format("DD MMM YYYY")} &nbsp;&nbsp;</text>}
                                    {ann.datoTil !== null && 
                                    <text className='cv_returned_datoTil' type="date">- &nbsp;&nbsp;{moment.locale('nb'), moment(ann.datoTil).format("DD MMM YYYY")}</text>}
                                    <p className='cv_returned_innlegg'>{ann.innlegg}</p>
                                    <div className="cv_ButtonsWrapper">
                                    <Button
                                    type="submit"
                                    size="small"
                                    color="secondary"
                                    className={classes.button}
                                    startIcon={<DeleteIcon />}
                                    key={indexAnn}
                                    onClick={() => {handleClickOpenSlettOther(ann.cv_other_id)}}
                                    >
                                    
                                    </Button>
                                    <Dialog open={slettopenOther} onClose={handleCloseSlett} aria-labelledby="form-dialog-title">
                                        <DialogTitle id="cv_dialog_title">Slette innlegget?</DialogTitle>
                                        <DialogContent>
                                            <DialogContentText id="alert-dialog-description">
                                                Er du sikker på at du ønsker å slette innlegget?
                                            </DialogContentText>
                                        </DialogContent>
                                        <DialogActions>
                                        <Button onClick={handleCloseSlett} color="primary">
                                            Avbryt
                                        </Button>
                                        <Button onClick={handleCloseSlettInnleggOther} color="primary" autoFocus>
                                            Slett
                                        </Button>
                                        </DialogActions>
                                    </Dialog>
                                    <Button
                                        type="submit"
                                        size="small"
                                        color="primary"
                                        className={classes.button}
                                        startIcon={<EditIcon />}
                                        onClick={() => {handleClickOpenRedigerOther(ann.cv_other_id, ann.innlegg, ann.datoFra, ann.datoTil)}}
                                        >
                                        
                                    </Button>
                                    </div>
                                    <Dialog open={redigeropenOther} onClose={handleCloseRediger} aria-labelledby="form-dialog-title">
                                        <DialogTitle id="cv_dialog_title">Rediger innlegg</DialogTitle>
                                        <DialogContent>
                                            <DialogContentText id="alert-dialog-description">
                                                Rediger ditt innlegg
                                            </DialogContentText>
                                            <input type="date" value={reddatoFra} onChange={e => setReddatoFra(e.target.value)} pattern="\d{4}-\d{2}-\d{2}"></input>
                                            <input type="date" value={reddatoTil} onChange={e => setReddatoTil(e.target.value)} pattern="\d{4}-\d{2}-\d{2}"></input><br />
                                            <Input type="text" value={redinnlegg} onChange={e => setRedinnlegg(e.target.value)} required></Input>
                                        </DialogContent>
                                        <DialogActions>
                                        <Button onClick={handleCloseRediger} color="primary">
                                            Avbryt
                                        </Button>
                                        <Button onClick={handleCloseRedigerInnleggOth} color="primary" autoFocus>
                                            Bekreft
                                        </Button>
                                        </DialogActions>
                                    </Dialog>
                                </div>
                                ))}
                                {annet === undefined &&
                                <div>
                                    <p className='cv_returned_innlegg'>Ingen informasjon her enda.</p>
                                </div>}
                        </Box>
                    </CardContent>
                </Grid>
            </div>                  
         );
        } else {
            return (
                // Ugyldig eller ikke-eksisterende token 
                <NoAccess />
            );
        }
    }


export default CV;