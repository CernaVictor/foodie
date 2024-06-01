import React from "react";
import "../styles/RestaurantCard.css";

const RestaurantCard = ({ name, address, image, onClick }) => {
  return (
    <div className="restaurant-card" onClick={onClick}>
      <div className="restaurant-details">
        <div className="restaurant-image-container">
          <img src={image} alt="restaurant-pizza" />
        </div>

        <div className="restaurant-text">
          <div className="restaurant-name ">{name}</div>
          <div>{address}</div>
        </div>
      </div>
      <div className=""></div>
    </div>
  );
};

export default RestaurantCard;
