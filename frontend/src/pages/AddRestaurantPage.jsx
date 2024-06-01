import React, { useContext, useEffect, useRef, useState } from "react";
import "../styles/AddRestaurantPage.css";
import axios from "axios";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  styled,
} from "@mui/material";
import LocationAutocompleteInput from "../components/LocationAutocompleteInput";
import GoogleMapsContext from "../context/GoogleMapsContext";
import { geocodeByAddress, getLatLng } from "react-places-autocomplete";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/LoginContext";

const AddRestaurantPage = () => {
  const [adminUsers, setAdminUsers] = useState([]);
  const { isGoogleMapsApiLoaded } = useContext(GoogleMapsContext);
  const { tkUser } = useAuth();
  const formRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getAdminUsers = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/user/admin/`
        );
        setAdminUsers(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getAdminUsers();
  }, []);

  const selectLocationHandler = async (selectedAddress) => {
    const addressInput = formRef.current.querySelector('input[name="address"]');
    if (addressInput) {
      addressInput.value = selectedAddress;
    }
  };
  const handleFormSubmit = async (values) => {
    const results = await geocodeByAddress(values["address"]);
    const { lat: latitude, lng: longitude } = await getLatLng(results[0]);
    const payload = {
      name: values["name"],
      description: values["description"],
      address: values["address"],
      latitude: latitude,
      longitude: longitude,
    };

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/admin/restaurant/`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${tkUser}`,
          },
        }
      );
      if (response.status === 200) {
        navigate(`/`);
      }
    } catch (err) {
      console.log("Creating a new restaurant failed: ", err);
    }
    formRef.current.reset();
  };
  return (
    <div className="add-restaurant-page-container">
      <form
        className="add-restaurant-form-container"
        ref={formRef}
        onSubmit={(event) => {
          event.preventDefault();
          handleFormSubmit(Object.fromEntries(new FormData(formRef.current)));
        }}
      >
        <CustomTextField
          id="restaurant-name-input"
          label="Name"
          variant="outlined"
          fullWidth
          name="name"
        />
        <CustomTextField
          id="restaurant-description-input"
          labelId="test"
          label="Description"
          variant="outlined"
          fullWidth
          name="description"
        />
        <FormControl fullWidth>
          <InputLabel id="restaurant-owner-select-label" sx={inputLabelSx}>
            Restaurant owner
          </InputLabel>
          <Select
            id="restaurant-owner-select"
            label="Restaurant owner"
            name="owner"
            defaultValue={""}
            MenuProps={{
              sx: {
                "&& .Mui-selected": {
                  backgroundColor: "pink !important",
                },
              },
            }}
            sx={selectSx}
          >
            {adminUsers &&
              adminUsers.map((adminUser, index) => (
                <MenuItem value={adminUser.id} key={index}>
                  {adminUser.firstName} {adminUser.lastName}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
        {isGoogleMapsApiLoaded && (
          <LocationAutocompleteInput
            selectLocationHandler={selectLocationHandler}
          />
        )}
        <input type="hidden" name="address" />
        <div>
          <button className="add-restaurant-button">Add restaurant</button>
        </div>
      </form>
    </div>
  );
};

const CustomTextField = styled(TextField)({
  "& label.Mui-focused": {
    color: "#ed2647",
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: "#ed2647",
  },
  "& .MuiOutlinedInput-root": {
    "&:hover fieldset": {
      borderColor: "#ed2647",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#ed2647",
    },
  },
});

const selectSx = {
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "#ed2647",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "#ed2647",
  },
};

const inputLabelSx = {
  "&.Mui-focused": {
    color: "#ed2647",
  },
  "&:hover": {
    color: "#ed2647",
  },
};

export default AddRestaurantPage;
