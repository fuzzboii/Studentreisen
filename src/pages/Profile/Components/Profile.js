import React, { useState, useEffect } from 'react';
import '../CSS/Profile.css';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { Button, FilledInput, Switch } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import CookieService from '../../../global/Services/CookieService';
import AuthService from '../../../global/Services/AuthService';

function Profile() {

    const [auth, setAuth] = useState(false);

    const authorize = () => {
        // Henter authtoken-cookie
        const token = CookieService.get("authtoken");
        
        if(token !== undefined) {
          // Om token eksisterer sjekker vi mot serveren om brukeren har en gyldig token
          AuthService.isAuthenticated(token).then(res => {
            if(!res.authenticated) {
              // Sletter authtoken om token eksisterer lokalt men ikke er gyldig på server
              CookieService.remove("authtoken");
            } else {
              setAuth(true);
            }
          });
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
            alignSelf: 'flex-end'
        }
    });
    
    const classes = useStyles();

    useEffect( () => {
        authorize();
    }, []);

    /* Placeholder variabler */
    const fnavn = 'Ola';
    const enavn = 'Nordmann';
    const tlf = '123 45 678';
    const epost = '123456@usn.no';

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
                        defaultValue={fnavn}
                    />
                    <FilledInput
                        defaultValue={enavn}
                    />
                    <FilledInput
                        defaultValue={tlf}
                    />
                    <FilledInput
                        defaultValue={epost}
                    />
                    <Button className={classes.profileButton}> Endre </Button>
                </div>

                <div className='profile-item' >
                    <h2 className='profile-subheader' > Konto </h2>
                    <div className='profile-setting'>
                        <h3 className='profile-subitem' > Innstilling 1 </h3>
                        <Switch color='primary' />
                    </div>
                    <div className='profile-setting'>
                        <h3 className='profile-subitem' > Innstilling 2 </h3>
                        <Switch color='primary' />
                    </div>
                    <div className='profile-setting'>
                        <h3 className='profile-subitem' > Innstilling 3 </h3>
                        <Switch color='primary' />
                    </div>
                </div>
                
            </div>

        </div>
    )} else {
        return (
            <h1> Du er ikke innlogget. Har du gått deg vill? </h1>
        )}
}

export default Profile
