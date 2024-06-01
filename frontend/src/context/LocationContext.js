import { createContext, useEffect, useState } from "react";

const LocationContext = createContext(null);

function getInitialLocationPermissions() {
  const userSelectedLocationPermissions = localStorage.getItem(
    "userSelectedLocationPermissions"
  );
  if (userSelectedLocationPermissions) {
    const locationPermissionsWereSelected = JSON.parse(
      userSelectedLocationPermissions
    );

    return locationPermissionsWereSelected;
  }

  return null;
}

function getInitialSelectedAddress() {
  const selectedAddress = localStorage.getItem("address");
  if (selectedAddress) {
    const userAddress = JSON.parse(selectedAddress);

    return userAddress;
  }

  return "Choose your address";
}

function getInitialMapPosition() {
  const positionOnMap = localStorage.getItem("positionOnMap");
  if (positionOnMap) {
    const mapPosition = JSON.parse(positionOnMap);

    return mapPosition;
  }

  return {
    lat: 45.7488716,
    lng: 21.2086793,
  };
}

function getInitialRestaurants() {
  const restaurants = localStorage.getItem("restaurants");
  if (restaurants) {
    return JSON.parse(restaurants);
  }
  return [];
}

export const LocationProvider = ({ children }) => {
  const [userSelectedLocationPermissions, setUserSelectedLocationPermissions] =
    useState(getInitialLocationPermissions);
  const [address, setAddress] = useState(getInitialSelectedAddress);
  const [positionOnMap, setPositionOnMap] = useState(getInitialMapPosition);
  const [restaurants, setRestaurants] = useState(getInitialRestaurants);

  useEffect(() => {
    if (userSelectedLocationPermissions) {
      localStorage.setItem(
        "userSelectedLocationPermissions",
        JSON.stringify(userSelectedLocationPermissions)
      );
    }
  }, [userSelectedLocationPermissions]);

  useEffect(() => {
    if (address) {
      localStorage.setItem("address", JSON.stringify(address));
    }
  }, [address]);

  useEffect(() => {
    if (positionOnMap) {
      localStorage.setItem("positionOnMap", JSON.stringify(positionOnMap));
      getRestaurants(positionOnMap);
    }
  }, [positionOnMap]);

  const getRestaurants = async (position) => {
    const { lat, lng } = position;
    const url = `${process.env.REACT_APP_API_URL}/restaurant?latitude=${lat}&longitude=${lng}`;
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        setRestaurants(data.restaurants);
        localStorage.setItem("restaurants", JSON.stringify(data.restaurants));
      }
    } catch (err) {
      console.log("error at fetching restaurants ", err);
    }
  };

  return (
    <LocationContext.Provider
      value={{
        userSelectedLocationPermissions,
        setUserSelectedLocationPermissions,
        address,
        setAddress,
        positionOnMap,
        setPositionOnMap,
        restaurants,
        getRestaurants,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};
export default LocationContext;
