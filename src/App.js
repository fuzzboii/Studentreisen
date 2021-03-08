import React from 'react';
import './App.css';
import Login from './pages/Login/Components/Login';
import Register from './pages/Register/Components/Register';
import Reset from './pages/Reset/Components/Reset';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import Home from './pages/Frontpage/Components/Home';
import Navbar from './pages/Navbar/Components/Navbar';
import Footer from './global/Components/Footer';

function App() {
  return (
    <>
    <Router>
      <Navbar />
        <Switch>
          <Route path = "/" exact component = {Home} />
          <Route path = "/login" component = {Login} />
          <Route path = "/register" component = {Register} />
          <Route path = "/reset" component = {Reset} />
        </Switch>
      <Footer />
    </Router>
    </>
  );
}



export default App;
