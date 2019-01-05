import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import { Button, Input, Avatar, Modal } from "antd";
import {
  withGoogleMap,
  GoogleMap,
  Marker,
  withScriptjs,
  InfoWindow
} from "react-google-maps";
import styled from "styled-components";
import { login, logout } from "./auth";
import firebase, { firebaseAuth } from "./firebase";
import ReactLoading from "react-loading";
import { Formik } from "formik";
import yup from "yup";
import Map from "./Map";
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
  withGoogleMap((props, { positionUser, markers = [], toggleMark }) => {
    return (
      <GoogleMap defaultZoom={8} defaultCenter={positionUser}>
        {markers.map(mark => (
          <Marker icon={mark.imgUrl} key={mark.userId} position={mark.position}>
            {mark.visible && (
              <InfoWindow onClick={() => toggleMark(mark)}>
                <div>aaaa</div>
              </InfoWindow>
            )}
          </Marker>
        ))}
      </GoogleMap>
    );
  })
);

class App extends Component {
  state = {
    auth: false,
    loading: true,
    hasLocation: false,
    currentUser: {},
    positionUser: { lat: -34.397, lng: 150.644 },
    markers: [],
    loadingMap: false,
    isOpenModal: false
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

  openModalInfo = () => {
    this.setState({ isOpenModal: true });
  };

  // handleToggleMark = mark => {
  //   let { markers } = this.state;
  //   this.setState({
  //     markers: markers.map(item => {
  //       if (item.uid === mark.uid) {
  //         item = Object.assign({}, item);
  //         item.visible = !item.visible;
  //       }

  //       return item;
  //     })
  //   });
  // };

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
            let obj = Object.assign({}, users[name]);
            obj.visible = false;
            markers = markers.concat(obj);
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
    login();
  };

  handleLogout = () => {
    logout();
  };

  handleOk = () => {
    this.setState({ isOpenModal: false });
  };
  handleCancel = () => {
    this.setState({ isOpenModal: false });
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
                  width: "130px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                <Avatar
                  size="large"
                  src={this.state.currentUser.photoURL}
                  style={{ cursor: "pointer" }}
                />
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
          <Map
            positionUser={this.state.positionUser}
            markers={this.state.markers}
          />
        )}
        <Modal
          title="Update Info"
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          visible={this.state.isOpenModal}
          closable={true}
        >
          aaa
        </Modal>
      </React.Fragment>
    );
  }
}

export default App;
