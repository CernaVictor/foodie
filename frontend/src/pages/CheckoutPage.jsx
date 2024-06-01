import React from "react";
import axios from "axios";
import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/CheckoutPage.css";
import OrderDetailsCheckout from "../components/OrderDetailsCheckout";
import OrderSummary from "../components/OrderSummary";
import LocationContext from "../context/LocationContext";
import { useAuth } from "../context/LoginContext";

const CheckoutPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const cartId = useParams();
  const { address } = useContext(LocationContext);
  const { user } = useAuth();
  const navigate = useNavigate();

  const getCartItems = async (cartId) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/cart/items/${cartId}`
      );
      setCartItems(response.data);
      const total = response.data.reduce((acc, cartItem) => {
        return acc + cartItem.quantity * cartItem.product.price;
      }, 0);
      setCartTotal(total);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteProductFromCart = async (cartItemId) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/cart/item/${cartItemId}`,
        {
          cartId: cartId,
        }
      );
      setCartItems((prevCartItems) =>
        prevCartItems.filter((item) => item.id !== cartItemId)
      );
      if (cartItems.length === 1) localStorage.removeItem("selectedRestaurant");
    } catch (err) {
      console.error(err);
    }
  };
  const decrementProductQuantity = async (cartItemId) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/cart/item/decrement/${cartItemId}`,
        { cartId: cartId.cartId }
      );
      getCartItems(cartId.cartId);
    } catch (err) {
      console.error(err);
    }
  };

  const incrementProductQuantity = async (cartItemId) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/cart/item/increment/${cartItemId}`,
        { cartId: cartId.cartId }
      );
      getCartItems(cartId.cartId);
    } catch (err) {
      console.error(err);
    }
  };

  const createOrder = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/order`,
        {
          date: new Date(),
          deliveryAddress: address,
          billingAddress: address,
          restaurantId: parsedRestaurant.id,
          customerId: user.id,
        }
      );

      if (response.status === 200) {
        navigate(`/order-status/${response.data.id}`);
        localStorage.removeItem("selectedRestaurant");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const storedRestaurant = localStorage.getItem("selectedRestaurant");
  const parsedRestaurant = JSON.parse(storedRestaurant);

  useEffect(() => {
    getCartItems(cartId.cartId);
  }, [cartId]);

  return (
    <>
      {cartItems.length && cartItems ? (
        <div className="order-page">
          <div className="order-checkout-display">
            <div className="order-checkout-title">Your order</div>
            <div className="order-checkout-restaurant">
              Selected products from {parsedRestaurant.name}
            </div>
            <div className="order-checkout-location">
              {parsedRestaurant.address}
            </div>
          </div>
          {cartItems &&
            cartItems.map((cartItem) => (
              <OrderDetailsCheckout
                key={cartItem.id}
                restaurant={parsedRestaurant.name}
                location={parsedRestaurant.address}
                item={cartItem.product.name}
                quantity={cartItem.quantity}
                price={cartItem.product.price}
                cartItems={cartItems}
                onDeleteProductFromCart={() =>
                  deleteProductFromCart(cartItem.id)
                }
                onIncrementProductQuantity={() =>
                  incrementProductQuantity(cartItem.id)
                }
                onDecrementProductQuantity={() =>
                  decrementProductQuantity(cartItem.id)
                }
              />
            ))}
          <OrderSummary
            productsPrice={cartTotal}
            deliveryPrice={10}
            servicesPrice={10}
          />
          <div className="order-button-container">
            <button className="order-button" onClick={createOrder}>
              Confirm Order
            </button>
          </div>
        </div>
      ) : (
        <div className="cart-empty">
          <div className="cart-empty-title">Your cart is empty</div>
          <button
            className="order-button"
            onClick={() => navigate("/restaurants")}
          >
            Take me to restaurants
          </button>
        </div>
      )}
    </>
  );
};

export default CheckoutPage;
