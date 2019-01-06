import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";
import Home from "./pages/home";
import Profile from "./pages/profile";
import Me from "./pages/me";
import ReactGA from "react-ga";
import firebase, { firebaseAuth } from "./helpers/firebase";
function PrivateRoute({ component: Component, authenticated, ...rest }) {
  return (
    <Route
      {...rest}
      render={props =>
        authenticated === true ? (
          <Component {...props} />
        ) : (
          <Redirect to={{ pathname: "/", state: { from: props.location } }} />
        )
      }
    />
  );
}

export default class App extends Component {
  state = {
    auth: false
  };
  componentDidMount() {
    ReactGA.initialize(process.env.REACT_APP_GOOGLE_GA);
    ReactGA.pageview(window.location.pathname + window.location.search);
    firebaseAuth().onAuthStateChanged(auth => {
      this.setState({ auth: !!auth });
    });
  }

  render() {
    return (
      <Router>
        <Switch>
          <Route exact={true} component={Home} path="/" />
          <PrivateRoute
            authenticated={this.state.auth}
            component={Me}
            path="/me"
          />
          <Route component={Profile} path="/u/:_user" />
          <Route render={() => <Redirect to="/" />} />
        </Switch>
      </Router>
    );
  }
}
