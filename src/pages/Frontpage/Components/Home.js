import React from 'react';
import '../../../App.css'
import HeroSection from './HeroSection'
import {homeObjOne} from './Data'
import {homeObjTwo} from './Data'
import Services from './Services'

function Home() {
    return (
        <>
            <HeroSection {...homeObjOne} />
            <Services {...homeObjTwo} /> 
            
        </>
    )
}

export default Home;