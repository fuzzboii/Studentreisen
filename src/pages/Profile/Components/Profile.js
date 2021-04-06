import React, { useState, useEffect } from 'react';
import { Redirect } from "react-router-dom";
import axios from 'axios';

import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { Button, FilledInput, Switch } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import '../CSS/Profile.css';
import CookieService from '../../../global/Services/CookieService';
import Loader from '../../../global/Components/Loader';

function Profile(props) {
    // State for loading mens vi venter på svar fra server
    const [loading, setLoading] = useState(true);
    // Autentiseringsstatus
    const [auth, setAuth] = useState(false);
    // Array for alle interesser //
    const [fagfelt, setFagfelt] = useState([]);
    // Array for aktive interesser
    const [interesser, setInteresser] = useState([[-1, -1]]);

    
    // States for personalia.
    // NB! ved bruk av axios.get kunne resultatet fylle et array med objekt som forventet,
    // men ved bruk av axios.post (nå som det sendes en authtoken til server) støtte jeg på uventet oppførsel.
    const [fnavn, setFnavn] = useState("");
    const [enavn, setEnavn] = useState("");
    const [tlf, setTlf] = useState();
    const [email, setEmail] = useState();

    // Henter authtoken-cookie
    const token = CookieService.get("authtoken");

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
                console.log("Ferdig lastet")
            }))
    }

    useEffect( () => {
        setAuth(props.auth)
        console.log("Autentisert")
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
                    <FilledInput
                    disabled={true}
                    defaultValue={fnavn + ' ' + enavn}
                    />
                    <FilledInput
                    defaultValue={tlf}
                    />
                    <FilledInput
                    defaultValue={email}
                    />
                    <Button 
                        className={classes.profileButton}> 
                        Endre 
                    </Button>
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
    } if (!loading && !auth) {
        console.log("Omdirigerer")
        return (
            // Brukeren er ikke innlogget, omdiriger
            null
        );
    }
}

export default Profile
