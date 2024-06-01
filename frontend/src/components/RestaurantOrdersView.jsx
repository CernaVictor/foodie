import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Snackbar from "@mui/material/Snackbar";
import React, { useState } from "react";
import useSWR from "swr";

const statuses = ["Placed", "In preparation", "Ready for delivery"];

const fetcher = (url) => fetch(url).then((res) => res.json());

export function RestaurantView() {
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success");

  const user = JSON.parse(localStorage.getItem("user"));

  const { data: restaurant } = useSWR(
    `${process.env.REACT_APP_API_URL}/owner/restaurant/${user.id}`,
    fetcher
  );

  const { data, mutate } = useSWR(
    `${process.env.REACT_APP_API_URL}/order/restaurant/${restaurant?.restaurant?.id}`,
    fetcher
  );

  const handleChange = async (orderId, event) => {
    const status = event.target.value;
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/order/restaurant-update-status/${orderId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: status }),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setAlertMessage("Order status updated successfully!");
      setAlertSeverity("success");
      setShowAlert(true);
      mutate();
    } catch (error) {
      console.error("Failed to update order status:", error);
      setAlertMessage("Failed to update order status.");
      setAlertSeverity("error");
      setShowAlert(true);
    }
  };

  const orders = data?.orders ?? [];
  return (
    <div className="restaurant-order-container">
      <h3>Orders</h3>
      {orders?.map((order, index) => (
        <div key={order.id} className="order">
          <h3>Order {index + 1}</h3>
          <div className="order-details">
            Products from {order.restaurant.name}
          </div>
          <div className="order-details">
            <span>Delivery address: {order.deliveryAddress}</span>
          </div>
          <div className="order-status">
            <span>Status</span>
            <Box sx={{ minWidth: 120 }}>
              <FormControl size="small">
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={order.status}
                  onChange={(e) => handleChange(order.id, e)}
                >
                  {statuses.map((status, index) => (
                    <MenuItem
                      value={status}
                      key={index}
                      disabled={status === order.status || status === "Placed"}
                    >
                      {status}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </div>
        </div>
      ))}
      <Snackbar
        open={showAlert}
        autoHideDuration={6000}
        onClose={() => setShowAlert(false)}
      >
        <Alert onClose={() => setShowAlert(false)} severity={alertSeverity}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}
