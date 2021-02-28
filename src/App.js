import './App.css';
import Login from './components/Login';
import Register from './components/Register';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import Home from './components/pages/Home';

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path = "/" exact component = {Home} />
          <Route path = "/login" component = {Login} />
          <Route path = "/register" component = {Register} />
        </Switch>
      </div>
    </Router>
  );
}



export default App;
