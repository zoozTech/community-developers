import React, { Component } from "react";
import { Map, InfoWindow, Marker, GoogleApiWrapper } from "google-maps-react";
class MapContainer extends Component {
  render() {
    let { google, markers, toggleMark } = this.props;
    return (
      <Map google={google} zoom={14}>
        {markers.map(mark => (
          <Marker
            icon={{
              url: mark.imgUrl,
              anchor: new google.maps.Point(32, 32),
              scaledSize: new google.maps.Size(20, 20)
            }}
            key={mark.userId}
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
