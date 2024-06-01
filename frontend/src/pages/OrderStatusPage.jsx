import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../styles/OrderStatusPage.css";
import OrderStatus from "../components/OrderStatus";
import orderInPreparation from "../assets/pan.gif";
import orderOnTheWay from "../assets/order-on-the-way.gif";
import orderReadyForDelivery from "../assets/order-ready-for-delivery.gif";
import orderDelivered from "../assets/order-delivered.gif";
import orderPlaced from "../assets/order-placed.gif";

const OrderStatusPage = () => {
  const orderId = useParams();
  const [order, setOrder] = useState([]);
  const getOrder = async (orderId) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/order/${orderId}`
      );
      const statusImg = setImgBasedOnStatus(response.data.order.status);
      setOrder({ ...response.data, statusImg });
    } catch (err) {
      console.error(err);
    }
  };

  const setImgBasedOnStatus = (status) => {
    if (status === "Placed") {
      return orderPlaced;
    }
    if (status === "In preparation") {
      return orderInPreparation;
    }
    if (status === "Ready for delivery") {
      return orderReadyForDelivery;
    }
    if (status === "On the way") {
      return orderOnTheWay;
    }
    if (status === "Delivered") {
      return orderDelivered;
    }
  };

  useEffect(() => {
    getOrder(orderId.orderId);
  }, [orderId.orderId]);
  return (
    <div className="home-page-container">
      <div className="order-status-image-container">
        <img
          className="order-status-image"
          src={order.statusImg}
          alt="Order in proress..."
        />
      </div>
      <h4 className="food-preparing">
        Your order is {order.order?.status.toLowerCase()}
      </h4>
      <h3 className="order-status-title">Order details</h3>
      <OrderStatus
        restaurant={order?.order?.restaurant?.name ?? ""}
        location={order?.order?.restaurant?.address ?? ""}
        items={order?.order?.cartItems ?? []}
        driver={order?.order?.driver ?? ""}
        address={order?.order?.deliveryAddress ?? ""}
      />
    </div>
  );
};

export default OrderStatusPage;
