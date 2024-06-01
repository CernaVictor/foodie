import React from "react";
import "../styles/OrderSummary.css"

const OrderSummary = ({ productsPrice, deliveryPrice, servicesPrice }) => {
  const total = productsPrice + deliveryPrice + servicesPrice;

  return (
    <div className="order-summary">
      <h2>Summary</h2>
      <div className="summary-item">
        <span>Products</span>
        <span>RON {productsPrice}</span>
      </div>
      <div className="summary-item">
        <span>Delivery</span>
        <span>RON {deliveryPrice}</span>
      </div>
      <div className="summary-item">
        <span>Services</span>
        <span>RON {servicesPrice}</span>
      </div>
      <div className="total">
        <span>Total</span>
        <span>RON {total}</span>
      </div>
    </div>
  );
};

export default OrderSummary;
