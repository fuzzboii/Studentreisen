import React from 'react';
import '../CSS/Profile.css';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

function Profile() {

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
            marginLeft: 'auto',
        }
    });
    
    const classes = useStyles();

    /* Placeholder variabler */
    const fnavn = 'Ola';
    const enavn = 'Nordmann';
    const tlf = '123 45 678';
    const epost = '123456@usn.no';

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
                    <h3 className='profile-subitem' > {fnavn} </h3>
                    <h3 className='profile-subitem' > {enavn} </h3>
                    <h3 className='profile-subitem' > {tlf} </h3>
                    <h3 className='profile-subitem' > {epost} </h3>
                    <Button className={classes.profileButton}> Endre </Button>
                </div>

                <div className='profile-item' >
                    <h2 className='profile-subheader' > Konto </h2>
                    <h3 className='profile-subitem' > Innstilling 1 </h3>
                    <h3 className='profile-subitem' > Innstilling 2 </h3>
                    <h3 className='profile-subitem' > Innstilling 3 </h3>
                    <Button className={classes.profileButton}> Endre </Button>
                </div>

                <div className='profile-item' >
                    <h2 className='profile-subheader' > Erfaringer </h2>
                    <h3 className='profile-subitem' > Hva tenker vi her? </h3>
                    <Button className={classes.profileButton}> Endre </Button>
                </div>

                <div className='profile-item' >
                    <h2 className='profile-subheader' > CV </h2>
                    <Button className={classes.profileButton}> Rediger </Button>
                    <Button className={classes.profileButton}> Last ned </Button>
                </div>
            </div>

        </div>
    )
}

export default Profile
