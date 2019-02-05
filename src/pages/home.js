import React, { Component } from "react";
import { Button, Input, Avatar, Modal, Form, Icon } from "antd";
import styled from "styled-components";
import { login, logout } from "../helpers/auth";
import firebase, { firebaseAuth } from "../helpers/firebase";
import ReactLoading from "react-loading";
import { Formik } from "formik";
import yup from "yup";
import Map from "../components/Map";
import ListUsers from "../components/ListUsers";
import Header from "../components/Header";
import Content from "../components/Content";
import Loading from "../components/Loading";
import UsersModel from "../models/users";

const MenuContent = styled.div`
  width: 1040px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
`;

const Container = styled.div`
  width: 100%;
  ${MenuContent}:first-child {
    width: 100%;
    height: 80px;
    padding-left: 30px;
    padding-right: 30px;
  }
  ${MenuContent}: last-child {
    width: 200px;
    display: flex;
    justify-content: space-between;
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
  state = {
    loading: true,
    loadingMap: false,
    chooseMap: true
  };

  componentDidMount() {
    firebaseAuth().onAuthStateChanged(user => {
      this.setState({ loading: false, currentUser: user }, () => {
        let { currentUser } = this.state;

        if (currentUser) {
          this.handleGetPosition();
        }
      });
    });
  }

  handleGetPosition = () => {
    let { currentUser } = this.state;
    if (navigator.geolocation) {
      this.setState({ loadingMap: true });
      navigator.geolocation.getCurrentPosition(data => {
        let positionUser = {
          lat: data.coords.latitude,
          lng: data.coords.longitude
        };

        UsersModel.findAndUpdate(currentUser.uid, {
          userId: currentUser.uid,
          name: currentUser.displayName,
          email: currentUser.email,
          imgUrl: currentUser.photoURL,
          position: positionUser
        })
          .then(() => {
            this.setState({
              loadingMap: false
            });
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
    if (this.state.loading) return <Loading />;

    return (
      <div>
        <Header />

        <Content>
          <Container>
            <MenuContent>
              <Icon
                onClick={() => this.setState({ chooseMap: true })}
                style={{
                  cursor: "pointer",
                  fontSize: "30px",
                  color: !this.state.chooseMap ? "#3498db" : "#2ecc71"
                }}
                type="environment"
              />
              <Icon
                onClick={() => this.setState({ chooseMap: false })}
                style={{
                  cursor: "pointer",
                  fontSize: "30px",
                  color: this.state.chooseMap ? "#3498db" : "#2ecc71"
                }}
                type="bars"
              />
            </MenuContent>
          </Container>
          {this.state.loadingMap && (
            <Footer>
              <ReactLoading type={"spin"} color={"black"} />
            </Footer>
          )}
          {this.state.chooseMap && !this.state.loadingMap && <Map />}

          {!this.state.chooseMap && !this.state.loadingMap && <ListUsers />}
        </Content>
        <Modal
          title="Update Info"
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          visible={this.state.isOpenModal}
          closable={true}
        >
          <Formik initialValues={{}} onSubmit={() => {}}>
            {({ values, handleChange, handleSubmit }) => (
              <Form layout="vertical">
                <Form.Item label="Name">
                  <Input
                    value={values.name}
                    onChange={() => handleChange("name")}
                  />
                </Form.Item>
                <Form.Item label="Company">
                  <Input
                    value={values.company}
                    onChange={() => handleChange("company")}
                  />
                </Form.Item>
                <Form.Item>
                  <Button onClick={handleSubmit} type="primary">
                    Update
                  </Button>
                </Form.Item>
              </Form>
            )}
          </Formik>
        </Modal>
      </div>
    );
  }
}

export default App;
