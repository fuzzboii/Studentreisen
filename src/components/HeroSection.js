import React from 'react';
import '../App.css';
import { Button } from '@material-ui/core';
import './HeroSection.css';

function HeroSection() {
    return (
        <div className='hero-container'>
            <h1>STUDENTREISEN</h1>
            <p>Noe undertekst her</p>
            <div className="hero-btns">
                <Button className='btns' 

                >
                 Knapp 1 test  
                </Button>
                <Button className='btns' 

                >
                 Knapp 2 test <i className='knapp2' />  
                </Button>                
            </div>
            
        </div>
    )
}

export default HeroSection