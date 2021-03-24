import React, {useState, useEffect} from 'react';
import './App.css';
import {BrowserRouter as Router, Switch, Route, useLocation} from 'react-router-dom';

import Footer from './global/Components/Footer';
import Navbar from './global/Components/Navbar';

import Login from './pages/Login/Components/Login';
import Register from './pages/Register/Components/Register';
import Reset from './pages/Reset/Components/Reset';
import Profile from './pages/Profile/Components/Profile';
import Home from './pages/Frontpage/Components/Home';
import Tools from './pages/Tools/Components/Tools';
import Course from './pages/Coursepage/Components/Overview';
import Seminar from './pages/Seminar/Components/SeminarOverview';

import CookieService from './global/Services/CookieService';
import AuthService from './global/Services/AuthService';

function App() {
  const [auth, setAuth] = useState(false);

  // Henter authtoken-cookie
  const token = CookieService.get("authtoken");

  // Lar oss kjøre useEffect ved endring av location, i tillegg til state.
  // Oppfører seg ikke helt som forventet
  const location = useLocation();

  const authorize = () => {
    if(token !== undefined) {
      // Om token eksisterer sjekker vi mot serveren om brukeren har en gyldig token
      AuthService.isAuthenticated(token).then(res => {
        if(!res) {
          // Sletter authtoken om token eksisterer lokalt men ikke er gyldig på server
          CookieService.remove("authtoken");
        } 
        setAuth(res.authenticated);
      });
    } else {
      setAuth(false);
    }
  };

  // Setter start-tilstand på auth, og re-rendrer ved endringer
  useEffect( () => {
    authorize();
  }, [location]);

  return (
    <>
      <Navbar auth={auth} />
        <Switch>
          <Route path = "/" exact component = {Home} />
          <Route path = "/login" component = {Login} />
          <Route path = "/course" component = {Course} />
          <Route path = "/register" component = {Register} />
          <Route path = "/reset" component = {Reset} />
          <Route path = "/tools" component = {Tools} />
          <Route path = "/profile" component = {Profile} />
          <Route path = "/seminar" component = {Seminar} />
        </Switch>
      <Footer />
    </>
  );
}



export default App;
