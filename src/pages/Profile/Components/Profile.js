import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { Button, FormControl, InputLabel, Input, Avatar, IconButton } from '@material-ui/core';
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
    const [updateTextTlf, setUpdateTextTlf] = useState("Oppdater");
    const [updateTextEmail, setUpdateTextEmail] = useState("Oppdater");
    const [updateTextPwd, setUpdateTextPwd] = useState("Oppdater");
    // Oppdaterings-knapper, tilgjengelighet
    const [updateBtnTlf, setUpdateBtnTlf] = useState(false)
    const [updateBtnEmail, setUpdateBtnEmail] = useState(false)
    
    // States for personalia.
    const [profilbilde, setProfilbilde] = useState()
    const [fnavn, setFnavn] = useState("");
    const [enavn, setEnavn] = useState("");
    const [tlf, setTlf] = useState();
    const [email, setEmail] = useState();

    // Henter authtoken-cookie
    const token = CookieService.get("authtoken");

    // Utføres når avatar/profilbilde endres
    const onImgSubmit = e => {
        e.preventDefault()
        if (e.target.files && e.target.files[0]) {
            const config = new FormData()

            config.append('token', token)
            config.append('image', e.target.files[0])

            axios.post(process.env.REACT_APP_APIURL + "/profile/insertBilde", config).then(res => {
                if (res.data.status === "error") {
                    setAlertDisplay("")
                    setAlertText(res.data.message)
                    setAlertSeverity("error")
                } else {
                    setAlertDisplay("")
                    setAlertText(res.data.message)
                    setAlertSeverity("success")

                    // Test på om dette er første opplastning av et profilbilde
                    let first = false
                    if (profilbilde == undefined) {
                        first = true
                    }
                    if (first) {
                        setProfilbilde(e.target.files[0].name)
                        this.history.push("/profile")
                    }
                    setProfilbilde(e.target.files[0].name)
                }
            })
        }
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
        setUpdateTextTlf("Vennligst vent");
        
        const config = {
            token: token,
            telefon: tlf.replace(/\s/g, '')
        }
        
        axios.post(process.env.REACT_APP_APIURL + "/profile/updateTelefon", config).then(
            setAlertDisplay(""),
            setAlertText("Telefonnummer oppdatert!"),
            setAlertSeverity("success"),
            setUpdateTextTlf("Oppdater"),
            setUpdateBtnTlf(false)
            )
        }
        
        // Utføres når bruker gjør en handling i input-feltet for e-post
        const onEmailChange = e => {
            setEmail(e.target.value);
            setAlertDisplay("none");
            setAlertText("");
        };
    
        // Utføres når e-post forsøkes oppdatert
        const onEmailSubmit = e => {
            e.preventDefault()
            setUpdateTextEmail("Vennligst vent");
            
            const config = {
                token: token,
                epost: email
            }
    
            axios.post(process.env.REACT_APP_APIURL + "/profile/updateEmail", config).then( res => {
                if (res.data.status === "error") {
                    setAlertDisplay("")
                    setAlertText(res.data.message)
                    setAlertSeverity("error")
                    setUpdateTextEmail("Oppdater");
                } else {
                    setAlertDisplay("")
                    setAlertText(res.data.message)
                    setAlertSeverity("success")
                    setUpdateTextEmail("Oppdater");
                    setUpdateBtnEmail(false)
                }
            })
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
        setUpdateTextPwd("Vennligst vent");

        if (pwd === pwd2) {
            const config = {
                token: token,
                pwd: pwd
            }
            axios.post(process.env.REACT_APP_APIURL + "/profile/updatePassord", config).then( res => {
                if (res.data.status === "error") {
                    setAlertDisplay("")
                    setAlertText(res.data.message)
                    setAlertSeverity("error")
                    setUpdateTextPwd("Oppdater");
                } else {
                    setAlertDisplay("")
                    setAlertText(res.data.message)
                    setAlertSeverity("success")
                    setUpdateTextPwd("Oppdater");
                }
            })
        } else {
            setAlertDisplay("");
            setAlertSeverity("error")
            setAlertText("Passordene er ikke like");
            setUpdateTextPwd("Oppdater");
        }
    }

    const useStyles = makeStyles ({
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

    const fetch = () => {
        // Authtoken sendes ved for å hente pålogget brukers ID
        const config = {
            token: token
        }
        axios
            // Flere spørringer kjøres samtidig, vent til ALLE er ferdige
            .all([
                // res1
                axios.post(process.env.REACT_APP_APIURL + "/profile/getBruker", config),
                // res2, etc...
                axios.get(process.env.REACT_APP_APIURL + "/profile/getFagfelt"),
                axios.post(process.env.REACT_APP_APIURL + "/profile/getInteresser", config),
                axios.post(process.env.REACT_APP_APIURL + "/profile/getProfilbilde", config)
            ])
            // Alle spørringer gjennomført
            .then(axios.spread((res1, res2, res3, res4) => {
                setFnavn(res1.data.results[0].fnavn);
                setEnavn(res1.data.results[0].enavn);
                setTlf(res1.data.results[0].telefon);
                setEmail(res1.data.results[0].email);
                setFagfelt(res2.data);
                setInteresser(res3.data.results);
                if (res4.data.results !== undefined) {
                    setProfilbilde(res4.data.results[0].plassering)
                }
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

    const tlfUnlock = () => {
        setUpdateBtnTlf(true)
    }

    const emailUnlock = () => {
        setUpdateBtnEmail(true)
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
                {/* Avatar */}
                <input
                    onChange={onImgSubmit}
                    accept="image/png, image/jpeg"
                    id="avatarInput"
                    style={{
                        display: 'none',
                    }}
                    type="file"
                    />
                <label htmlFor="avatarInput">
                    <IconButton component="span" type="submit" 
                        style={{
                            // "skru av" hover-skygge
                            backgroundColor: '#f9f7f6'
                        }}>
                        <Avatar
                            src={"/uploaded/" + profilbilde } 
                            className={classes.avatar}
                            />
                    </IconButton>
                </label>

                <h1 className='profile-title'> Profil </h1>
            </div>

            <div className='profile-body' >
                <div className='profile-item' >
                <h2 className='profile-subheader' > Personalia </h2>
                <h3 className='profile-navn' > {fnavn + " " + enavn} </h3>
                {/* Kondisjonell rendring, for å "låse" opp og igjen feltet */}
                    {
                        !updateBtnTlf ?
                        <>
                        <FormControl id="form-profile-tlf-control">
                            <InputLabel>Telefonnummer</InputLabel>
                            <Input type="string" variant="outlined" value={tlf} disabled={true} />
                        </FormControl>
                        <Button className={classes.profileButton} variant="contained" onClick={tlfUnlock} > Endre </Button>
                        </>
                        :
                        <form className="profileForm" id="form-profile-tlf" onSubmit={onTlfSubmit} >
                        <FormControl id="form-profile-tlf-control">
                            <InputLabel>Telefonnummer</InputLabel>
                            <Input type="string" variant="outlined" value={tlf} onChange={onTlfChange} required={true} />
                        </FormControl>
                        <Button className={classes.profileButton} type="submit" variant="contained" > {updateTextTlf} </Button>
                        </form>
                    }

                    {
                        !updateBtnEmail ? 
                        <>
                        <FormControl id="form-profile-email-control">
                            <InputLabel>E-post</InputLabel>
                            <Input type="string" variant="outlined" value={email} disabled={true} />
                        </FormControl>
                        <Button className={classes.profileButton} variant="contained" onClick={emailUnlock} > Endre </Button>
                        </>
                        :
                        <form className="profileForm" id="form-profile-email" onSubmit={onEmailSubmit} >
                        <FormControl id="form-profile-email-control">
                            <InputLabel>E-post</InputLabel>
                            <Input type="string" variant="outlined" value={email} onChange={onEmailChange} required={true} />
                        </FormControl>
                        <Button className={classes.profileButton} type="submit" variant="contained" > {updateTextEmail} </Button>
                        </form>
                    }

                    <form className="profileForm" id="form-profile-pwd" onSubmit={onPwdSubmit} >
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
                        <Button id="pwdSubmit" className={classes.profileButton} type="submit" variant="contained" disabled="disabled"> {updateTextPwd} </Button> 
                        :
                        <Button id="pwdSubmit" className={classes.profileButton} type="submit" variant="contained"> {updateTextPwd} </Button>
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
