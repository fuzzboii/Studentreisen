import React from 'react';
import '../../../App.css'
import HeroSection from './HeroSection'
import {homeObjHero} from './Data'
import {homeObjServices} from './Data'
import Services from './Services'
import Loader from '../../../global/Components/Loader';
import { Redirect } from 'react-router';


function Home(props) {
    return (
        <>
        {props.loading &&
            <section id="loading">
                <Loader />
            </section>
        }
        {!props.loading && !props.auth &&
            <>
            <HeroSection {...homeObjHero} />
            <Services {...homeObjServices} />
            </>
        }
        {!props.loading && props.auth &&
            <Redirect to="/overview" />
        }
        </>
    )
}

export default Home;