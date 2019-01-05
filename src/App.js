import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import { Button, Input, Avatar } from "antd";
import {
  withGoogleMap,
  GoogleMap,
  Marker,
  withScriptjs
} from "react-google-maps";
import styled from "styled-components";
import GitHubLogin from "react-github-login";
import { login, logout } from "./auth";
import firebase, { firebaseAuth } from "./firebase";
import ReactLoading from "react-loading";
const Search = Input.Search;
const ContainerLoading = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
`;
const Title = styled.h2`
  color: #fff;
  font-weight: 300;
  margin: 0;
`;
const Menu = styled.div`
  width: 1040px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
`;

const Container = styled.div`
  background-color: #2c3e50;
  ${Menu}:first-child {
    width: 100%;
    height: 80px;
    padding-left: 30px;
    padding-right: 30px;
  }
`;

const Footer = styled.div`
  width: 100%;
  height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MapWithAMarker = withScriptjs(
  withGoogleMap(({ positionUser, markers = [] }) => (
    <GoogleMap defaultZoom={8} defaultCenter={positionUser}>
      {markers.map(mark => (
        <Marker key={mark.userId} position={mark.position} />
      ))}
    </GoogleMap>
  ))
);

class App extends Component {
  state = {
    auth: false,
    loading: true,
    hasLocation: false,
    currentUser: {},
    positionUser: { lat: -34.397, lng: 150.644 },
    markers: [],
    loadingMap: false
  };

  setUser = props => {
    return new Promise((resolve, reject) => {
      firebase
        .database()
        .ref("users/" + props.userId)
        .set(props)
        .then(resolve)
        .catch(reject);
    });
  };

  componentDidMount() {
    let { markers } = this.state;

    firebaseAuth().onAuthStateChanged(user => {
      if (!!user) {
        this.handleGetPosition();
      }
      this.setState({ auth: !!user, loading: false, currentUser: user });
    });

    firebase
      .database()
      .ref("/users")
      .once("value")
      .then(snapshot => {
        let users = snapshot.val();
        if (users) {
          Object.keys(users).forEach(name => {
            markers = markers.concat(users[name]);
          });

          this.setState({ markers });
        }
      });
  }

  handleGetPosition = () => {
    let { currentUser } = this.state;
    if (navigator.geolocation) {
      this.setState({ loadingMap: true });
      navigator.geolocation.getCurrentPosition(async data => {
        let positionUser = {
          lat: data.coords.latitude,
          lng: data.coords.longitude
        };

        try {
          await this.setUser({
            userId: currentUser.uid,
            name: currentUser.displayName,
            email: currentUser.email,
            imgUrl: currentUser.photoURL,
            position: positionUser
          });

          this.setState({
            positionUser,
            loadingMap: false
          });
        } catch (error) {
          this.setState({
            positionUser,
            loadingMap: false
          });
        }
      });
    } else {
    }
  };

  handleLogin = () => {
    login().then(() => {});
  };

  handleLogout = () => {
    logout();
  };
  render() {
    if (this.state.loading)
      return (
        <ContainerLoading>
          <ReactLoading type={"spin"} color={"black"} />
        </ContainerLoading>
      );

    return (
      <React.Fragment>
        <Container>
          <Menu>
            <Title>Community React</Title>
            {!this.state.auth ? (
              <Button onClick={this.handleLogin} type="primary">
                Signin/Signup
              </Button>
            ) : (
              <div
                style={{
                  width: "350px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                <Button onClick={this.handleGetPosition} type="primary">
                  Set your location
                </Button>
                <Avatar size="large" src={this.state.currentUser.photoURL} />
                <Button onClick={this.handleLogout} type="default">
                  Logout
                </Button>
              </div>
            )}
          </Menu>
        </Container>
        {this.state.loadingMap && (
          <Footer>
            <ReactLoading type={"spin"} color={"black"} />
          </Footer>
        )}
        {!this.state.loadingMap && (
          <MapWithAMarker
            googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyDKls18s0DbW3UXLpwfCMiC7CZG-EwKJig&v=3.exp&libraries=geometry,drawing,places"
            positionUser={this.state.positionUser}
            containerElement={<div style={{ height: `400px` }} />}
            mapElement={<div style={{ height: `90vh` }} />}
            loadingElement={<div style={{ height: `100%` }} />}
            markers={this.state.markers}
          />
        )}
      </React.Fragment>
    );
  }
}

export default App;
