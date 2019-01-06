import React, { Component } from "react";
import firebase, { firebaseAuth } from "../helpers/firebase";
import { Card, Modal } from "antd";
import styled from "styled-components";
import UsersModel from "../models/users";
import Header from "../components/Header";
import Content from "../components/Content";
import Loading from "../components/Loading";
import Wrapper from "./Wrapper";
import { login, logout } from "../helpers/auth";
const confirm = Modal.confirm;

const CardOption = ({ children, style, onClick }) => (
  <Card
    onClick={onClick}
    style={{
      ...style,
      height: "40px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer"
    }}
  >
    {children}
  </Card>
);

class Me extends Component {
  state = {
    currentUser: {}
  };
  componentDidMount() {
    UsersModel.findOne(firebaseAuth().currentUser.uid).then(currentUser => {
      this.setState({ currentUser });
    });
  }

  handleLogout = () => {
    logout();
  };

  render() {
    return (
      <div>
        <Header hasBack={true} />
        <Content>
          <CardOption onClick={this.handleLogout}>Logout</CardOption>
        </Content>
      </div>
    );
  }
}
export default Wrapper(Me);
