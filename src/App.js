import React from 'react';
import './App.css';
import Login from './components/Login';
import Register from './components/Register';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import Home from './components/pages/Home';
import Navbar from './components/Navbar';

function App() {
  return (
    <>
    <Router>
      <Navbar />
        <Switch>
          <Route path = "/" exact component = {Home} />
          <Route path = "/login" component = {Login} />
          <Route path = "/register" component = {Register} />
        </Switch>
    </Router>
    </>
  );
}



export default App;
