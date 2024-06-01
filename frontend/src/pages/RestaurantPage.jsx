import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/LoginContext";
import "../styles/RestaurantPage.css";
import RestaurantImage from "../components/RestaurantImage";
import Sidebar from "../components/Sidebar";
import TuneIcon from "@mui/icons-material/Tune";
import { IconButton } from "@mui/material";
import PizzaCard from "../components/PizzaCard";
import Pizza from "../assets/pizza.jpg";
import Snackbar from "../UI/Snackbar.jsx";
import ProductWarningModal from "../components/ProductWarningModal.jsx";

const RestaurantPage = () => {
  const { restaurantId } = useParams();
  const [products, setProducts] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
  const [restaurant, setRestaurant] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const user = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleFilteredProductsChange = (products) => {
    setFilteredProducts(products);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const toggleWarningModal = () => {
    setIsWarningModalOpen((prev) => !prev);
  };

  const getRestaurantProducts = async (restaurantId) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/product/${restaurantId}`
      );
      setProducts(response.data.products);
    } catch (err) {
      console.error(err);
    }
  };

  const getRestaurant = async (restaurantId) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/restaurant/${restaurantId}`
      );
      setRestaurant(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const addProductToCart = async (product) => {
    const storedRestaurant = localStorage.getItem("selectedRestaurant");
    const parsedRestaurant = storedRestaurant
      ? JSON.parse(storedRestaurant)
      : null;
    setSelectedProduct(product);
    if (parsedRestaurant && parsedRestaurant.id !== restaurant.id) {
      toggleWarningModal();
    } else {
      addProductToCartRequest(product);
    }
  };

  const confirmRemoveItemsFromCartHandler = async () => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/cart/items/${user.user.cart.id}`,
        {
          cartId: user.user.cart.id,
        }
      );
    } catch (err) {
      console.error(err);
    }
    addProductToCartRequest(selectedProduct);
    toggleWarningModal();
  };
  const addProductToCartRequest = async (product) => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/cart/item`,
        {
          quantity: 1,
          cartId: user.user.cart.id,
          productId: product.id,
        }
      );
      if (res.status === 200) {
        localStorage.setItem("selectedRestaurant", JSON.stringify(restaurant));
        setSnackbarOpen(true);
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getRestaurantProducts(restaurantId);
    getRestaurant(restaurantId);
  }, [restaurantId]);

  useEffect(() => {
    let filtered = products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortOrder === "asc") {
      filtered.sort((a, b) => a.price - b.price);
    } else {
      filtered.sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(filtered);
  }, [searchTerm, sortOrder, products]);

  return (
    <div className="home-page-container">
      <RestaurantImage src={Pizza} name={restaurant.name} />
      <div className="filters-container">
        <span className="text">Our Pizzas</span>
        <IconButton onClick={toggleSidebar}>
          <TuneIcon />
        </IconButton>
        <Sidebar
          isOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          onFilteredProductsChange={handleFilteredProductsChange}
        />
      </div>
      <div className="pizza-sorting-container">
        <input
          type="text"
          placeholder="Search pizzas"
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        ></input>
        <div className="sort-by-price">
          <label className="sort-label">Sort by price</label>
          <select
            className="price-select"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>
      {filteredProducts &&
        filteredProducts.map((product) => (
          <PizzaCard
            key={product.id}
            imageSrc={product.image}
            title={product.name}
            ingredients={product.ingredients}
            price={product.price}
            product={product}
            onAddToCart={() => addProductToCart(product)}
          />
        ))}
      <div className="order-button-container">
        <button
          className="order-button"
          onClick={() => navigate(`/checkout/${user.user.cart.id}`)}
        >
          Order Now
        </button>
      </div>
      {isWarningModalOpen && (
        <ProductWarningModal
          toggleWarningModal={toggleWarningModal}
          confirmRemoveItemsFromCartHandler={confirmRemoveItemsFromCartHandler}
        />
      )}
      <Snackbar
        open={snackbarOpen}
        message={"Product added to cart successfully!"}
        closeSnackbarHandler={() => setSnackbarOpen(false)}
        severity="success"
      />
    </div>
  );
};
export default RestaurantPage;
