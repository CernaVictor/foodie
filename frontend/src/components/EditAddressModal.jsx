import React, { useContext, useState } from "react";
import Modal from "../UI/Modal";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import "../styles/EditAddressModal.css";
import GoogleMapsContext from "../context/GoogleMapsContext";
import LocationAutocomplete from "./LocationAutocompleteInput";
import FmdGoodOutlined from "@mui/icons-material/FmdGoodOutlined";
import { geocodeByAddress, getLatLng } from "react-places-autocomplete";
import LocationContext from "../context/LocationContext";
import { geolocationOptions, getUserAddressFromLatLng } from "./utils";
import SnackBar from "../UI/Snackbar";

const EditAddressModal = ({ toggleEditModalHandler }) => {
  const { isGoogleMapsApiLoaded } = useContext(GoogleMapsContext);
  const { setAddress, setPositionOnMap } = useContext(LocationContext);
  const [showConfirmAddressButton, setShowConfirmAddressButton] =
    useState(false);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [isSnackbarErrorOpen, setIsSnackbarErrorOpen] = useState(false);
  let locationErrorHasBeenHandled = false;

  const selectLocationHandler = async (selectedAddress) => {
    setSelectedAddress(selectedAddress);
    if (selectedAddress) {
      setShowConfirmAddressButton(true);
    } else {
      setShowConfirmAddressButton(false);
    }
  };

  const successLocationCallback = async (position) => {
    const userLocation = {
      lat: Number(position.coords.latitude),
      lng: Number(position.coords.longitude),
    };
    getUserAddressFromLatLng(userLocation.lat, userLocation.lng).then(
      (userAddress) => setAddress(userAddress)
    );
    setPositionOnMap(userLocation);
    toggleEditModalHandler();
  };
  const errorLocationCallback = (error) => {
    if (!locationErrorHasBeenHandled) {
      locationErrorHasBeenHandled = true;
      if (error.code === error.PERMISSION_DENIED) {
        // User blocked geolocation request
        setIsSnackbarErrorOpen(true);
      } else {
        alert("Error occurred while retrieving geolocation.", error.message);
      }
    }
  };
  const confirmAddressHandler = async () => {
    const results = await geocodeByAddress(selectedAddress);
    const latLng = await getLatLng(results[0]);
    const newAddress = selectedAddress;
    setAddress(newAddress);
    setPositionOnMap(latLng);
    toggleEditModalHandler();
  };

  const useCurrentAddressHandler = async () => {
    navigator.geolocation.getCurrentPosition(
      successLocationCallback,
      errorLocationCallback,
      geolocationOptions
    );
  };

  return (
    <React.Fragment>
      <Modal>
        <div className="edit-address-modal-container ">
          <div className="edit-address-top-section">
            <button className="close-button" onClick={toggleEditModalHandler}>
              <CloseRoundedIcon />
            </button>
          </div>
          <div className="choose-address-section">
            <div className="autocomplete-address-section">
              {isGoogleMapsApiLoaded && (
                <LocationAutocomplete
                  selectLocationHandler={selectLocationHandler}
                />
              )}
              {showConfirmAddressButton && (
                <button
                  className="confirm-address-btn"
                  onClick={confirmAddressHandler}
                >
                  Confirm Address
                </button>
              )}
            </div>
            <div className="current-address-section">
              <FmdGoodOutlined sx={{ color: "#ed2647" }} />
              <div
                className="current-address-text"
                onClick={useCurrentAddressHandler}
              >
                Use your current address
              </div>
            </div>
          </div>
        </div>
      </Modal>
      <SnackBar
        open={isSnackbarErrorOpen}
        message={"Location permissions have been denied by the user"}
        closeSnackbarHandler={() => setIsSnackbarErrorOpen(false)}
        severity="error"
      />
    </React.Fragment>
  );
};

export default EditAddressModal;
