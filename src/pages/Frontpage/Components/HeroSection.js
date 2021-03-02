import React from 'react';
import '../../../App.css';
import { Button } from '@material-ui/core';
import '../CSS/HeroSection.css';
import HeroBackgroundTest from '../../../assets/HeroBackgroundTest.jpg';


function HeroSection( {
    lightBg, lightText, lightTextDesc, headline, description, imgStart
}) {
    return (
        <>
            <div 
                className={lightBg ? 'home_hero-section' : 'home_hero-section darkBg'}
            >
                <div className="container">
                    <div className="row home_hero-row"
                    style={{display: 'flex', flexDirection: imgStart === 'start' ? 'row-reverse' : 'row'}}
                    >
                        <div className="column">
                            <h1 className={lightText ? 'heading' : 'heading dark'}>{headline}</h1>
                            <p className={lightTextDesc ? 'home_hero-subtitle' : 'home_hero-subtitle dark'}>{description}</p>
                            <Button className='button' variant="contained" color="default">Sett i gang reisen</Button>                   
                        </div>
                    </div>
                <div className="column"></div>
                    <div className="home_hero-img-wrapper">
                        <img className="home_hero-img" src={HeroBackgroundTest} alt="Campus USN" />
                    </div>
                </div>
            </div>
        </>
    );
}

export default HeroSection