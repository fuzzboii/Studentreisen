import React, { Component } from "react";
import { Button, FormControl, InputLabel, Input } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import axios from 'axios';
import '../stylesheets/Login.css';
import usnlogo from '../assets/usn.png';


class Login extends Component {
  state = {
    email: "",
    pwd: ""
  };

  alert = {
    display: "none",
    text: ""
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

    const data = {
      email: this.state.email,
      pwd: this.state.pwd
    };
    axios
      .post("http://localhost:5000/api/user/login", data)
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
        console.log("En feil oppstod ved oppkobling til server");
      });
  };

  gotoRegister = () => {
    this.props.history.push('/register/');
  }

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
              <Input className="form_input_login" value={this.state.email} onChange={this.onEmailChange} required={true} autoFocus={true} autoComplete="email" variant="outlined" />
            </FormControl>
            <FormControl id="form_password_login">
              <InputLabel>Passord</InputLabel>
              <Input className="form_input_login" value={this.state.password} onChange={this.onPasswordChange} placeholder="Passord" required={true} variant="outlined" type="password" />
            </FormControl>
            <Button id="form_btn_login" onClick={this.handleLogin} variant="contained">Logg inn</Button>
            <Button onClick={this.gotoRegister} variant="contained">Ny bruker</Button>
          </form>
      </main>
    );
  }
}

export default Login;
