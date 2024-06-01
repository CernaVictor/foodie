import React, { useContext, useRef, useState } from "react";
import "../styles/AddProductPage.css";
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  styled,
} from "@mui/material";
import LocationContext from "../context/LocationContext";
import SnackBar from "../UI/Snackbar";
import axios from "axios";
import { useAuth } from "../context/LoginContext";

const AddProductPage = () => {
  const [hasAllergens, setHasAllergens] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState("");
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const { restaurants } = useContext(LocationContext);
  const { tkUser } = useAuth();
  const formRef = useRef(null);

  const handleFormSubmit = async (values) => {
    const ingredients = values["ingredients"].split(",");
    const payload = {
      name: values["name"],
      ingredients: ingredients,
      price: values["price"],
      calories: values["calories"],
      image: values["image"],
      hasAllergens: hasAllergens,
    };

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/admin/product/${selectedRestaurant}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${tkUser}`,
          },
        }
      );
      if (response.status === 200) {
        formRef.current.reset();
        setHasAllergens(false);
        setSelectedRestaurant("");
        setIsSnackbarOpen(true);
      }
    } catch (err) {
      console.log(err.response.data);
    }
  };

  return (
    <div className="add-product-page-container">
      <form
        className="add-product-form-container"
        ref={formRef}
        onSubmit={(event) => {
          event.preventDefault();
          handleFormSubmit(Object.fromEntries(new FormData(formRef.current)));
        }}
      >
        <CustomTextField
          id="product-name-input"
          label="Name"
          variant="outlined"
          fullWidth
          name="name"
        />
        <CustomTextField
          id="product-ingredients-input"
          label="Ingredients"
          variant="outlined"
          fullWidth
          multiline
          name="ingredients"
        />

        <CustomTextField
          type="number"
          id="product-price-input"
          label="Price"
          InputProps={{ inputProps: { min: 1, max: 120 } }}
          fullWidth
          name="price"
        />
        <CustomTextField
          type="number"
          id="product-calories-input"
          label="Number of calories"
          InputProps={{ inputProps: { min: 1, max: 10000 } }}
          fullWidth
          name="calories"
        />
        <CustomTextField
          id="product-image-input"
          label="Image"
          variant="outlined"
          fullWidth
          name="image"
        />
        <FormControl fullWidth>
          <InputLabel id="restaurant-select-label" sx={inputLabelSx}>
            Restaurant
          </InputLabel>
          <Select
            id="restaurant-select"
            label="Restaurant"
            name="restaurant"
            value={selectedRestaurant}
            onChange={(e) => setSelectedRestaurant(e.target.value)}
            sx={selectSx}
            MenuProps={{
              sx: {
                "&& .Mui-selected": {
                  backgroundColor: "pink !important",
                },
              },
            }}
          >
            {restaurants &&
              restaurants.map((restaurant, index) => (
                <MenuItem value={restaurant.id} key={index}>
                  {restaurant.name}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
        <FormControlLabel
          control={
            <Checkbox
              sx={{ color: "#ed2647", "&.Mui-checked": { color: "#ed2647" } }}
              name="hasAllergens"
              checked={hasAllergens}
              onChange={(e) => setHasAllergens(e.target.checked)}
            />
          }
          label="Has allergens"
        />
        <div>
          <button className="add-restaurant-button">Add product</button>
        </div>
      </form>
      <SnackBar
        open={isSnackbarOpen}
        message={"Product created successfully!"}
        closeSnackbarHandler={() => setIsSnackbarOpen(false)}
        severity="success"
      />
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
export default AddProductPage;
