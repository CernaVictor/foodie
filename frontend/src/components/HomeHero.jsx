import React from "react";
import "../styles/HomeHero.css";
import fourCheesePizza from "../assets/Four_Cheese_Pizza.jpg";

const HomeHero = () => {
  return (
    <div className="image-container">
      <img src={fourCheesePizza} alt="four cheese pizza" />
    </div>
  );
};

export default HomeHero;
