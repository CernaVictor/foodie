import React from "react";
import "../styles/PizzaCard.css";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";

const PizzaCard = ({
  imageSrc,
  title,
  ingredients,
  price,
  onAddToCart,
  product,
}) => {
  const addProductToCart = () => {
    onAddToCart({ product });
  };

  const pizzaIngredients = Array.isArray(ingredients)
    ? ingredients.map((ingredient) => ingredient.name).join(", ")
    : "";

  return (
    <div className="pizza-card">
      <div className="pizza-container">
        <img src={imageSrc} alt="Pizza" className="pizza-image" />
      </div>
      <div className="pizza-details">
        <h2 className="pizza-title">{title}</h2>
        <p className="pizza-description">{pizzaIngredients}</p>
      </div>
      <div className="pizza-actions">
        <p className="pizza-price">RON {price}</p>
        <AddCircleOutlineOutlinedIcon
          onClick={addProductToCart}
        ></AddCircleOutlineOutlinedIcon>
      </div>
    </div>
  );
};

export default PizzaCard;
