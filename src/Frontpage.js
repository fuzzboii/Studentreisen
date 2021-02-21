import React, { Component } from "react";
import usnlogo from './usn.png';
import './Frontpage.css';
import axios from 'axios';

class Frontpage extends Component {
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
          console.log("User authenticated and received the authentication token: " + res.headers.authtoken);
        } else {
          console.log(res.data.message);
        }
      })
      .catch(err => console.log("Check if the server is running"));
  };

  render() {
    return (
      <div className="Frontpage">
        <header className="Frontpage-header">
          <img src={usnlogo} className="Frontpage-logo" alt="logo" />
          <form className="post" onSubmit={this.handleSubmit}>
            <input
              placeholder="Email" value={this.state.email}
              onChange={this.onEmailChange} 
            />
            <input
              placeholder="Password" value={this.state.password}
              onChange={this.onPasswordChange} 
            />
            <button type="submit">Login</button>
          </form>
        </header>
      </div>
    );
  }
}

export default Frontpage;
