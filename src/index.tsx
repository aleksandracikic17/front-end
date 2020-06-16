import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import HomePage from './components/HomePage/HomePage';
import * as serviceWorker from './serviceWorker';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'jquery/dist/jquery.js';
import 'popper.js/dist/popper.js';
import 'bootstrap/dist/js/bootstrap.min.js';
import '@fortawesome/fontawesome-free/css/fontawesome.css'
import { MainMenu, MainMenuItem } from './components/MainMenu/MainMenu';
import { HashRouter, Switch, Route } from 'react-router-dom';
import UserLoginPage from './components/UserLoginPage/UserLoginPage';
import UserRegistrationPage from './components/UserRegistrationPage/UserRegistrationPage'
import DestinationPage from './components/DestinationPage/DestinationPage';
import AdministratorLoginPage from './components/AdministratorLoginPage/AdministratorLoginPage';
import ClientPage from './components/ClientPage/ClientPage';
import ArrangementPage from './components/ArrangementPage/ArrangementPage';

const menuItems = [
  new MainMenuItem("User Log in", "/user/login/"),
  new MainMenuItem("User Register", "/user/register/"),
  new MainMenuItem("Administrator log in", "/aministrator/login"),
];

ReactDOM.render(
  <React.StrictMode>
    <MainMenu items={ menuItems }></MainMenu>
    <HashRouter>
      <Switch>
       <Route exact path="/" component={ HomePage } /> */}
        <Route path="/user/login" component={ UserLoginPage } />
        <Route path="/user/register" component={ UserRegistrationPage } />
        <Route path="/aministrator/login" component={ AdministratorLoginPage } />
        <Route path="/destination" component={ DestinationPage } /> }
        <Route path="/client" component={ ClientPage } /> }
        <Route path="/arrangement" component={ ArrangementPage } /> }
      </Switch>
    </HashRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
