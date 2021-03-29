import React, { useState, useEffect } from 'react';
import { Redirect } from "react-router-dom";
import axios from 'axios';

import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { Button, FilledInput, Switch } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import '../CSS/Profile.css';
import CookieService from '../../../global/Services/CookieService';
import AuthService from '../../../global/Services/AuthService';

function Profile() {
    const [auth, setAuth] = useState(false);
    // Array for alle interesser //
    const [fagfelt, setFagfelt] = useState([]);
    // Variabler for personalia
    const [fnavn, setFnavn] = useState();
    const [enavn, setEnavn] = useState();
    const [telefon, setTelefon] = useState();
    const [email, setEmail] = useState();

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
            marginTop: '2vh'
        },

        profileButton: {
            color: '#fff',
            backgroundColor: '#4646a5',
            margin: '4vw',
            alignSelf: 'flex-end',
        },

        fagfeltButton: {
            
        }
    });
    
    const classes = useStyles();

    useEffect( () => {
        authorize();
        fetchBruker();
        fetchFagfelt();
    }, []);

    /* Hent fagfelt fra DB */
    const fetchFagfelt = async () => {
        const res = await axios.get(process.env.REACT_APP_APIURL + "/profile/getFagfelt");
        setFagfelt(res.data);
    }

    /* Hent brukerdata fra DB */
    const fetchBruker = async () => {
        const res = await axios.get(process.env.REACT_APP_APIURL + "/profile/getBruker");
        setFnavn(res.data.fnavn);
        setEnavn(res.data.enavn);
        setTelefon(res.data.telefon);
        setEmail(res.data.email);
    }

    if (auth) {
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
                    <FilledInput
                        disabled="true"
                        defaultValue={fnavn}
                    />
                    <FilledInput
                        disabled="true"
                        defaultValue={enavn}
                    />
                    <FilledInput
                        defaultValue={telefon}
                    />
                    <FilledInput
                        defaultValue={email}
                    />
                    <Button 
                        disabled="true"
                        className={classes.profileButton}> 
                        Endre 
                    </Button>
                </div>

                <div className='profile-item' >
                    <h2 className='profile-subheader' > Interesser </h2>
                    <div className='interesser' >
                        {/* Denne biten fungerer på samme måte som en provider, uten behovet for flere dokumenter */}
                        {fagfelt.map(fagfelt => (               
                            <Button className={classes.fagfeltButton} >{fagfelt.beskrivelse}</Button>
                        ))}
                        <Button 
                            disabled="true" 
                            className={classes.profileButton}> 
                            Endre 
                        </Button>
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
