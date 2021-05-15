// React spesifikt
import { Component } from 'react';

// Studentreisen-assets og komponenter
import CourseNav from './CourseNav';
import '../Styles/courseStyles.css';
import '../Styles/moduleStyles.css';
import Loader from '../../../global/Components/Loader';
import NoAccess from '../../../global/Components/NoAccess';
import CookieService from '../../../global/Services/CookieService';
import AuthService from '../../../global/Services/AuthService';

// Klassekomponenten for hele kurssiden
class Overview extends Component {
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
        // Bruker autentisert
        if(!this.props.loading && this.props.auth) {
            return (            
                <div>
                    <CourseNav type={this.props.type} />
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


export default Overview; 