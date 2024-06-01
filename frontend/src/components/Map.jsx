import React, { useContext, useState } from "react";
import { GoogleMap, MarkerF } from "@react-google-maps/api";
import GoogleMapsContext from "../context/GoogleMapsContext";
import LocationContext from "../context/LocationContext";

const containerStyle = {
  width: "100%",
  height: "500px",
};

const Map = ({ nearbyRestaurants }) => {
  const [, setMap] = useState(null);
  const { isGoogleMapsApiLoaded } = useContext(GoogleMapsContext);
  const { positionOnMap } = useContext(LocationContext);
  const getLatLong = (location) => {
    return {
      lat: Number(location.latitude),
      lng: Number(location.longitude),
    };
  };
  return (
    <div>
      {isGoogleMapsApiLoaded ? (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={positionOnMap}
          zoom={11}
          onLoad={(map) => setMap(map)}
          options={{ disableDefaultUI: true }}
        >
          <MarkerF position={positionOnMap} />

          {nearbyRestaurants &&
            nearbyRestaurants.map((restaurant) => {
              const restaurantPosition = getLatLong(restaurant);
              return (
                <MarkerF
                  key={restaurant.id}
                  position={restaurantPosition}
                  // label={{
                  //   text: restaurant.name,
                  //   color: "#f45b69",
                  //   fontWeight: "bold",
                  // }}
                  icon={{
                    url: "/foodieLogo.png",
                    scaledSize: new window.google.maps.Size(35, 22),
                    // labelOrigin: new window.google.maps.Point(40, 35),
                  }}
                />
              );
            })}
        </GoogleMap>
      ) : (
        <div>service not working</div>
      )}
    </div>
  );
};

export default Map;
