import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import { Button, FormControl, InputLabel, Input } from '@material-ui/core';
import { Component } from "react";
import { Redirect } from "react-router-dom";
import axios from 'axios';
import '../CSS/Register.css';
import usnlogo from '../../../assets/usn.png';
import { useState } from "react";

import Loader from '../../../global/Components/Loader';
import CookieService from '../../../global/Services/CookieService';
import AuthService from '../../../global/Services/AuthService';

class Register extends Component {
  constructor(props) {
    super(props)
    // Login-spesifikke states, delt opp i før-visning autentisering, login, alert og glemt passord
    this.state = {loading : true, authenticated : false, 
                  email : "", pwd : "", remember : false, loginDisabled : false, loginText : "Logg inn", loginOpacity: "1",
                  alertDisplay : "none", alertText : "",
                  forgotEmail : "", forgotDisplay : false, forgotBtnDisabled : false, forgotAlertDisplay : "none", forgotAlertText : "", forgotAlertSeverity : "error"}
  }
  handleRegister = e => {
  // Stopper siden fra å laste inn på nytt
  e.preventDefault();

  // Slår midlertidig av "Registrer"-knappen og endrer teksten til "Vennligst vent"
  this.setState({
    registerDisabled: true,
    registerText: "Vennligst vent",
    registerOpacity: "0.6"
  });

  // Definerer objektet med dataen vi sender til server
  const data = {
    email: this.state.email,
    pwd: this.state.pwd,
    fname: this.state.fname,
    ename: this.state.ename,
    tel: this.state.telefon
  };

  // Axios POST request
  axios
    // Henter API URL fra .env og utfører en POST request med dataen fra objektet over
    // Axios serialiserer objektet til JSON selv
    .post(process.env.REACT_APP_APIURL + "/auth/register", data)
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
      return(
        <main id="main_register">
          <section id="section_logo_register">
            <img src={usnlogo} alt="USN logo" />
          </section>
          <form id="form_login">
            <FormControl id="form_email_register" onSubmit={this.handleRegister}>
              <InputLabel>E-post</InputLabel>
              <Input type="email" onChange={this.setEmail} value={this.state.email} onKeyUp={this.onSubmit} className="form_input_register" required={true} autoFocus={true} variant="outlined" />
            </FormControl>
            <FormControl id="form_status_register">
              <label for="status">Velg studiestatus:</label>
              <select name="status" id="status">
                <option value="Årsstudium">Årsstudium</option>
                <option value="Bachelorstudent">Bachelorstudent</option>
                <option value="Mastergradstudent">Mastergradstudent</option>
                <option value="Doktorgradstudent">Doktorgradstudent</option>
                <option value="Uteksaminert">Uteksaminert</option>
              </select>
            </FormControl>  
            <FormControl id="form_fnavn_register">
              <InputLabel>Fornavn</InputLabel>
              <Input type="fname" onChange={this.setFname} value={this.state.fname} onKeyUp={this.onSubmit} className="form_input_register" required={true} variant="outlined" />
            </FormControl>
            <FormControl id="form_enavn_register">
              <InputLabel>Etternavn</InputLabel>
              <Input type="ename" onChange={this.setEname} value={this.state.ename} onKeyUp={this.onSubmit} className="form_input_register" required={true} variant="outlined" />
            </FormControl>
            <FormControl id="form_tlf_register">
              <InputLabel>Telefonnummer</InputLabel>
              <Input type="tel" onChange={this.setTelefon} value={this.state.telefon} onKeyUp={this.onSubmit} className="form_input_register" required={true} variant="outlined" />
            </FormControl> 
            <FormControl id="form_password_register">
              <InputLabel>Passord</InputLabel>
              <Input type="password" onChange={this.setPassword} value={this.state.pwd} onKeyUp={this.onSubmit} className="form_input_register" required={true} variant="outlined" />
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

export default Register;
