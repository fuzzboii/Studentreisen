import './App.css';
import Login from './components/Login';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path = "/" exact component = {Home} />
          <Route path = "/login" component = {Login} />
        </Switch>
      </div>
    </Router>
  );
}

const Home = () => {
  return(
    <div>
      <h1>Forside</h1>
    </div>
  );
}

export default App;
