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
import HomeOverview from './pages/Overviewpage/Components/HomeOverview';
import Tools from './pages/Tools/Components/Tools';
import Course from './pages/Coursepage/Components/Overview';
import CourseDetail from './pages/Coursepage/Components/CourseDetail';
import ModuleDetail from './pages/Coursepage/Components/ModuleDetail';
import Seminar from './pages/Seminar/Components/SeminarOverview';
import SeminarDetailsUpcoming from './pages/Seminar/Components/SeminarDetailsUpcoming';
import SeminarDetailsExpired from './pages/Seminar/Components/SeminarDetailsExpired';
import SeminarNew from './pages/Seminar/Components/SeminarNew';

import CookieService from './global/Services/CookieService';
import AuthService from './global/Services/AuthService';

function App() {
  const [auth, setAuth] = useState(false);
  const [type, setType] = useState(1);
  const [notif, setNotif] = useState(null);
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

          if(res.notif.kunngjoring !== undefined && res.notif.kunngjoring.length >= 1) {
            setNotif(res.notif.kunngjoring);
          }
          
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
      <Navbar auth={auth} type={type} loading={loading} notif={notif} />
        <Switch>
          <Route path = "/" exact component = {Home} />
          <Route path = "/overview" render={() => (
              <HomeOverview auth={auth} type={type} loading={loading} />
            )} /> 
          <Route path = "/login" render={() => (
              <Login auth={auth} type={type} loading={loading} />
            )} />
          <Route path = "/course" exact component = {Course} />
            <Route path = "/course/emnekode=:emnekode" render = {() =>(
              <CourseDetail auth={auth} loading={loading} />
            )}/>
            <Route path = "/course/modulkode=:modulkode" render = {() =>(
              <ModuleDetail auth={auth} loading={loading} />
            )}/>
          <Route path = "/register"  render={() => (
              <Register auth={auth} type={type} loading={loading} />
            )} />
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
            <SeminarDetailsUpcoming auth={auth} type={type} loading={loading} />
          )}/>
          <Route path = "/seminar/seminarutgatte=:seminarid" render = {() =>(
            <SeminarDetailsExpired auth={auth} type={type} loading={loading} />
          )}/>
          <Route path = "/seminar/ny"  render={() => (
              <SeminarNew auth={auth} type={type} loading={loading} />
            )} />
        </Switch>
      <Footer />
    </>
  );
}



export default App;
