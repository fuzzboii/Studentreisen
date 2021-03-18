import React from 'react';
import './App.css';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';

import Login from './pages/Login/Components/Login';
import Register from './pages/Register/Components/Register';
import Reset from './pages/Reset/Components/Reset';
import Profile from './pages/Profile/Components/Profile';
import Home from './pages/Frontpage/Components/Home';
import Navbar from './pages/Navbar/Components/Navbar';
import Footer from './global/Components/Footer';
import Tools from './pages/Tools/Components/Tools';
import Course from './pages/Coursepage/Components/Course';
import Seminar from './pages/Seminar/Components/Seminar';

function App() {
  return (
    <>
    <Router>
      <Navbar />
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
    </Router>
    </>
  );
}



export default App;
