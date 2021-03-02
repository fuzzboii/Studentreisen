import React from 'react';
import '../../../App.css';
import { Button } from '@material-ui/core';
import '../CSS/HeroSection.css';

function HeroSection() {
    return (
        <div className='hero-container'>
            <h1>STUDENTREISEN</h1>
            <p>Noe undertekst her</p>
            <div className="hero-btns">
                <Button className='btns' variant="contained" color="primary">
                 Sett i gang reisen  
                </Button>              
            </div>
            
        </div>
    )
}

export default HeroSection