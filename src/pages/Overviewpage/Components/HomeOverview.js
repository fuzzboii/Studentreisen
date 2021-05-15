// React spesifikt
import { Component } from 'react';
import {useLocation} from 'react-router-dom';

// Studentreisen-assets og komponenter
import '../Styles/styles.css';
import CardLinks from './CardLinks';
import EnlistedList from './EnlistedList';
import {EnlistedProvider} from './EnlistedContext';
import Loader from '../../../global/Components/Loader';
import NoAccess from '../../../global/Components/NoAccess';
import CookieService from '../../../global/Services/CookieService';
import AuthService from '../../../global/Services/AuthService';

export const LocationDisplay = () => {
    const location = useLocation()
  
    return <div data-testid="location-display">{location.pathname}</div>
  }

// Klassekomponenten for hovedsiden
class HomeOverview extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            loading : true, authenticated : false, 
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
        
        if(!loading && authenticated) {
            return (            
                <div className="main">
                    <div className="cardLink-Wrap">
                        <h1 className="mainTitle">Utforsk</h1>
                        <CardLinks/>
                    </div>
                    <div className="enlist-Wrap">
                        <h1 className="mainTitle">Se påmeldte seminarer</h1>
                        <EnlistedProvider>
                            <EnlistedList/>
                        </EnlistedProvider>
                    </div>
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


export default HomeOverview; 