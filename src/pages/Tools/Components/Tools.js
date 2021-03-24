// React-spesifikt
import React, {useState, useMemo} from 'react'

// 3rd-party Packages
import ReactSwipe from 'react-swipe';
import { Tabs, Tab } from '@material-ui/core';

// Studentreisen-assets og komponenter
import UserOverview from './UserOverview';
import CourseOverview from './CourseOverview';
import SeminarOverview from './SeminarOverview';
import Loader from '../../../global/Components/Loader';
import NoAccess from '../../../global/Components/NoAccess';
import '../CSS/Tools.css';


function Tools(props) {
    const [position, setPosition] = useState(0);

    let swiper;
    const swipeOptions = useMemo(() => ({
        continuous: false,
        callback(e) {
            setPosition(e)
        }
    }), []);
  
    const handleTabChange = (e, newIndex) => {
        setPosition(newIndex);
        swiper.slide(newIndex);
    };

    return (
        <>
        {props.loading &&
            // Om vi er i loading fasen (Før mottatt data fra API) vises det et Loading ikon
            <section id="loading">
                <Loader />
            </section>
        }
        
        {!props.loading && props.auth && props.type === 4 &&
            <main>
                <Tabs value={position} onChange={handleTabChange} centered>
                    <Tab label="Brukere"/>
                    <Tab label="Kurs"/>
                    <Tab label="Seminar"/>
                </Tabs>
                <ReactSwipe swipeOptions={swipeOptions} ref={listener => (swiper = listener)}>
                    <div className="div_tools">
                        <UserOverview />
                    </div>
                    <div className="div_tools">
                        <CourseOverview />
                    </div>
                    <div className="div_tools">
                        <SeminarOverview />
                    </div>
                </ReactSwipe>
            </main>
        }{!props.loading && props.auth && (props.type === 3 || props.type === 2) &&
            <main>
                <Tabs value={0} centered>
                    <Tab label="Seminar"/>
                </Tabs>
                <div className="div_tools">
                    <SeminarOverview />
                </div>
            </main>
        }{!props.loading && props.auth && (props.type === 1) &&
            // Ugyldig eller ikke-eksisterende token 
            <NoAccess />
        }
        </>
    );
}

export default Tools;