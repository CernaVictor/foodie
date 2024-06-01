import React from "react";
import "../styles/OrderDetailsCheckout.css";

const OrderStatus = ({ restaurant, location, items, driver, address }) => {
  return (
    <div className="order-card">
      <div className="order-details-checkout">
        <div className="order-title">Products from {restaurant}</div>
        <div className="order-location">{location}</div>

        {items &&
          items.map((item) => (
            <div className="order-item-container" key={item.id}>
              <span className="order-item">
                {item?.quantity} x {item?.product?.name}
              </span>
              <div className="order-amount">
                <span className="order-price">
                  {item?.quantity * item?.product?.price} RON
                </span>
              </div>
            </div>
          ))}

        <div>
          <div className="order-title" style={{ marginTop: "40px" }}>
            Driver Information
          </div>
          <div className="order-item-container" style={{ marginTop: "10px" }}>
            <div>Name:</div>
            <div className="order-amount">
              {driver ? driver.firstName + " " + driver.lastName : "N/A"}
            </div>
          </div>
          <div className="order-item-container" style={{ marginTop: "10px" }}>
            <div>Phone number:</div>
            <div className="order-amount">{driver?.phoneNumber || "-"}</div>
          </div>
          <div className="order-item-container" style={{ marginTop: "10px" }}>
            <div>Delivery address:</div>
            <div className="order-amount">{address}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderStatus;
