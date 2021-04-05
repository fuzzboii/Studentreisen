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
import CourseDetail from './pages/Coursepage/Components/CourseDetail';
import ModuleDetail from './pages/Coursepage/Components/ModuleDetail';
import Seminar from './pages/Seminar/Components/SeminarOverview';
import SeminarDetailsUpcoming from './pages/Seminar/Components/SeminarDetailsUpcoming';
import SeminarDetailsExpired from './pages/Seminar/Components/SeminarDetailsExpired';

import CookieService from './global/Services/CookieService';
import AuthService from './global/Services/AuthService';

function App() {
  const [auth, setAuth] = useState(false);
  const [type, setType] = useState(1);
  const [loading, setLoading] = useState(true);

  // Henter authtoken-cookie
  const token = CookieService.get("authtoken");

  // Lar oss kjøre useEffect ved endring av location, i tillegg til state.
  // Oppfører seg ikke helt som forventet
  const location = useLocation();

  const authorize = () => {
    if(token !== undefined) {
      // Om token eksisterer sjekker vi mot serveren om brukeren har en gyldig token
      AuthService.isAuthenticated(token).then(res => {
        if(!res.authenticated) {
          // Sletter authtoken om token eksisterer lokalt men ikke er gyldig på server
          CookieService.remove("authtoken");
        } else {
          setType(res.usertype);
        }
        setAuth(res.authenticated);
        setLoading(false);
      });
    } else {
      setAuth(false);
      setLoading(false);
    }
  };

  // Setter start-tilstand på auth, og re-rendrer ved endringer
  useEffect( () => {
    authorize();
  }, [location]);

  return (
    <>
      <Navbar auth={auth} type={type} />
        <Switch>
          <Route path = "/" exact component = {Home} />
          <Route path = "/login" component = {Login} />
          <Route path = "/course" exact component = {Course} />
          <Route path = "/course/:emnekode" render = {() =>(
            <CourseDetail auth={auth} loading={loading} />
          )}/>
          <Route path = "/course/:modulkode" render = {() =>(
            <ModuleDetail auth={auth} loading={loading} />
          )}/>
          <Route path = "/register" component = {Register} />
          <Route path = "/reset" component = {Reset} />
          <Route path = "/tools" render={() => (
              <Tools auth={auth} type={type} loading={loading} />
            )}
          />
          <Route path = "/profile" render={() => (
              <Profile auth={auth} type={type} loading={loading} />
            )}
          />
          <Route path = "/seminar" exact component = {Seminar} />
          <Route path = "/seminar/seminarkommende=:seminarid" render = {() =>(
            <SeminarDetailsUpcoming auth={auth} loading={loading} />
          )}/>
          <Route path = "/seminar/seminarutgatte=:seminarid" render = {() =>(
            <SeminarDetailsExpired auth={auth} loading={loading} />
          )}/>
        </Switch>
      <Footer />
    </>
  );
}



export default App;
