import React from 'react';
import './App.css';
import Login from './pages/Login/Components/Login';
import Register from './pages/Register/Components/Register';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import Home from './pages/Frontpage/Components/Home';
import Navbar from './pages/Navbar/Components/Navbar';

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
