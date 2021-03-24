// React-spesifikt
import React, {useState, useMemo} from 'react'
import { Component } from "react";

// 3rd-party Packages
import ReactSwipe from 'react-swipe';
import { Tabs, Tab } from '@material-ui/core';

// Studentreisen-assets og komponenter
import UserOverview from './UserOverview';
import CourseOverview from './CourseOverview';
import '../CSS/Tools.css';
import Loader from '../../../global/Components/Loader';
import NoAccess from '../../../global/Components/NoAccess';
import CookieService from '../../../global/Services/CookieService';
import AuthService from '../../../global/Services/AuthService';
import SeminarOverview from './SeminarOverview';

class Tools extends Component { 
    constructor(props) {
        super(props);
        
        this.state = {
            loading : true, authenticated : false, usertype : 1
        }
    }

    componentDidMount() {
        // Henter authtoken-cookie
        const token = CookieService.get("authtoken");

        if(token !== undefined) {
            // Om token eksisterer sjekker vi mot serveren om brukeren har en gyldig token
            AuthService.isAuthenticated(token).then(res => {
                if(!res.authenticated) {
                    // Sletter authtoken om token eksisterer lokalt men ikke er gyldig på server
                    CookieService.remove("authtoken");
                }
                this.setState({
                    authenticated : res.authenticated,
                    usertype : res.usertype,
                    loading: false
                });
            });
        } else {
            this.setState({
                authenticated : false,
                loading: false
            });
        }
    }

    render() {
        const {loading, authenticated, usertype} = this.state;

        if(loading) {
            // Om vi er i loading fasen (Før mottatt data fra API) vises det et Loading ikon
            return(
                <section id="loading">
                    <Loader />
                </section>
            );
        }
        
        if(!loading && authenticated && usertype === 4) {
            return (
                <SwipeWAdmin />
            )
        } else if(!loading && authenticated && (usertype === 3 || usertype === 2)) {
            return (
                <main>
                    <Tabs value={0} centered>
                        <Tab label="Seminar"/>
                    </Tabs>
                    <div className="div_tools">
                        <SeminarOverview />
                    </div>
                </main>
            )
        } else {
            return (
                // Ugyldig eller ikke-eksisterende token 
                <NoAccess />
            );
        }
    }
}


const SwipeWAdmin = () => {
    let swiper;
    const [position, setPosition] = useState(0);
  
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
    );
};

export default Tools;