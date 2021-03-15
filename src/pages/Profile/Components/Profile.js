import React from 'react'
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { Button } from '@material-ui/core';

function Profile() {
    return (
        <div>
            <h1> Profile </h1>
            <AccountCircleIcon />
            <h2> Fornavn </h2>
            <h3>Ditt fornavn her</h3>
            <Button>Endre</Button>
            <h2> Etternavn </h2>
            <h3>Ditt etternavn her</h3>
            <Button>Endre</Button>
            <h2> Adresse </h2>
            <h3>Din adresse her</h3>
            <Button>Endre</Button>
            <h2> Telefonnummer </h2>
            <h3>Ditt Telefonnummer her</h3>
            <Button>Endre</Button>
            <h2> E-post </h2>
            <h3>Din e-post her</h3>
            <Button>Endre</Button>
        </div>
    )
}

export default Profile
