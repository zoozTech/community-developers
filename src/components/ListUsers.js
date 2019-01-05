import React, { Component } from "react";
import { List, Avatar } from "antd";
import { login, logout } from "../helpers/auth";
import styled from "styled-components";
import UsersModel from "../models/users";
import { Link } from "react-router-dom";

const Container = styled.div`
  width: calc(1040px - 20px);
  margin: 0 auto;
  padding: 0 10px;
  margin-top: 30px;

  @media (max-width: 600px) {
    margin-top: 30px;
    width: calc(100% - 20px);
  }
`;

const TotalUsers = styled.h2`
  color: #000;
  font-weight: normal;
`;

export default class ListUsers extends Component {
  state = {
    users: []
  };

  componentDidMount() {
    UsersModel.find().then(users => {
      this.setState({ users });
    });
  }
  render() {
    return (
      <Container>
        <TotalUsers>Total {this.state.users.length}</TotalUsers>
        <List
          itemLayout="horizontal"
          dataSource={this.state.users}
          renderItem={user => (
            <List.Item key={user.userId}>
              <Link to={`/u/${user.userId}`}>
                <List.Item.Meta
                  avatar={<Avatar src={user.imgUrl} />}
                  title={user.name}
                />
              </Link>
            </List.Item>
          )}
        />
      </Container>
    );
  }
}
