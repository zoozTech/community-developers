import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";
import Home from "./pages/home";
import Profile from "./pages/profile";
import ReactGA from "react-ga";

export default class App extends Component {
  componentDidMount() {
    ReactGA.initialize(process.env.REACT_APP_GOOGLE_GA);
    ReactGA.pageview(window.location.pathname + window.location.search);
  }

  render() {
    return (
      <Router>
        <Switch>
          <Route exact={true} component={Home} path="/" />
          <Route component={Profile} path="/u/:_user" />
          <Route render={() => <Redirect to="/" />} />
        </Switch>
      </Router>
    );
  }
}
