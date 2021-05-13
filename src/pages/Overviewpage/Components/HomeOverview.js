import { Component } from 'react';
import {Redirect, useLocation} from 'react-router-dom';

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


class HomeOverview extends Component {
    constructor(props) {
        super(props);
    }

    render() {

        if(this.props.loading) {
            // Om vi er i loading fasen (Før mottatt data fra API) vises det et Loading ikon
            return(
                <section id="loading">
                    <Loader />
                </section>
            );
        }
        
        if(!this.props.loading && this.props.auth) {
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
                <Redirect to="/"/>
            );
        }
    }    
}   


export default HomeOverview; 