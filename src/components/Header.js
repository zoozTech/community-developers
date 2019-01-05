import React, { Component } from "react";
import { Button, Avatar, Dropdown, Menu, Icon } from "antd";
import { login, logout } from "../helpers/auth";
import styled from "styled-components";
import { Link, withRouter } from "react-router-dom";
import firebase, { firebaseAuth } from "../helpers/firebase";
const Title = styled.h2`
  color: #000;
  font-weight: 300;
  margin: 0;
`;
const Navbar = styled.div`
  width: 100%;
  height: 60px;
  top: 0;
  position: fixed;
  left: 0;
  right: 0;
  z-index: 9;
  background-color: #fff;
  box-shadow: rgba(225, 225, 225, 0.5) 0px 2px 4px 0px;
`;

const NavbarContent = styled.div`
  width: 1020px;
  padding: 0 10px;
  height: 60px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  @media (max-width: 1000px) {
    width: calc(100% - 20px);
    padding: 0 10px;
  }
`;

class Header extends Component {
  state = {
    auth: false,
    currentUser: {}
  };
  componentDidMount() {
    firebaseAuth().onAuthStateChanged(user => {
      this.setState({ auth: !!user, currentUser: user });
    });
  }
  handleLogin = () => login();
  handleLogout = () => logout();
  handleGoBack = () => {
    this.props.history.push("/");
  };
  render() {
    return (
      <Navbar>
        <NavbarContent>
          <div
            style={{
              width: "130px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            {this.props.hasBack && (
              <Icon
                style={{
                  cursor: "pointer",
                  fontSize: "20px",
                  color: "#000"
                }}
                onClick={this.handleGoBack}
                type="arrow-left"
              />
            )}
            <Link to="/">
              <Title>Community</Title>
            </Link>
          </div>
          <div>
            {!this.state.auth ? (
              <Button onClick={this.handleLogin} type="primary">
                Signin/Signup
              </Button>
            ) : (
              <Dropdown
                trigger={["click"]}
                overlay={
                  <Menu>
                    <Menu.Item onClick={this.handleLogout}>Logout</Menu.Item>
                  </Menu>
                }
              >
                <Avatar
                  size="large"
                  src={this.state.currentUser.photoURL}
                  style={{ cursor: "pointer" }}
                />
              </Dropdown>
            )}
          </div>
        </NavbarContent>
      </Navbar>
    );
  }
}

export default withRouter(Header);
