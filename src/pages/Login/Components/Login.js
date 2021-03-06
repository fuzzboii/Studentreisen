import React, { Component } from "react";
import { Button, FormControl, InputLabel, Input, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Checkbox, FormControlLabel } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import axios from 'axios';

import Loader from '../../../global/Components/Loader';
import CookieService from '../../../global/Services/CookieService';
import AuthService from '../../../global/Services/AuthService';
import '../CSS/Login.css';
import usnlogo from '../../../assets/usn.png';
import { Redirect } from "react-router-dom";

class Login extends Component {
  constructor () {
    super()
    this.state = {loading : true, authenticated : false, email : "", pwd : "", remember : false, loginDisabled : false, loginText : "Logg inn",
                  alertDisplay : "none", alertText : "",
                  forgotEmail : "", forgotDisplay : false, forgotBtnDisabled : false, forgotAlertDisplay : "none", forgotAlertText : "", forgotAlertSeverity : "error"}
  }

  onEmailChange = e => {
    this.setState({
      email: e.target.value,
      alertDisplay: "none",
      alertText: ""
    });
  };

  onPasswordChange = e => {
    this.setState({
      pwd: e.target.value,
      alertDisplay: "none",
      alertText: ""
    });
  };

  onRememberChange = e => {
    this.setState({
      remember: e.target.checked
    });
  };
  
  handleLogin = e => {
    e.preventDefault();

    // Slår midlertidig av knappen
    this.setState({
      loginDisabled: true,
      loginText: "Vennligst vent"
    });

    const data = {
      email: this.state.email,
      pwd: this.state.pwd,
      remember: this.state.remember
    };

    axios
      .post(process.env.REACT_APP_APIURL + "/auth/login", data)
      .then(res => {
        if(res.data.authtoken) {
            // Mottok autentiserings-token fra server, lagrer i Cookie

            // Sjekker om bruker har satt "Husk meg"
            if(!this.state.remember) {
              let date = new Date();
              date.setTime(date.getTime() + ((60 * 3) * 60 * 1000));

              const options = { path: "/", expires: date };
              CookieService.set('authtoken', res.data.authtoken, options);
              
              this.props.history.push('/');
            } else {
              let date = new Date();
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
      }).finally( () => {
        // Utføres alltid til slutt, gjør Logg inn knappen tilgjengelig igjen
        this.setState({
          loginDisabled: false,
          loginText: "Logg inn"
        });
      });
  };

  handleForgot = () => {
    this.setState({
      forgotBtnDisabled: true
    });

    // Henter eposten brukeren har oppgitt
    const epost = document.getElementById("dialog_glemt_epost").value;

    if(epost !== "") {
      // Epost validering med regex
      if (/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i.test(epost)) {
        // Axios API
        axios
        .post(process.env.REACT_APP_APIURL + "/forgotPassword", {epost})
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
        }).finally( () => {
          // Utføres alltid til slutt, gjør Tilbakestill knappen tilgjengelig igjen
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

  removeDialogAlert = () => {
    this.setState({
      forgotAlertDisplay: "none",
      forgotAlertText: "",
      forgotAlertSeverity: "error"
    });
  };

  handleClickForgot = () => {
    this.setState({
      forgotDisplay: true
    });
  };

  handleCloseForgot = () => {
    this.setState({
      forgotDisplay: false
    });
  };

  gotoRegister = () => {
    this.props.history.push('/register/');
  };

  componentDidMount() {
    // Check if the user is already authenticated
    const token = CookieService.get("authtoken");

    AuthService.isAuthenticated(token).then(res => {
      this.setState({
        authenticated : res,
        loading: false
      });
    });
  };

  render() {
    const {loading, authenticated} = this.state;

    if(loading) {
      return(
        <main id="loading">
          <Loader/>
        </main>
      );
    }
    
    if(!loading && !authenticated) {
      // Brukeren er foreløpig ikke innlogget, viser login-side
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
            <Button type="submit" id="form_btn_login" disabled={this.state.loginDisabled} variant="contained">{this.state.loginText}</Button>
          </form>
          <Dialog open={this.state.forgotDisplay} onClose={this.handleCloseForgot} aria-labelledby="dialog_glemt_tittel">
            <DialogTitle id="dialog_glemt_tittel">Glemt passord</DialogTitle>
            <DialogContent>
              <DialogContentText>Skriv inn e-posten for å tilbakestille passordet ditt</DialogContentText>
              <Alert id="alert_dialog_glemt" className="fade_in" style={{display: this.state.forgotAlertDisplay}} severity={this.state.forgotAlertSeverity}>
                {this.state.forgotAlertText}
              </Alert>
              <TextField autoFocus id="dialog_glemt_epost" margin="dense" onChange={this.removeDialogAlert} label="E-post" type="email" fullWidth />
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
