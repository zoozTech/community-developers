import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";
import Home from "./pages/home";
import Profile from "./pages/profile";

export default () => (
  <Router>
    <Switch>
      <Route exact={true} component={Home} path="/" />
      <Route component={Profile} path="/u/:_user" />
      <Route render={() => <Redirect to="/" />} />
    </Switch>
  </Router>
);
