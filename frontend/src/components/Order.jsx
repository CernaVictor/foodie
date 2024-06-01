import React from "react";
import "../styles/Orders.css";

export function Order({ order }) {
  return (
    <div className="cart-item">
      <div className="cart-item-details">
        <span>{order.quantity}x</span>
        <span>{order.product.name}</span>
      </div>
      <span>{order.product.price * order.quantity} RON</span>
    </div>
  );
}
