// React-spesifikt
import { Component } from "react";
import { Redirect } from "react-router-dom";

// 3rd-party Packages
import { Button, FormControl, InputLabel, Input, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Checkbox, FormControlLabel } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import axios from 'axios';

// Studentreisen-assets og komponenter
import Loader from '../../../global/Components/Loader';
import CookieService from '../../../global/Services/CookieService';
import AuthService from '../../../global/Services/AuthService';
import '../CSS/Login.css';
import usnlogo from '../../../assets/usn.png';

class Login extends Component {
  constructor(props) {
    super(props)
    // Login-spesifikke states, delt opp i før-visning autentisering, login, alert og glemt passord
    this.state = {loading : true, authenticated : false, 
                  email : "", pwd : "", remember : false, loginDisabled : false, loginText : "Logg inn", loginOpacity: "1",
                  alertDisplay : "none", alertText : "",
                  forgotEmail : "", forgotDisplay : false, forgotBtnDisabled : false, forgotAlertDisplay : "none", forgotAlertText : "", forgotAlertSeverity : "error"}
  }

  // Utføres når bruker gjør en handling i input-feltet for e-post
  onEmailChange = e => {
    this.setState({
      email: e.target.value,
      alertDisplay: "none",
      alertText: ""
    });
  };

  // Utføres når bruker gjør en handling i input-feltet for passord
  onPasswordChange = e => {
    this.setState({
      pwd: e.target.value,
      alertDisplay: "none",
      alertText: ""
    });
  };

  // Utføres når bruker gjør en handling i checkbox-feltet for "Husk meg"
  onRememberChange = e => {
    this.setState({
      remember: e.target.checked
    });
  };
  
  // Utføres når bruker trykker på "Logg inn" eller trykker på Enter i ett av input-feltene
  handleLogin = e => {
    // Stopper siden fra å laste inn på nytt
    e.preventDefault();

    // Slår midlertidig av "Logg inn"-knappen og endrer teksten til "Vennligst vent"
    this.setState({
      loginDisabled: true,
      loginText: "Vennligst vent",
      loginOpacity: "0.6"
    });

    // Definerer objektet med dataen vi sender til server
    const data = {
      email: this.state.email,
      pwd: this.state.pwd,
      remember: this.state.remember
    };

    // Axios POST request
    axios
      // Henter API URL fra .env og utfører en POST request med dataen fra objektet over
      // Axios serialiserer objektet til JSON selv
      .post(process.env.REACT_APP_APIURL + "/auth/login", data)
      // Utføres ved mottatt resultat
      .then(res => {
        if(res.data.authtoken) {
            // Mottok autentiserings-token fra server, lagrer i Cookie
            this.setState({
              authenticated: true
            });

            // Sjekker om bruker har satt "Husk meg"
            if(!this.state.remember) {
              let date = new Date();
              // Token utløper om 3 timer om "Husk meg" ikke er satt
              date.setTime(date.getTime() + ((60 * 3) * 60 * 1000));

              const options = { path: "/", expires: date };
              CookieService.set('authtoken', res.data.authtoken, options);
              
              this.props.history.push('/');
            } else {
              let date = new Date();
              // Token utløper om 72 timer om "Husk meg" ikke er satt
              date.setTime(date.getTime() + ((60 * 72) * 60 * 1000));

              const options = { path: "/", expires: date };
              CookieService.set('authtoken', res.data.authtoken, options);
              
              this.props.history.push('/');
            }
        } else {
            // Feil oppstod ved innlogging, viser meldingen
            this.setState({
              alertDisplay: "",
              alertText: res.data.message
            });
        }
      })
      .catch(err => {
        // En feil oppstod ved oppkobling til server
        this.setState({
          alertDisplay: "",
          alertText: "En intern feil oppstod, vennligst forsøk igjen senere"
        });
      // Utføres alltid uavhengig av andre resultater
      }).finally( () => {
        // Gjør Logg inn knappen tilgjengelig igjen om bruker ikke er autentisert over
        if(!this.state.authenticated) {
          this.setState({
            loginDisabled: false,
            loginText: "Logg inn",
            loginOpacity: "1"
          });
        }
      });
  };

  // Utføres om bruker trykker på "Tilbakestill passord" i del for Glemt passord
  handleForgot = () => {
    // Slår midlertidig av "Tilbakestill passord"-knappen
    this.setState({
      forgotBtnDisabled: true
    });

    // Sørger for at eposten er fyllt inn
    if(this.state.forgotEmail !== "") {
      // Epost validering med regex
      if (/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i.test(this.state.forgotEmail)) {
        // Axios POST request
        axios
          // Henter API URL fra .env og utfører en POST request med dataen fra objektet over
          // Axios serialiserer objektet til JSON selv
          .post(process.env.REACT_APP_APIURL + "/forgotPassword", {epost : this.state.forgotEmail})
          // Utføres ved mottatt resultat
          .then(res => {
            if(res.data.status == "success") {
              this.setState({
                forgotAlertDisplay: "",
                forgotAlertText: "Om e-posten er registrert hos oss vil du motta en lenke for tilbakestilling snart",
                forgotAlertSeverity: "success"
              });
            } else {
              // Feil oppstod, viser meldingen
              this.setState({
                forgotAlertDisplay: "",
                forgotAlertText: res.data.message
              });
            }
          })
          .catch(err => {
            // En feil oppstod ved oppkobling til server
            this.setState({
              forgotAlertDisplay: "",
              forgotAlertText: "En intern feil oppstod, vennligst forsøk igjen senere"
            });
          // Utføres alltid uavhengig av andre resultater
          }).finally( () => {
            // Gjør "Tilbakestill passord"-knappen tilgjengelig igjen
            this.setState({
              forgotBtnDisabled: false
          });
        });
      } else {
        // Ugyldig epost
        this.setState({
          forgotAlertDisplay: "",
          forgotAlertText: "E-post adressen er ugyldig",
          forgotBtnDisabled: false
        });
      }
    } else {
      // Ingen epost oppgitt
      this.setState({
        forgotAlertDisplay: "",
        forgotAlertText: "E-post er ikke fylt inn",
        forgotBtnDisabled: false
      });
    }
  };

  // Utføres når bruker gjør en handling i input-feltet for "Glemt passord"
  onForgotChange = e => {
    this.setState({
      forgotEmail: e.target.value,
      forgotAlertDisplay: "none",
      forgotAlertText: "",
      forgotAlertSeverity: "error"
    });
  };

  // Utføres når bruker trykker på knappen "Glemt passord"
  handleClickForgot = () => {
    this.setState({
      forgotDisplay: true
    });
  };

  // Utføres når bruker trykker utenfor dialogen for "Glemt passord", eller når bruker trykker på knapp "Avbryt" i "Glemt passord"
  handleCloseForgot = () => {
    this.setState({
      forgotDisplay: false
    });
  };

  // Utføres når bruker trykker på knapp "Ny bruker"
  gotoRegister = () => {
    // Navigerer til /register/
    this.props.history.push('/register/');
  };

  // Utføres når alle komponentene er lastet inn og er det siste steget i mounting-fasen
  componentDidMount() {
    // Henter authtoken-cookie
    const token = CookieService.get("authtoken");

    if(token !== undefined) {
      // Om token eksisterer sjekker vi mot serveren om brukeren har en gyldig token
      AuthService.isAuthenticated(token).then(res => {
        if(!res) {
          // Sletter authtoken om token eksisterer lokalt men ikke er gyldig på server
          CookieService.remove("authtoken");
        }
        this.setState({
          authenticated : res,
          loading: false
        });
      });
    } else {
      this.setState({
        authenticated : false,
        loading: false
      });
    }
  };

  render() {
    const {loading, authenticated} = this.state;

    // Om vi er i loading fasen (Før mottatt data fra API) vises det et Loading ikon
    if(loading) {
      return(
        <section id="loading">
          <Loader />
        </section>
      );
    }
    
    if(!loading && !authenticated) {
      // Når loading fasen er komplett og bruker ikke er innlogget, vis innholdet på Login-siden
      return (
        <main id="main_login">
          <section id="section_logo_login">
            <img src={usnlogo} alt="USN logo" />
          </section>
          <Alert id="alert_login" className="fade_in" style={{display: this.state.alertDisplay}} variant="outlined" severity="error">
            {this.state.alertText}
          </Alert>
          <form id="form_login" onSubmit={this.handleLogin}>
            <FormControl id="form_email_login">
              <InputLabel>E-post</InputLabel>
              <Input type="email" className="form_input_login" required={true} value={this.state.email} onKeyUp={this.onSubmit} onChange={this.onEmailChange} autoFocus={true} autoComplete="email" variant="outlined" />
            </FormControl>
            <FormControl id="form_password_login">
              <InputLabel>Passord</InputLabel>
              <Input className="form_input_login" required={true} value={this.state.password} onKeyUp={this.onSubmit} onChange={this.onPasswordChange} autoComplete="current-password" variant="outlined" type="password" />
            </FormControl>
            <FormControlLabel id="form_huskmeg" control={<Checkbox value={this.state.remember} onChange={this.onRememberChange} color="primary" />} label="Husk meg" labelPlacement="end" />
            <Button onClick={this.handleClickForgot} id="form_glemt_login" variant="outlined">Glemt Passord</Button>
            <Button onClick={this.gotoRegister} variant="outlined">Ny bruker</Button>
            <Button type="submit" id="form_btn_login" disabled={this.state.loginDisabled} style={{opacity: this.state.loginOpacity}} variant="contained">{this.state.loginText}</Button>
          </form>
          <Dialog open={this.state.forgotDisplay} onClose={this.handleCloseForgot} aria-labelledby="dialog_glemt_tittel">
            <DialogTitle id="dialog_glemt_tittel">Glemt passord</DialogTitle>
            <DialogContent>
              <DialogContentText>Skriv inn e-posten for å tilbakestille passordet ditt</DialogContentText>
              <Alert id="alert_dialog_glemt" className="fade_in" style={{display: this.state.forgotAlertDisplay}} severity={this.state.forgotAlertSeverity}>
                {this.state.forgotAlertText}
              </Alert>
              <TextField autoFocus margin="dense" value={this.state.forgotEmail} onChange={this.onForgotChange} label="E-post" type="email" fullWidth />
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleCloseForgot} color="primary">Avbryt</Button>
              <Button id="dialog_glemt_btn" disabled={this.state.forgotBtnDisabled} onClick={this.handleForgot} color="primary">Tilbakestill passord</Button>
            </DialogActions>
          </Dialog>
        </main>
      );
    } else {
      return (
        // Brukeren er allerede innlogget, går til forsiden
        <Redirect to={{pathname: "/"}} />
      );
    }
  }
}

export default Login;
