import React from "react";
import "../styles/RestaurantImage.css";
import logo2 from "../assets/foodieLogo-small.png";

const RestaurantImage = ({ name }) => {
  return (
    <div className="image-container">
      <img src={logo2} alt="Delicious Pizza" style={{ objectFit: "contain" }} />
      <div className="overlay-text">{name}</div>
    </div>
  );
};

export default RestaurantImage;
