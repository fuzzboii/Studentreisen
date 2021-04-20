import React, { useState, useEffect } from 'react';
import axios from 'axios';

import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { Button, FormControl, InputLabel, Input } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Alert } from '@material-ui/lab';

import '../CSS/Profile.css';
import CookieService from '../../../global/Services/CookieService';
import Loader from '../../../global/Components/Loader';
import NoAccess from '../../../global/Components/NoAccess';

function Profile(props) {
    // State for loading mens vi venter på svar fra server
    const [loading, setLoading] = useState(true);
    // Autentiseringsstatus
    const [auth, setAuth] = useState(false);
    // Array for alle interesser //
    const [fagfelt, setFagfelt] = useState([]);
    // Array for aktive interesser
    const [interesser, setInteresser] = useState([[-1, -1]]);

    // States for oppdatering av personalia
    // Alert, melding
    const [alertText, setAlertText] = useState();
    // Alert, synlighet
    const [alertDisplay, setAlertDisplay] = useState("none");
    // Alert, alvorlighet
    const [alertSeverity, setAlertSeverity] = useState("error");
    // Passord
    const [pwd, setPwd] = useState("");
    // Passord, bekreftet
    const [pwd2, setPwd2] = useState("");
    // Oppdaterings-knapper, tekst
    const [updateText1, setUpdateText1] = useState("Oppdater");
    const [updateText2, setUpdateText2] = useState("Oppdater");
    const [updateText3, setUpdateText3] = useState("Oppdater");
    
    // States for personalia.
    const [fnavn, setFnavn] = useState("");
    const [enavn, setEnavn] = useState("");
    const [tlf, setTlf] = useState();
    const [email, setEmail] = useState();

    // Henter authtoken-cookie
    const token = CookieService.get("authtoken");

    // Utføres når bruker gjør en handling i input-feltet for e-post
    const onEmailChange = e => {
        setEmail(e.target.value);
        setAlertDisplay("none");
        setAlertText("");
    };

    // Utføres når e-post forsøkes oppdatert
    const onEmailSubmit = e => {
        e.preventDefault()
        setUpdateText1("Vennligst vent");
        
        const config = {
            token: token,
            email: email
        }

        axios.post(process.env.REACT_APP_APIURL + "/profile/updateEmail", config).then( res => {
            console.log(res.data.status)
            if (res.data.status === "error") {
                setAlertDisplay("")
                setAlertText(res.data.message)
                setAlertSeverity("error")
            } else {
                setAlertDisplay("")
                setAlertText("Epost endret")
                setAlertSeverity("success")
                setAuth(true)
            }
        })
    }

    // Utføres når bruker gjør en handling i input-feltet for telefonnummer
    const onTlfChange = e => {
        setTlf(e.target.value);
        setAlertDisplay("none");
        setAlertText("");
    };

    // Utføres når telefonnummer forsøkes oppdatert
    const onTlfSubmit = e => {
        e.preventDefault()
        setUpdateText2("Vennligst vent");

        const config = {
            token: token,
            telefon: tlf.replace(/\s/g, ''),
        }

        axios.post(process.env.REACT_APP_APIURL + "/profile/updateTelefon", config).then(
            setAlertDisplay(""),
            setAlertText("Telefonnummer oppdatert!"),
            setAlertSeverity("success"),
            setUpdateText1("Oppdater")
        )
    }

    // Utføres når bruker gjør en handling i input-feltet for passord
    const onPwdChange = e => {
        setPwd(e.target.value);
        setAlertDisplay("none");
        setAlertText("");
    };

    // Utføres når bruker gjør en handling i input-feltet for bekreft passord
    const onPwd2Change = e => {
        setPwd2(e.target.value);
        setAlertDisplay("none"); 
        setAlertText("");
    };

    // Utføres når passord forsøkes oppdatert
    const onPwdSubmit = e => {
        e.preventDefault();
        setUpdateText3("Vennligst vent");

        if (pwd === pwd2) {
            const config = {
                token: token,
                pwd: pwd
            }
            axios.post(process.env.REACT_APP_APIURL + "/profile/updatePassord", config).then(
                setAlertDisplay(""),
                setAlertText("Passord oppdatert!"),
                setAlertSeverity("success"),
                setUpdateText3("Oppdater")
            )
        } else {
            setAlertDisplay("");
            setAlertText("Passordene er ikke like");
            setUpdateText3("Oppdater");
        }
    }

    const useStyles = makeStyles ({
        // Placeholder account icon
        accountCircle: {
            fontSize: '6rem',
            color: '#3bafa2',
            marginLeft: '2vw',
            marginTop: '1vh',
        },

        profileButton: {
            color: '#fff',
            backgroundColor: '#4646a5',
            alignSelf: 'flex-end',
            marginLeft: 'auto',
            marginRight: '1.5vw',
            marginTop: '1.5vh'
        },

        fagfeltButton: {
            border: '2px solid',
            borderColor: '#4646a5',
            borderRadius: '18px',
            marginBottom: '0.5em',
            marginRight: '0.5em',
            fontSize: '0.8rem',
        },

        fagfeltButtonActive: {
            border: '2px solid',
            borderColor: '#4646a5',
            color: '#fff',
            backgroundColor: '#4646a5',
            borderRadius: '18px',
            marginBottom: '0.5em',
            marginRight: '0.5em',
            fontSize: '0.8rem',
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
                axios.post(process.env.REACT_APP_APIURL + "/profile/getBruker", config),
                axios.get(process.env.REACT_APP_APIURL + "/profile/getFagfelt"),
                axios.post(process.env.REACT_APP_APIURL + "/profile/getInteresser", config)
            ])
            // Alle spørringer gjennomført
            .then(axios.spread((res1, res2, res3) => {
                setFnavn(res1.data.results[0].fnavn);
                setEnavn(res1.data.results[0].enavn);
                setTlf(res1.data.results[0].telefon);
                setEmail(res1.data.results[0].email);
                setFagfelt(res2.data);
                setInteresser(res3.data.results);
                // Data er ferdig hentet fra server
                setLoading(false);
            }))
    }

    useEffect( () => {
        setAuth(props.auth)
        fetch();
    }, [props]);

    const deleteInteresse = (id) => {
        // Mottar fagfeltid, som id, for interesse som skal fjernes
        const data = {
            token: token,
            fagfeltid: id
        }
        axios.post(process.env.REACT_APP_APIURL + '/profile/deleteInteresse', data)
        // Oppdaterer tilstanden til relevante arrays
        fetch()
    }

    const insertInteresse = (id) => {
        // Mottar fagfeltid, som id, for interesse som skal legges til
        const data = {
            token: token,
            fagfeltid: id
        }
        axios.post(process.env.REACT_APP_APIURL + '/profile/postInteresse', data)
        // Oppdaterer tilstanden til relevante arrays
        fetch()
    }

    if (loading) {
        return (
            <section id="loading">
                <Loader />
            </section>
        )
    }

    if (auth && !loading) {
    return (
        <div>
            <div className='profile-header' >
                {/* Placeholder account icon */}
                <AccountCircleIcon className={classes.accountCircle} />
                <h1 className='profile-title'> Profil </h1>
            </div>

            <div className='profile-body' >
                <div className='profile-item' >
                <h2 className='profile-subheader' > Personalia </h2>
                <h3 className='profile-navn' > {fnavn + " " + enavn} </h3>
                    <form id="form-profile-tlf" onSubmit={onTlfSubmit} >
                        <FormControl id="form-profile-tlf-control">
                            <InputLabel>Telefonnummer</InputLabel>
                            <Input type="string" variant="outlined" value={tlf} onChange={onTlfChange} required={true} />
                        </FormControl>
                        <Button className={classes.profileButton} type="submit" variant="contained" > {updateText1} </Button>
                    </form>
                    <form id="form-profile-email" onSubmit={onEmailSubmit} >
                        <FormControl id="form-profile-email-control">
                            <InputLabel>E-post</InputLabel>
                            <Input type="email" className={classes.input} variant="outlined" value={email} onChange={onEmailChange} required={true} />
                        </FormControl>
                        <Button className={classes.profileButton} type="submit" variant="contained" > {updateText2} </Button>
                    </form>
                    <form id="form-profile-pwd" onSubmit={onPwdSubmit} >
                        <FormControl id="form-pwd-profile">
                            <InputLabel>Nytt passord</InputLabel>
                            <Input type="password" className={classes.input} variant="outlined" onChange={onPwdChange} required={true} />
                        </FormControl>
                        <FormControl id="form-pwd2-profile">
                            <InputLabel>Bekreft passord</InputLabel>
                            <Input type="password" variant="outlined" onChange={onPwd2Change} required={true} />
                        </FormControl>
                        {/* Viser ulike knapper avhengig av om det finnes input av passord og bekreftet passord */}
                        {pwd == "" || pwd2 == "" ? 
                        <Button id="pwdSubmit" className={classes.profileButton} type="submit" variant="contained" disabled="disabled"> {updateText3} </Button> 
                        :
                        <Button id="pwdSubmit" className={classes.profileButton} type="submit" variant="contained"> {updateText3} </Button>
                        }

                    </form>
                <Alert id="alert-register" className="fade_in" style={{display: alertDisplay}} variant="outlined" severity={alertSeverity}>
                    {alertText}
                </Alert>
                </div>

                <div className='profile-item' >
                    <h2 className='profile-subheader' > Interesser </h2>
                    <div className='interesser' >
                        {/* .map() iterer gjennom objekt i arrayen, og returnerer ett komponent per objekt */}
                        {/* .some(), satt som ternær operatør for visning */}
                        {/* Slik testes det om fagfeltet finnes i tabellen for aktive interesser, og tilsvarende knapp vises */}
                        {interesser !== undefined && fagfelt.map((f, key) => interesser.some(interesse => interesse.fagfeltid == f.fagfeltid) ? (
                            <Button key={key} className={classes.fagfeltButtonActive} onClick={() => deleteInteresse(f.fagfeltid)} >{f.beskrivelse}</Button>
                            ) : (
                            <Button key={key} className={classes.fagfeltButton} onClick={() => insertInteresse(f.fagfeltid)} >{f.beskrivelse}</Button>
                        ))}
                        {/* Om interesse-tabellen er helt tom, som f.eks. ved første besøk av profil-siden, kjører denne mappingen i stedet */}
                        {interesser == undefined && fagfelt.map((f, key) =>  (
                            <Button key={key} className={classes.fagfeltButton} onClick={() => insertInteresse(f.fagfeltid)} >{f.beskrivelse}</Button>
                        ))}
                    </div>
                </div>
                
            </div>

        </div>
    );
    } else {
        return (
            // Brukeren er ikke innlogget, omdiriger
            <NoAccess />
        );
    }
}

export default Profile
