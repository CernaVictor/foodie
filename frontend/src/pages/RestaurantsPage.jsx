import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import Map from "../components/Map";
import "../styles/RestaurantsPage.css";
import RestaurantCard from "../components/RestaurantCard";
import foodieLogo from "../assets/foodieLogo.png";
import LocationContext from "../context/LocationContext";

const RestaurantsPage = () => {
  const { restaurants } = useContext(LocationContext);
  const navigate = useNavigate();

  return (
    <div className="restaurants-page-container">
      <Map nearbyRestaurants={restaurants} />
      <div className="restaurants-header">
        <div className="restaurants-header-text">
          Results: {restaurants.length}
        </div>
      </div>
      {restaurants &&
        restaurants.map((restaurant) => (
          <RestaurantCard
            key={restaurant.id}
            name={restaurant.name}
            address={restaurant.address}
            image={foodieLogo}
            onClick={() => navigate(`/restaurant/${restaurant.id}`)}
          />
        ))}
    </div>
  );
};

export default RestaurantsPage;
