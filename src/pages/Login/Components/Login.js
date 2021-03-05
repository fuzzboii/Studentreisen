import React, { Component } from "react";
import { Button, FormControl, InputLabel, Input, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import axios from 'axios';
import '../CSS/Login.css';
import usnlogo from '../../../assets/usn.png';

class Login extends Component {
  state = {
    email: "",
    pwd: ""
  };

  alert = {
    display: "none",
    text: ""
  };

  forgot = {
    epost: "",
    display: true,
    alertDisplay: "none",
    alertText: "",
    alertSeverity: "error"
  };

  onEmailChange = e => {
    this.setState({
      email: e.target.value
    });
    this.alert.display = "none";
    this.alert.text = "";
  };

  onPasswordChange = e => {
    this.setState({
      pwd: e.target.value
    });
    this.alert.display = "none";
    this.alert.text = "";
  };
  
  handleLogin = e => {
    e.preventDefault();

    // Slår midlertidig av knappen
    const login_btn = document.getElementById("form_btn_login");
    login_btn.disabled = true;
    login_btn.innerHTML = "Vennligst vent";
    login_btn.style.opacity = "50%";

    const data = {
      email: this.state.email,
      pwd: this.state.pwd
    };

    axios
      .post(process.env.REACT_APP_APIURL + "/login", data)
      .then(res => {
        if(res.headers.authtoken) {
            // Mottok autentiserings-token fra server, lagrer i Cookie
        } else {
            // Feil oppstod ved innlogging, viser meldingen
            this.alert.display = "";
            this.alert.text = res.data.message;
            this.forceUpdate();
        }
      })
      .catch(err => {
        // En feil oppstod ved oppkobling til server
        this.alert.display = "";
        this.alert.text = "En intern feil oppstod, vennligst forsøk igjen senere";
        this.forceUpdate();
      }).finally( () => {
        // Utføres alltid til slutt, gjør Logg inn knappen tilgjengelig igjen
        login_btn.disabled = false;
        login_btn.innerHTML = "Logg inn";
        login_btn.style.opacity = "100%";
      });
  };

  handleForgot = () => {
    // Henter eposten brukeren har oppgitt
    const epost = document.getElementById("dialog_glemt_epost").value;

    if(epost !== "") {
      // Epost validering med regex
      if (/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i.test(epost)) {
        // Axios API
        this.forgot.alertDisplay = "";
        this.forgot.alertText = "Om e-posten er registrert hos oss vil du motta en lenke for tilbakestilling snart";
        this.forgot.alertSeverity = "success";
        this.forceUpdate();
      } else {
        // Ugyldig epost
        this.forgot.alertDisplay = "";
        this.forgot.alertText = "E-posten er ikke gyldig";
        this.forceUpdate();
      }
    } else {
      // Ingen epost oppgitt
      this.forgot.alertDisplay = "";
      this.forgot.alertText = "Du må oppgi en e-post";
      this.forceUpdate();
    }
  };

  removeDialogAlert = () => {
    this.forgot.alertDisplay = "none";
    this.forgot.alertText = "";
    this.forgot.alertSeverity = "error";
    this.forceUpdate();
  };

  handleClickForgot = () => {
    this.forgot.display = true;
    this.forceUpdate();
  };

  handleCloseForgot = () => {
    this.forgot.display = false;
    this.forceUpdate();
  };

  gotoRegister = () => {
    this.props.history.push('/register/');
  };

  render() {
    return (
      <main id="main_login">
          <section id="section_logo_login">
            <img src={usnlogo} alt="USN logo" />
          </section>
          <Alert id="alert_login" className="fade_in" style={{display: this.alert.display}} variant="outlined" severity="error">
            {this.alert.text}
          </Alert>
          <form id="form_login" onSubmit={this.handleLogin}>
            <FormControl id="form_email_login">
              <InputLabel>E-post</InputLabel>
              <Input type="email" className="form_input_login" required={true} value={this.state.email} onKeyUp={this.onSubmit} onChange={this.onEmailChange} autoFocus={true} autoComplete="email" variant="outlined" />
            </FormControl>
            <FormControl id="form_password_login">
              <InputLabel>Passord</InputLabel>
              <Input className="form_input_login" required={true} value={this.state.password} onKeyUp={this.onSubmit} onChange={this.onPasswordChange} variant="outlined" type="password" />
            </FormControl>
            <Button onClick={this.handleClickForgot} id="form_glemt_login" variant="outlined">Glemt Passord</Button>
            <Button onClick={this.gotoRegister} variant="outlined">Ny bruker</Button>
            <Button type="submit" id="form_btn_login" variant="contained">Logg inn</Button>
          </form>
          
        <Dialog open={this.forgot.display} onClose={this.handleCloseForgot} aria-labelledby="dialog_glemt_tittel">
          <DialogTitle id="dialog_glemt_tittel">Glemt passord</DialogTitle>
          <DialogContent>
            <DialogContentText>Skriv inn e-posten for å tilbakestille passordet ditt</DialogContentText>
            <Alert id="alert_dialog_glemt" className="fade_in" style={{display: this.forgot.alertDisplay}} severity={this.forgot.alertSeverity}>
              {this.forgot.alertText}
            </Alert>
            <TextField autoFocus id="dialog_glemt_epost" margin="dense" onChange={this.removeDialogAlert} label="E-post" type="email" fullWidth />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleCloseForgot} color="primary">Avbryt</Button>
            <Button onClick={this.handleForgot} color="primary">Tilbakestill passord</Button>
          </DialogActions>
        </Dialog>
      </main>
    );
  }
}

export default Login;
