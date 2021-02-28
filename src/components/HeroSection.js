import React from 'react';
import '../App.css';
import { Button } from './Button';
import './HeroSection.css';

function HeroSection() {
    return (
        <div className='hero-container'>
            <h1>STUDENTREISEN</h1>
            <p>Noe undertekst her</p>
            <div className="hero-btns">
                <Button className='btns' 
                buttonStyle='btn--outline'
                buttonSize='btn--large'
                >
                 Knapp 1 test  
                </Button>
                <Button className='btns' 
                buttonStyle='btn--primary'
                buttonSize='btn--large'
                >
                 Knapp 2 test <i className='knapp2' />  
                </Button>                
            </div>
            
        </div>
    )
}

export default HeroSection