import React, { Component } from "react";
import axios from 'axios';

class Login extends Component {
  state = {
    email: "",
    pwd: ""
  };

  onEmailChange = e => {
    this.setState({
      email: e.target.value
    });
  };
  onPasswordChange = e => {
    this.setState({
      pwd: e.target.value
    });
  };
  
  handleSubmit = e => {
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
            console.log(res.data.message);
        }
      })
      .catch(err => console.log("En feil oppstod ved oppkobling til server"));
  };


  render() {
    return (
      <div>
          <h1>Login page</h1>
          <form className="post" onSubmit = {this.handleSubmit}>
            <input placeholder="Email" value = {this.state.email} onChange={this.onEmailChange} />
            <input placeholder="Password" value = {this.state.password} onChange={this.onPasswordChange} />
            <button type="submit">Login</button>
          </form>
      </div>
    );
  }
}

export default Login;
