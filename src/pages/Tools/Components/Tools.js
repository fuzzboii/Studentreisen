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
        disableScroll: true,
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
            <main id="tools_main">
                <section id="tools_section">
                    <Tabs value={position} onChange={handleTabChange} indicatorColor="primary" textColor="primary" centered>
                        <Tab label="Brukere"/>
                        <Tab label="Kurs"/>
                        <Tab label="Seminar"/>
                    </Tabs>
                </section>
                <ReactSwipe swipeOptions={swipeOptions} ref={listener => (swiper = listener)}>
                    <div className="tools_div">
                        <UserOverview activeTool={position} />
                    </div>
                    <div className="tools_div">
                        <CourseOverview activeTool={position} />
                    </div>
                    <div className="tools_div">
                        <SeminarOverview activeTool={position} />
                    </div>
                </ReactSwipe>
            </main>
        }{!props.loading && props.auth && (props.type === 3 || props.type === 2) &&
            <main id="tools_main">
                <Tabs value={0} centered>
                    <Tab label="Seminar"/>
                </Tabs>
                <div className="tools_div">
                    <SeminarOverview activeTool={2} />
                </div>
            </main>
        }{!props.loading && ((props.auth && (props.type === 1)) || !props.auth) &&
            // Ugyldig eller ikke-eksisterende token 
            <NoAccess />
        }
        </>
    );
}

export default Tools;