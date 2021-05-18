// React-spesifikt
import React from 'react';
import { Link } from 'react-router-dom';

// 3rd-party Packages
import { Button } from '@material-ui/core';

// Studentreisen-assets og komponenter
import '../../../App.css';
import '../CSS/HeroSection.css';
import reise from '../../../assets/reise.svg';


//Data hentes og endres på Data.js.

function HeroSection({
    headline, description, imgStart
}) {
    return (
        <div className={"home_hero-section home_hero-Bg"}>
            <div className="hero-container">
                <div className="row home_hero-row" style={{display: "flex", flexDirection: imgStart === "start" ? "row-reverse" : "row"}}>
                    <div className="home_hero_column">
                        <div className="home_hero-text">
                            <h1 className={"heading"}>{headline}</h1>
                            <p className={"home_hero-subtitle"}>{description}</p>
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