import React from 'react';
import '../../../App.css'
import HeroSection from './HeroSection'
import {homeObjOne} from './Data'
import Services from './Services'

function Home() {
    return (
        <>
            <HeroSection {...homeObjOne} />
            <Services /> 
            
        </>
    )
}

export default Home;