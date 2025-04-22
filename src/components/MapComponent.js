import React, { useState } from "react";
import { withGoogleMap, GoogleMap, Marker } from "react-google-maps";

const MapComponent = withGoogleMap((props) => (
  
  <>
    {props ? (
      <GoogleMap
        defaultZoom={11}
        defaultCenter={
          props?.data || {
            lat: 0.0,
            lng: 0.0,
          }
        }
      >
        {props?.markers?.map((marker, index) => (
          <Marker
            key={marker?.id || index}
            position={marker?.position}
            label={marker?.label}
            icon={marker?.icon}
          ></Marker>
        ))}
      </GoogleMap>
    ) : (
      <></>
    )}
  </>
));

export default MapComponent;
