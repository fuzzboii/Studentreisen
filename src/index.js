import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import {BrowserRouter as Router, Switch, Route, useLocation} from 'react-router-dom';
import {SnackbarProvider} from 'notistack';
import Slide from '@material-ui/core/Slide';

import {createStore} from 'redux';
import allReducers from './global/Services/Reducers';
import courseReducer from './global/Services/Reducers/tabCourse';
import { Provider } from 'react-redux';

const store = createStore(
  allReducers, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

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
        <Provider store={store}>
          <App />
        </Provider>
      </SnackbarProvider>
    </Router >
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
