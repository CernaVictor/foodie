import { Button } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router";
import useSWR from "swr";
import { Order } from "./Order";
import { calculateTotalQuantity } from "./utils";

const fetcher = (url) => fetch(url).then((res) => res.json());

export function UserView() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const { data } = useSWR(
    `${process.env.REACT_APP_API_URL}/order/user/${user.id}`,
    fetcher
  );

  const orders = data?.orders ?? [];

  return (
    <div className="restaurant-order-container">
      {orders?.length > 0 && <h3>Orders</h3>}
      {orders?.length > 0 &&
        orders?.map((order, index) => {
          const totalQuantity = calculateTotalQuantity(order.cartItems);
          return (
            <div key={order.id} className="order">
              <h3 onClick={() => navigate(`/order-status/${order.id}`)}>
                Order {index + 1}
              </h3>
              <div className="order-details">
                {totalQuantity} products from {order.restaurant.name}
              </div>
              <div className="order-details">
                <span>{order.deliveryAddress}</span>
              </div>
              <div className="cart-items-container">
                {order?.cartItems?.map((item) => (
                  <Order key={item.id} order={item} />
                ))}
              </div>
              <div className="order-status">
                <span>Status</span>
                <Button
                  style={{
                    background: "#b9b7b7",
                    color: "black",
                    borderRadius: "20px",
                    alignSelf: "center",
                    padding: "0px 24px",
                  }}
                  variant="contained"
                  disabled
                >
                  {order.status}
                </Button>
              </div>
            </div>
          );
        })}
      {orders.length === 0 && (
        <div className="empty-state">No available orders at the moment.</div>
      )}
    </div>
  );
}
