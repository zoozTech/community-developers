import React, { Component } from "react";
import { Map, Marker, GoogleApiWrapper } from "google-maps-react";
import UsersModel from "../models/users";
class MapContainer extends Component {
  state = {
    markers: [],
    bounds: []
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
  render() {
    let { google } = this.props;
    let { markers, bounds } = this.state;
    return (
      <Map
        disableDefaultUI
        bounds={this.populateBounds(bounds)}
        google={google}
      >
        {markers.map((mark, index) => (
          <Marker key={index} position={mark.position} />
        ))}
      </Map>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: process.env.REACT_APP_GOOGLE_KEY
})(MapContainer);
