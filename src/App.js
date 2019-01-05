import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import { Button, Input, Avatar, Modal } from "antd";
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

class App extends Component {
  constructor(props) {
    super(props);
  }
  state = {
    auth: false,
    loading: true,
    hasLocation: false,
    currentUser: {},
    positionUser: { lat: -34.397, lng: 150.644 },
    markers: [],
    loadingMap: false,
    isOpenModal: false,
    bounds: []
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
    firebaseAuth().onAuthStateChanged(user => {
      this.setState({ auth: !!user, loading: false, currentUser: user }, () => {
        let { currentUser } = this.state;

        if (currentUser) {
          this.handleGetPosition();
        }
      });
    });

    this.listUsers();
  }

  listUsers = () => {
    let { markers, bounds } = this.state;
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
            bounds = bounds.concat(obj.position);
          });

          this.setState({ markers, bounds });
        }
      });
  };

  handleGetPosition = () => {
    let { currentUser } = this.state;
    if (navigator.geolocation) {
      this.setState({ loadingMap: true });
      navigator.geolocation.getCurrentPosition(data => {
        let positionUser = {
          lat: data.coords.latitude,
          lng: data.coords.longitude
        };

        this.setUser({
          userId: currentUser.uid,
          name: currentUser.displayName,
          email: currentUser.email,
          imgUrl: currentUser.photoURL,
          position: positionUser
        })
          .then(data => {
            this.setState(
              {
                loadingMap: false
              },
              () => {
                this.listUsers();
              }
            );
          })
          .catch(err => {
            console.log(err);
          });
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
            bounds={this.state.bounds}
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
