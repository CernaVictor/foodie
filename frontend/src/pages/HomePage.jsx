import React from "react";
import "../styles/HomePage.css";
import HomeMap from "../components/HomeMap";
import HomeHero from "../components/HomeHero";

const HomePage = () => {
  return (
    <div className="home-page-container">
      <HomeHero />
      <HomeMap />
    </div>
  );
};

export default HomePage;
