// React spesifikt
import { Component } from 'react';
// 3rd-party Packages

// Studentreisen-assets og komponenter
import '../CSS/Seminar.css';
import Loader from '../../../global/Components/Loader';
import NoAccess from '../../../global/Components/NoAccess';
import CookieService from '../../../global/Services/CookieService';
import AuthService from '../../../global/Services/AuthService'; 
import SeminarNav from './SeminarNav';


class SeminarOverview extends Component {
    constructor(props) {
      super(props);
      
      this.state = {
          loading : true, authenticated : false, 
      }
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
                <div className="Seminar-Content">
                    <SeminarNav type={this.props.type} brukerid={this.props.brukerid} />
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
    

export default SeminarOverview; 