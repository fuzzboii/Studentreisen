import { useState, useEffect, useContext, Component } from 'react';

// Studentreisen-assets og komponenter
import '../Styles/courseStyles.css';
import Loader from '../../../global/Components/Loader';
import NoAccess from '../../../global/Components/NoAccess';
import CookieService from '../../../global/Services/CookieService';
import AuthService from '../../../global/Services/AuthService';


class CourseDetail extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            loading : true, authenticated : false, usertype : 1,
            windowWidth : 0,
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
        
        if(!loading && authenticated && (usertype === 4 || usertype === 3 || usertype === 2 || usertype === 1 )) {
            return (            
                <div>
                    
                </div>
            );
        } else {
            return (
                // Ugyldig eller ikke-eksisterende token 
                <NoAccess />
            );
        }
    }  
}

export default CourseDetail;



