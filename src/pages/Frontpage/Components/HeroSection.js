// React-spesifikt
import React from 'react';
import { Link } from 'react-router-dom';

// 3rd-party Packages
import { Button } from '@material-ui/core';

// Studentreisen-assets og komponenter
import '../../../App.css';
import '../CSS/HeroSection.css';
import reise from '../../../assets/reise.svg';

// Komponent for HeroSection med enkel mulighet til å bytte farger på tekst dersom det legges til et bakgrunnsbilde fremfor å gjøre større endringer i CSS. 
//Data hentes og endres på Data.js.

function HeroSection({
    lightBg, lightText, lightTextDesc, headline, description, imgStart
}) {
    return (
        <div className={lightBg ? "home_hero-section" : "home_hero-section darkBg"}>
            <div className="hero-container">
                <div className="row home_hero-row" style={{display: "flex", flexDirection: imgStart === "start" ? "row-reverse" : "row"}}>
                    <div className="home_hero_column">
                        <div className="home_hero-text">
                            <h1 className={lightText ? "heading" : "heading dark"}>{headline}</h1>
                            <p className={lightTextDesc ? "home_hero-subtitle" : "home_hero-subtitle dark"}>{description}</p>
                            <Link to="/Register" style={{ textDecoration: "none" }}>
                                <Button className='button' variant="contained" color="default">Sett i gang reisen</Button>
                            </Link>
                        </div>
                    </div>
                    <div className="home_hero_column">
                        <div className="home_hero-img">
                            <img src={reise} alt="Student reise" className="hero-img" imgstart=""  />
                        </div> 
                    </div>
                </div>
            </div>
        </div>     
    );
}

export default HeroSection