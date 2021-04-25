import '../Styles/CV.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CookieService from '../../../global/Services/CookieService';
import Loader from '../../../global/Components/Loader';
import NoAccess from '../../../global/Components/NoAccess';
import Paper from '@material-ui/core/Paper';
import Grid from'@material-ui/core/Grid';
import moment from 'moment';
import { Avatar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

function CV(props) {

    const [loading, setLoading] = useState(true);

    const [auth, setAuth] = useState(false);

    const token = CookieService.get("authtoken");

    const [fnavn, setFnavn] = useState("");
    const [enavn, setEnavn] = useState("");
    const [tlf, setTlf] = useState();
    const [email, setEmail] = useState();
    const [profilbilde, setProfilbilde] = useState();

    const [utdanning, setUtdanning] = useState([[-1, -1]]);
    const [seminar, setSeminar] = useState([[-1,-1]]);
    const [jobb, setJobb] = useState([[-1, -1]]);
    const [annet, setAnnet] = useState([[-1, -1]])


    const useStyles = makeStyles ({
        avatar: {
            width: '10vh',
            height: '10vh',
            marginLeft: '5vw',
            marginRight: '2.5vw',
            marginTop: '1vh',
            marginBottom: '1vh'
        }
    });

    const classes = useStyles();

//    const [profilbilde, setProfilbilde] = useState();
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

    useEffect( () => {
        setAuth(props.auth)
        fetch();
    }, [props]);

   
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
                <Grid className='cv_profile' container>
                    <label htmlFor="avatarInput">
                        <Paper component="span" 
                            style={{
                                // "skru av" hover-skygge
                                backgroundColor: '#f9f7f6'
                            }}>
                            <Avatar
                                src={"/uploaded/" + profilbilde } 
                                className={classes.avatar}
                                />
                        </Paper>
                    </label>
                    <Paper className='cv_profile_element'>
                        <p>{"Navn: " + fnavn + " " + enavn} </p>
                        <p>{"Epost: " + email}</p>
                        <p>{"Telefonnummer: " + tlf}</p>
                    </Paper>
                </Grid>
                <Grid container direction="column">
                    <Grid>
                        <Paper className='cv_elements' >
                            <h1>Utdannelse</h1>
                            <form>
                                <input id="cv_input" type="text" name="post" maxlenght="128" required style={{width: "40em"}}/>
                                <input id="cv_date_input" type="date" name="dateFrom" />
                                <input id="cv_date_input" type="date" name="dateTill" />
                                <button type="submit" style={{width: "5em"}}>Legg til</button>
                            </form>
                            {utdanning !== undefined && utdanning.map((utd, key) => (
                                <div>
                                    <text>{utd.innlegg}</text><text type="date">{moment.locale('nb'), moment(utd.datoFra).format("DD MM YYYY")}</text><text type="date" size="10">{moment.locale('nb'), moment(utd.datoTil).format("DD MM YYYY")}</text><button className="cvRediger" key={key}>Rediger</button><button className="cvDelete" key={key}>Slett</button>
                                </div>
                            ))}
                        </Paper>
                    </Grid>
                    <Grid>
                        <Paper className='cv_elements' >
                            <h1>Seminarer og sertifiseringer</h1>
                            <form>
                                <input id="cv_input" type="text" name="post" maxlenght="128" required style={{width: "40em"}}/>
                                <input id="cv_date_input" type="date" name="dateFrom" />
                                <input id="cv_date_input" type="date" name="dateTill" />
                                <button type="submit" style={{width: "5em"}}>Legg til</button>
                            </form>
                            {seminar !== undefined && seminar.map((sem, key) => (
                            <div>
                                <text>{sem.innlegg}</text><text type="date">{moment.locale('nb'), moment(sem.datoFra).format("MMM DD YYYY")}</text><text type="date" size="10">{moment.locale('nb'), moment(sem.datoTil).format("MMM DD YYYY")}</text><button key={key} />
                            </div>
                            ))}
                        </Paper>
                    </Grid>
                    <Grid>
                        <Paper className='cv_elements' >
                            <h1>Jobberfaring</h1>
                            <form>
                                <input id="cv_input" type="text" name="post" maxlenght="128" required style={{width: "40em"}}/>
                                <input id="cv_date_input" type="date" name="dateFrom" />
                                <input id="cv_date_input" type="date" name="dateTill" />
                                <button type="submit" style={{width: "5em"}}>Legg til</button>
                            </form>
                            {jobb !== undefined && jobb.map((wor, key) => (
                                <div>
                                    <text>{wor.innlegg}</text><text type="date">{moment.locale('nb'), moment(wor.datoFra).format("MMM DD YYYY")}</text><text type="date" size="10">{moment.locale('nb'), moment(wor.datoTil).format("MMM DD YYYY")}</text><button key={key} />
                                </div>
                                ))}
                        </Paper>
                    </Grid>
                    <Grid>
                        <Paper className='cv_elements' >
                        <h1>Annet</h1>
                            <form>  
                                <input id="cv_input" type="text" name="post" maxlenght="128" required style={{width: "40em"}}/>
                                <input id="cv_date_input" type="date" name="dateFrom" />
                                <input id="cv_date_input" type="date" name="dateTill" />
                                <button type="submit" style={{width: "5em"}}>Legg til</button>
                            </form>
                            {annet !== undefined && annet.map((ann, key) => (
                                <div>
                                    <text>{ann.innlegg}</text><text type="date">{moment.locale('nb'), moment(ann.datoFra).format("MMM DD YYYY")}</text><text type="date" size="10">{moment.locale('nb'), moment(ann.datoTil).format("MMM DD YYYY")}</text><button key={key} />
                                </div>
                                ))}
                        </Paper>
                    </Grid>
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