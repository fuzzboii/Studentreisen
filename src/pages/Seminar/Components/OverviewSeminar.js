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
import {SeminarProvider, SeminarFullfortProvider} from './SeminarContext';

class OverviewSeminar extends Component {
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
      const {loading, authenticated} = this.state;

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
              <div className="content-overview">
                <SeminarFullfortProvider>
                  <SeminarProvider>
                    <SeminarNav/>
                  </SeminarProvider>
                </SeminarFullfortProvider>
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
  

export default OverviewSeminar; 