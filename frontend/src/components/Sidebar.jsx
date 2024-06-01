import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import {
  Drawer,
  List,
  ListItem,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { useParams } from "react-router-dom";

const Sidebar = ({ isOpen, toggleSidebar, onFilteredProductsChange }) => {
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [hasCheckbox, setHasCheckbox] = useState(false);
  const [ingredients, setIngredients] = useState([]);
  const restaurantId = useParams();

  const handleIngredientChange = (event) => {
    setSelectedIngredients(event.target.value);
  };

  const handleCheckboxChange = (event) => {
    setHasCheckbox(event.target.checked);
  };
  const getIngredients = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/ingredients`
      );
      setIngredients(response.data.ingredients);
    } catch (err) {
      console.error(err);
    }
  };

  const getFiltredProducts = async () => {
    try {
      const queryParams = [];
      if (selectedIngredients.length > 0) {
        selectedIngredients.forEach((ingredient) => {
          queryParams.push(`ingredients[]=${encodeURIComponent(ingredient)}`);
        });
      }

      if (hasCheckbox) {
        queryParams.push("hasAllergens=true");
      }

      const queryString = queryParams.join("&");
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/product/${restaurantId.restaurantId}${queryString ? `?${queryString}` : ""}`
      );
      onFilteredProductsChange(response.data.products);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getIngredients();
  }, []);

  useEffect(() => {
    getFiltredProducts();
  }, [selectedIngredients, hasCheckbox]);

  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={toggleSidebar}
      sx={{ "& .MuiDrawer-paper": { width: 250 } }}
    >
      <List>
        <ListItem>
          <h3 variant="h6">Select Filters</h3>
        </ListItem>
        <ListItem>
          <h4 variant="subtitle1">Select Ingredients</h4>
        </ListItem>
        <ListItem>
          <FormControl fullWidth>
            <InputLabel id="ingredient-select-label" sx={inputLabelSx}>
              Ingredients
            </InputLabel>

            <Select
              multiple
              id="restaurant-select"
              label="Restaurant"
              name="restaurant"
              value={selectedIngredients}
              onChange={handleIngredientChange}
              sx={selectSx}
              MenuProps={{
                sx: {
                  "&& .Mui-selected": {
                    backgroundColor: "pink !important",
                  },
                },
              }}
            >
              {ingredients &&
                ingredients.map((ingredient, index) => (
                  <MenuItem value={ingredient.name} key={index}>
                    {ingredient.name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </ListItem>
        <ListItem>
          <FormControlLabel
            control={
              <Checkbox
                checked={hasCheckbox}
                onChange={handleCheckboxChange}
                sx={{ color: "#ed2647", "&.Mui-checked": { color: "#ed2647" } }}
              />
            }
            label="No Allergens"
          />
        </ListItem>
      </List>
    </Drawer>
  );
};
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

export default Sidebar;
