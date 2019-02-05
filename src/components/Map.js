import React, { Component } from "react";
import { Map, Marker, GoogleApiWrapper } from "google-maps-react";
import UsersModel from "../models/users";
import styled, { keyframes } from "styled-components";
import { Avatar } from "antd";
import { fadeInUp } from "react-animations";
const bounceAnimation = keyframes`${fadeInUp}`;
const CardUser = styled.div`
  width: 260px;
  height: 250px;
  padding: 10px 20px;
  position: absolute;
  text-align: center;
  bottom: -150px;
  right: 0;
  z-index: 99;
  background-color: #fff;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  display: ${({ isOpen }) => (isOpen ? "block" : "none")};
  animation: 1s ${bounceAnimation};
  border: 1px solid #e8e8e8;
`;

class MapContainer extends Component {
  state = {
    markers: [],
    bounds: [],
    isOpen: false,
    mark: {},
    loadingUser: false
  };

  componentDidMount() {
    let { markers, bounds } = this.state;
    let { google } = this.props;

    UsersModel.find().then(users => {
      users.forEach(user => {
        let obj = Object.assign({}, user);
        obj.visible = false;
        obj.icon = {
          url: obj.imgUrl,
          anchor: new google.maps.Point(32, 32),
          scaledSize: new google.maps.Size(20, 20)
        };
        markers = markers.concat(obj);
        bounds = bounds.concat(obj.position);
      });
      this.setState({ markers, bounds });
    });
  }
  populateBounds = boundsex => {
    let { google } = this.props;
    var bounds = new google.maps.LatLngBounds();
    for (var i = 0; i < boundsex.length; i++) {
      bounds.extend(boundsex[i]);
    }

    return bounds;
  };

  getheatMap = () => {
    let { google } = this.props;
  };

  toggleMark = index => {
    let { markers } = this.state;
    markers[index].visible = !markers[index].visible;
    this.setState({ markers });
  };
  handleOpenMark = mark => {
    this.setState(prev => ({ mark, isOpen: !prev.isOpen }));
  };
  render() {
    let { google } = this.props;
    let { markers } = this.state;

    return (
      <div>
        <Map
          style={{ height: "510px" }}
          initialCenter={{ lat: -23.5489, lng: -46.6388 }}
          zoom={3}
          disableDefaultUI
          google={google}
        >
          {markers.map((mark, index) => (
            <Marker
              onClick={() => this.handleOpenMark(mark, index)}
              key={index}
              position={mark.position}
            />
          ))}
        </Map>
        <CardUser isOpen={this.state.isOpen}>
          <Avatar
            size={80}
            src={this.state.mark.imgUrl}
            style={{ cursor: "pointer" }}
          />
          <h3>{this.state.mark.name ? this.state.mark.name : "No Name"}</h3>
          <p>
            {this.state.mark.github_username ? (
              <a href={`https://github.com/${this.state.mark.github_username}`}>
                Github
              </a>
            ) : (
              "No github"
            )}
          </p>
          <p>
            {this.state.mark.twitter_username ? (
              <a
                href={`https://github.com/${this.state.mark.twitter_username}`}
              >
                Twitter
              </a>
            ) : (
              "No twitter"
            )}
          </p>
        </CardUser>
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: process.env.REACT_APP_GOOGLE_KEY
})(MapContainer);
