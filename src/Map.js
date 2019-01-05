import React, { Component } from "react";
import { Map, InfoWindow, Marker, GoogleApiWrapper } from "google-maps-react";
class MapContainer extends Component {
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
  render() {
    let { google, markers, toggleMark, bounds } = this.props;
    return (
      <Map bounds={this.populateBounds(bounds)} google={google} zoom={8}>
        {markers.map((mark, index) => (
          <Marker
            icon={{
              url: mark.imgUrl,
              anchor: new google.maps.Point(32, 32),
              scaledSize: new google.maps.Size(20, 20)
            }}
            key={mark.userId + index}
            position={mark.position}
          >
            {mark.visible && (
              <InfoWindow onClick={() => toggleMark(mark)}>
                <div>aaaa</div>
              </InfoWindow>
            )}
          </Marker>
        ))}
      </Map>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: "AIzaSyDKls18s0DbW3UXLpwfCMiC7CZG-EwKJig"
})(MapContainer);
