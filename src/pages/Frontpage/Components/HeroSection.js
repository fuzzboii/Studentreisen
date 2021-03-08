import React from 'react';
import '../../../App.css';
import { Button } from '@material-ui/core';
import { Link } from 'react-router-dom';
import '../CSS/HeroSection.css';
import reise from '../../../assets/reise.svg';


function HeroSection({
    lightBg, lightText, lightTextDesc, headline, description, imgStart
}) {
    return (
        <>
            <div 
                className={lightBg ? 'home_hero-section' : 'home_hero-section darkBg'}
            >
                <div className="hero-container">
                    <div className="row home_hero-row"
                    style={{display: 'flex', flexDirection: imgStart === 'start' ? 'row-reverse' : 'row'}}
                    >
                        <div className="column">
                            <div className="home_hero-text-wrapper">
                                <h1 className={lightText ? 'heading' : 'heading dark'}>{headline}</h1>
                                <p
                                    className={lightTextDesc ? 'home_hero-subtitle' : 'home_hero-subtitle dark'}
                                >
                                    {description}
                                </p>
                                <Link to="/Register" style={{ textDecoration: 'none' }}>
                                    <Button className='button' variant="contained" color="default">Sett i gang reisen</Button>
                                </Link>
                            </div>
                        </div>
                        <div className="column">
                            <div className="home_hero-img-wrapper">
                                <img src={reise} alt='Student reise' className='home_hero-img' imgstart=''  />
                            </div> 
                        </div>
                    </div>
                </div>
            </div>
        </>       
    );
}

export default HeroSection