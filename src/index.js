import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import {BrowserRouter as Router, Switch, Route, useLocation} from 'react-router-dom';
import {SnackbarProvider} from 'notistack';
import Slide from '@material-ui/core/Slide';

ReactDOM.render(
  <React.StrictMode>
    <Router >
      <SnackbarProvider 
        maxSnack={3}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center"
        }}
        TransitionComponent={Slide}
      >
        <App />
      </SnackbarProvider>
    </Router >
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
