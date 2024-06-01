import { Alert, Box, Button, Snackbar, styled } from "@mui/material";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useSWR from "swr";

const fetcher = (url) => fetch(url).then((res) => res.json());

export function DeliveryGuyView() {
  const [, setLatitude] = useState(null);
  const [, setLongitude] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success");
  const [value, setValue] = useState(0);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const position = JSON.parse(localStorage.getItem("positionOnMap"));

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        (error) => {
          console.error("Error getting location", error);
          //   setAlertMessage("Error getting location");
          //   setAlertSeverity("error");
          //   setShowAlert(true);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      //   setAlertMessage("Geolocation is not supported by this browser.");
      //   setAlertSeverity("error");
      //   setShowAlert(true);
    }
  }, []);

  const { data: allOrders, mutate: refreshAllOrders } = useSWR(
    position.lat && position.lng
      ? `${process.env.REACT_APP_API_URL}/order/driver?latitude=${position.lat}&longitude=${position.lng}`
      : null,
    fetcher
  );

  const { data: driverOrders, mutate: refreshDriverOrders } = useSWR(
    `${process.env.REACT_APP_API_URL}/order/driver/all/${user.id}`,
    fetcher
  );

  const assignOrder = async (orderId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/order/assign-driver/${orderId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            driverId: user.id,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      setAlertMessage("Order status changed successfully!");
      setAlertSeverity("success");
      setShowAlert(true);

      refreshAllOrders();
      refreshDriverOrders();
    } catch (error) {
      console.error("Failed to assign order:", error);
      setAlertMessage("Failed to assign order");
      setAlertSeverity("error");
      setShowAlert(true);
    }
  };

  const changeOrderStatus = async (orderId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/order/driver-update-status/${orderId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "Delivered" }),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      refreshAllOrders();
      refreshDriverOrders();
    } catch (error) {
      setAlertMessage("Failed to change order status");
      setAlertSeverity("error");
      setShowAlert(true);
    }
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const renderOrders = (orders) => (
    <>
      {orders?.length > 0 ? (
        orders?.map((order, index) => (
          <div key={order.id} className="order">
            <h3 onClick={() => navigate(`/order-status/${order.id}`)}>
              Order {index + 1}
            </h3>
            <div className="order-details">
              Products from {order?.restaurant?.name}
            </div>
            <div className="order-details">
              <span>Delivery address: {order?.deliveryAddress}</span>
            </div>
            {order.status === "Ready for delivery" && (
              <Button
                style={{
                  background: "#ed2647",
                  borderRadius: "20px",
                  width: "200px",
                  alignSelf: "center",
                  marginTop: "8px",
                }}
                variant="contained"
                onClick={() => assignOrder(order.id)}
              >
                Start Delivery
              </Button>
            )}
            {order.status === "On the way" && (
              <Button
                style={{
                  background: "#ed2647",
                  borderRadius: "20px",
                  width: "200px",
                  alignSelf: "center",
                  marginTop: "8px",
                }}
                variant="contained"
                onClick={() => changeOrderStatus(order.id)}
              >
                Mark as Delivered
              </Button>
            )}
            {order.status === "Delivered" && (
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
                >
                  {order.status}
                </Button>
              </div>
            )}
          </div>
        ))
      ) : (
        <div className="empty-state">No available orders at the moment.</div>
      )}
    </>
  );

  return (
    <div className="container">
      <Box
        sx={{ borderBottom: 1, borderColor: "divider", marginBottom: "16px" }}
      >
        <StyledTabs
          value={value}
          onChange={handleChange}
          aria-label="driver-orders-view"
        >
          <StyledTab label="All orders" {...a11yProps(0)} />
          <StyledTab label="My orders" {...a11yProps(1)} />
        </StyledTabs>
      </Box>
      <TabPanel value={value} index={0}>
        <div className="content">{renderOrders(allOrders?.orders)}</div>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <div className="content">{renderOrders(driverOrders?.orders[0])}</div>
      </TabPanel>

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

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

const StyledTabs = styled((props) => (
  <Tabs
    {...props}
    TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
  />
))({
  "& .MuiTabs-indicator": {
    display: "flex",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  "& .MuiTabs-indicatorSpan": {
    width: "100%",
    backgroundColor: "#ed2647",
  },
});

const StyledTab = styled((props) => <Tab disableRipple {...props} />)(
  ({ theme }) => ({
    textTransform: "none",
    fontWeight: theme.typography.fontWeightRegular,
    fontSize: theme.typography.pxToRem(15),
    marginRight: theme.spacing(1),
    color: "#ed2647",
    "&.Mui-selected": {
      color: "#ed2647",
    },
    "&.Mui-focusVisible": {
      backgroundColor: "#ed2647",
    },
  })
);
