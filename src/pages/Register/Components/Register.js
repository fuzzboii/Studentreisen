// React-spesifikt
import { Component } from "react";
import { Redirect } from "react-router-dom";

// 3rd-party Packages
import { Button, FormControl, InputLabel, Input } from '@material-ui/core';
import axios from 'axios';
import { withSnackbar } from 'notistack';

// Studentreisen-assets og komponenter
import Loader from '../../../global/Components/Loader';
import CookieService from '../../../global/Services/CookieService';
import '../CSS/Register.css';
import usnlogo from '../../../assets/usn.png';

class Register extends Component {
  constructor(props) {
    super(props)
    // Login-spesifikke states, delt opp i før-visning autentisering, register, alert
    this.state = {loading : props.loading, authenticated : props.auth, 
                  email : "", fnavn : "", enavn : "", pwd : "", pwd2 : "", registerDisabled : false, registerText : "Registrer bruker", registerOpacity: "1",
                  redirectHome : false, redirectLogin : false}
  }


  // Utføres når bruker gjør en handling i input-feltet for e-post
  onEmailChange = e => {
    this.setState({
      email: e.target.value
    });
  };

  // Utføres når bruker gjør en handling i input-feltet for fornavn
  onFnavnChange = e => {
    this.setState({
      fnavn: e.target.value
    });
  };

  // Utføres når bruker gjør en handling i input-feltet for etternavn
  onEnavnChange = e => {
    this.setState({
      enavn: e.target.value
    });
  };

  // Utføres når bruker gjør en handling i input-feltet for passord
  onPwdChange = e => {
    this.setState({
      pwd: e.target.value
    });
  };

  // Utføres når bruker gjør en handling i input-feltet for bekreft passord
  onPwd2Change = e => {
    this.setState({
      pwd2: e.target.value
    });
  };

  handleRegister = e => {
    // Stopper siden fra å laste inn på nytt
    e.preventDefault();

    // Slår midlertidig av "Registrer"-knappen og endrer teksten til "Vennligst vent"
    this.setState({
      registerDisabled: true,
      registerText: "Vennligst vent",
      registerOpacity: "0.6"
    });

    // Sjekker om passordene er like
    if(this.state.pwd === this.state.pwd2) {
      // Definerer objektet med dataen vi sender til server
      const data = {
        email: this.state.email,
        password: this.state.pwd,
        password2: this.state.pwd2,
        fnavn: this.state.fnavn,
        enavn: this.state.enavn
      };

      var loggedin = false;

      // Axios POST request
      axios
        // Henter API URL fra .env og utfører en POST request med dataen fra objektet over
        // Axios serialiserer objektet til JSON selv
        .post(process.env.REACT_APP_APIURL + "/auth/register", data)
        // Utføres ved mottatt resultat
        .then(res => {
          if(res.data.message === "OK") {
            // Mottok OK fra server
            loggedin = true;
            if(res.data.authtoken) {
              // Mottok også authtoken, sender bruker til forsiden med cookie satt
              let date = new Date();
              date.setTime(date.getTime() + ((60 * 3) * 60 * 1000));

              const options = { path: "/", expires: date };
              CookieService.set('authtoken', res.data.authtoken, options);
              
              // Brukeren har blitt opprettet, sender til forsiden  
              this.props.enqueueSnackbar("Brukeren har blitt opprettet og du er nå innlogget, du blir sendt til forsiden om få sekunder", { 
                  variant: 'success',
                  autoHideDuration: 5000,
              });

              setTimeout(() => {
                this.setState({
                  redirectHome: true
                })
              }, 5000);
            } else {
              // Brukeren ble opprettet, men mottok ikke en authtoken, sender til login
              this.props.enqueueSnackbar("Brukeren har blitt opprettet, du blir sendt til side for innlogging om få sekunder", { 
                  variant: 'success',
                  autoHideDuration: 5000,
              });

              setTimeout(() => {
                this.setState({
                  redirectLogin: true
                })
              }, 5000);
            }
          } else {
              // Feil oppstod ved registrering av ny bruker, viser meldingen
              this.props.enqueueSnackbar(res.data.message, { 
                  variant: 'error',
                  autoHideDuration: 7000,
              });
          }
        })
        .catch(err => {
          // En feil oppstod ved oppkobling til server
          this.props.enqueueSnackbar("En intern feil oppstod, vennligst forsøk igjen senere", { 
              variant: 'error',
              autoHideDuration: 5000,
          });
        })
        // Utføres alltid uavhengig av andre resultater
        .finally(() => {
          // Gjør Registrer bruker knappen tilgjengelig igjen om bruker ikke er registrert over
          if(!loggedin) {
            this.setState({
              registerDisabled: false,
              registerText: "Registrer bruker",
              registerOpacity: "1"
            });
          }
        });
    } else {
      // Brukeren har oppgitt ulike passord
      this.props.enqueueSnackbar("Passordene er ikke like", { 
        variant: 'error',
        autoHideDuration: 5000,
      });
      this.setState({
        registerDisabled: false,
        registerText: "Registrer bruker",
        registerOpacity: "1"
      });
    }
  };
  
  render() {

    // Om vi er i loading fasen (Før mottatt data fra API) vises det et Loading ikon
    if(this.props.loading) {
      return (
        <section id="loading">
          <Loader />
        </section>
      );
    }

    if(this.state.redirectHome) {
      return <Redirect to={{pathname: "/Overview"}} />;
    } else if(this.state.redirectLogin) {
      return <Redirect to={{pathname: "/Login"}} />;
    }
    
    if(!this.props.loading && !this.props.auth) {
      return (
        <main id="main_register">
          <section id="section_logo_register">
            <img src={usnlogo} alt="USN logo" />
          </section>
          <form id="form_register" onSubmit={this.handleRegister}>
            <FormControl id="form_email_register">
              <InputLabel>E-post</InputLabel>
              <Input type="email" onChange={this.onEmailChange} value={this.state.email} onKeyUp={this.onSubmit} className="form_input_register" required={true} autoFocus={true} variant="outlined" />
            </FormControl> 
            <FormControl id="form_fnavn_register">
              <InputLabel>Fornavn</InputLabel>
              <Input type="string" onChange={this.onFnavnChange} value={this.state.fname} onKeyUp={this.onSubmit} className="form_input_register" required={true} variant="outlined" />
            </FormControl>
            <FormControl id="form_enavn_register">
              <InputLabel>Etternavn</InputLabel>
              <Input type="string" onChange={this.onEnavnChange} value={this.state.ename} onKeyUp={this.onSubmit} className="form_input_register" required={true} variant="outlined" />
            </FormControl>
            <FormControl id="form_password_register">
              <InputLabel>Passord</InputLabel>
              <Input type="password" onChange={this.onPwdChange} value={this.state.pwd} onKeyUp={this.onSubmit} className="form_input_register" required={true} variant="outlined" />
            </FormControl>  
            <FormControl id="form_password_register">
              <InputLabel>Bekreft Passord</InputLabel>
              <Input type="password" onChange={this.onPwd2Change} value={this.state.pwd2} onKeyUp={this.onSubmit} className="form_input_register" required={true} variant="outlined" />
            </FormControl>  
            <Button type="submit" id="form_btn_register" disabled={this.state.registerDisabled} style={{opacity: this.state.registerOpacity}} variant="contained">{this.state.registerText}</Button>  
          </form>
        </main>
      )
    } else {
      return (
        // Brukeren er allerede innlogget, går til forsiden
        <Redirect to={{pathname: "/"}} />
      );
    }
  }
}

export default withSnackbar(Register);
