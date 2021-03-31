import React, { useState, useEffect } from 'react';
import { Redirect } from "react-router-dom";
import axios from 'axios';

import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { Button, FilledInput, Switch } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import '../CSS/Profile.css';
import CookieService from '../../../global/Services/CookieService';
import AuthService from '../../../global/Services/AuthService';
import Loader from '../../../global/Components/Loader';

function Profile() {
    // State for loading
    const [loading, setLoading] = useState(true);
    // Autentiseringsstatus
    const [auth, setAuth] = useState(false);
    // Array for alle interesser //
    const [fagfelt, setFagfelt] = useState([]);
    // Array for personalia
    const [bruker, setBruker] = useState([]);
    // Array for aktive interesser
    const [interesser, setInteresser] = useState([]);
    // Innlogget brukers id
    // TODO: Obviously
    const [brukerid, setID] = useState(1);

    const authorize = () => {
        // Henter authtoken-cookie
        const token = CookieService.get("authtoken");
        
        if(token !== undefined) {
            // Om token eksisterer sjekker vi mot serveren om brukeren har en gyldig token
            AuthService.isAuthenticated(token).then(res => {
              if(!res) {
                // Sletter authtoken om token eksisterer lokalt men ikke er gyldig på server
                CookieService.remove("authtoken");
              }
              setAuth(res.authenticated);
            });
          } else {
            setAuth(false);
          }
      };
      

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
            margin: '4vw',
            alignSelf: 'flex-end',
        },

        fagfeltButton: {
            border: '2px solid',
            borderColor: '#4646a5',
            borderRadius: '18px',
            marginBottom: '0.5em',
            // Mange av fagfeltene på disse knappene er såpass lange, stable vertikalt som baseline
            width: '100%',
            fontSize: '1rem',
        },

        fagfeltButtonActive: {
            border: '2px solid',
            borderColor: '#4646a5',
            color: '#fff',
            backgroundColor: '#4646a5',
            borderRadius: '18px',
            marginBottom: '0.5em',
            width: '100%',
            fontSize: '1rem',
        },
    });
    
    const classes = useStyles();

    /* Hent brukerdata fra DB */
    const fetchBruker = async () => {
        const res = await axios.get(process.env.REACT_APP_APIURL + "/profile/getBruker");
        setBruker(res.data);
    }
    
    /* Hent aktive interesser fra DB */
    const fetchInteresser = async () => {
        const res = await axios.get(process.env.REACT_APP_APIURL + "/profile/getInteresse");
        setInteresser(res.data);
    }

    /* Hent fagfelt fra DB */
    const fetchFagfelt = async () => {
        const res = await axios.get(process.env.REACT_APP_APIURL + "/profile/getFagfelt");
        setFagfelt(res.data);
    }

    useEffect( () => {
        authorize();
        fetchBruker();
        fetchFagfelt();
        fetchInteresser();
        setLoading(false);
    }, []);

    const deleteInteresse = (id) => {
        // Mottar fagfeltid for interesse som skal fjernes
        const data = {
            brukerid: brukerid,
            fagfeltid: id
        }
        axios.delete(process.env.REACT_APP_APIURL + '/profile/deleteInteresse', data)
    }

    const insertInteresse = (id) => {
        // Mottar fagfeltid for interesse som skal legges til
        const data = {
            brukerid: brukerid,
            fagfeltid: id
        }
        axios.post(process.env.REACT_APP_APIURL + '/profile/postInteresse', data)
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
                {/* Map oppnår mye av det samme som en provider, uten behovet for flere dokumenter */}
                {bruker.map(b => (
                    <>
                        <FilledInput
                        disabled="true"
                        defaultValue={b.fnavn + ' ' + b.enavn}
                        />
                        <FilledInput
                        defaultValue={b.telefon}
                        />
                        <FilledInput
                        defaultValue={b.email}
                        />
                    </>
                ))}
                <Button 
                    className={classes.profileButton}> 
                    Endre 
                </Button>
                    </div>

                <div className='profile-item' >
                    <h2 className='profile-subheader' > Interesser </h2>
                    <div className='interesser' >
                        {/* Iterer gjennom fagfelt array etter treff på aktive interesser */}
                        {fagfelt.map(f => {
                            // Test om interessen allerede er aktiv //
                            for (var i = 0; i < interesser.length; i++) {
                                // Treff, returner tilsvarende knapp
                                if (interesser[i].fagfeltid == f.fagfeltid) return (
                                    // f.fagfeltid som parameter til oppdatering av interesser
                                     <Button onClick={() => deleteInteresse(f.fagfeltid)} className={classes.fagfeltButtonActive} >{f.beskrivelse}</Button> 
                                )
                                // Ingen treff
                                else return (
                                    <Button onClick={() => insertInteresse(f.fagfeltid)} className={classes.fagfeltButton} >{f.beskrivelse}</Button> 
                                )
                            }
                        })}
                    </div>
                </div>
                
            </div>

        </div>
    );
    } else {
        return (
            // Brukeren er ikke innlogget, omdiriger
            // <Redirect to={{pathname: "/"}} />
            null
        );
    }
}

export default Profile
