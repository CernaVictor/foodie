import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LocationContext from "../context/LocationContext";
import "../styles/HomeMap.css";
import SnackBar from "../UI/Snackbar";
import Map from "./Map";
import { geolocationOptions, getUserAddressFromLatLng } from "./utils";

const foodieRestaurants = [
  {
    id: 1,
    name: "Foodie1",
    address: "Timisoara, Str. Piatra Craiului 1",
    lat: "45.75317099999999",
    lng: "21.224216",
  },
  {
    id: 2,
    name: "Foodie2",
    lat: "45.73547139999999",
    address: "Timisoara, Calea Șagului 5",
    lng: "21.2094579",
  },
  {
    id: 3,
    name: "Foodie3",
    address: "Dumbrăvița, Str. Conac, Nr.16",
    lat: "45.7852202",
    lng: "21.23656",
  },
];

const HomeMap = () => {
  const [isSnackbarErrorOpen, setIsSnackbarErrorOpen] = useState(false);
  const {
    userSelectedLocationPermissions,
    setUserSelectedLocationPermissions,
    setPositionOnMap,
    address,
    setAddress,
  } = useContext(LocationContext);
  const navigate = useNavigate();

  let errorHasBeenHandled = false;

  useEffect(() => {
    if (!userSelectedLocationPermissions) {
      getUserLocation();
    }
    // eslint-disable-next-line
  }, []);

  const successLocationCallback = async (position) => {
    setUserSelectedLocationPermissions(true);

    const userLocation = {
      lat: Number(position.coords.latitude),
      lng: Number(position.coords.longitude),
    };
    getUserAddressFromLatLng(userLocation.lat, userLocation.lng).then(
      (userAddress) => setAddress(userAddress)
    );
    setPositionOnMap(userLocation);
  };

  const errorLocationCallback = (error) => {
    setUserSelectedLocationPermissions(true);
    setPositionOnMap({
      lat: 45.7488716,
      lng: 21.2086793,
    });
    setAddress("Choose your address");

    if (!errorHasBeenHandled) {
      errorHasBeenHandled = true;
      if (error.code === error.PERMISSION_DENIED) {
        // User blocked geolocation request
        // alert("User denied the geolocation request.");
      } else {
        // Other errors
        alert("Error occurred while retrieving geolocation.", error.message);
      }
    }
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        successLocationCallback,
        errorLocationCallback,
        geolocationOptions
      );
    } else {
      alert("Browser does not support geolocation");
    }
  };

  const startOrderHandler = () => {
    if (address !== "Choose your address") {
      navigate("/restaurants");
    } else {
      setIsSnackbarErrorOpen(true);
    }
  };

  return (
    <React.Fragment>
      <div className="home-map-container">
        <div className="map-container">
          <Map nearbyRestaurants={foodieRestaurants} />
          <div className="map-overlay">
            <div className="map-overlay-text">Start your order here</div>
            <button className="overlay-button" onClick={startOrderHandler}>
              Order
            </button>
          </div>
        </div>
      </div>
      <SnackBar
        open={isSnackbarErrorOpen}
        message={"Please choose an address"}
        closeSnackbarHandler={() => setIsSnackbarErrorOpen(false)}
        severity="error"
      />
    </React.Fragment>
  );
};

export default HomeMap;
