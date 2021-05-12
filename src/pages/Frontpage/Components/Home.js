import React from 'react';
import '../../../App.css'
import HeroSection from './HeroSection'
import {homeObjOne} from './Data'
import {homeObjTwo} from './Data'
import Services from './Services'
import Loader from '../../../global/Components/Loader';
import { Redirect } from 'react-router';


function Home(props) {
    console.log(props);
    
    return (
        <>
        {props.loading &&
            <section id="loading">
                <Loader />
            </section>
        }
        {!props.loading && !props.auth &&
            <>
            <HeroSection {...homeObjOne} />
            <Services {...homeObjTwo} />
            </>
        }
        {!props.loading && props.auth &&
            <Redirect to="/overview" />
        }
        </>
    )
}

export default Home;