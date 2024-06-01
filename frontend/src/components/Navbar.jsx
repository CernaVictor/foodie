import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import FmdGoodOutlined from "@mui/icons-material/FmdGoodOutlined";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import PersonIcon from "@mui/icons-material/Person";
import ReceiptTwoToneIcon from "@mui/icons-material/Receipt";
import RestaurantOutlinedIcon from "@mui/icons-material/RestaurantOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import AddLocationIcon from "@mui/icons-material/AddLocation";
import LocalPizzaIcon from "@mui/icons-material/LocalPizza";
import React, { useContext, useState } from "react";
import foodieLogo from "../assets/foodieLogo.png";
import { useAuth } from "../context/LoginContext";
import "../styles/Navbar.css";
// import { Drawer } from "@mui/material";
import { useNavigate } from "react-router-dom";
import LocationContext from "../context/LocationContext";
import SnackBar from "../UI/Snackbar";
import EditAddressModal from "./EditAddressModal";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isEditAddressModalOpen, setIsEditAddressModalOpen] = useState(false);
  const [isSnackbarErrorOpen, setIsSnackbarErrorOpen] = useState(false);
  const { address, setAddress, setPositionOnMap } = useContext(LocationContext);
  const navigate = useNavigate();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const openMobileMenuHandler = () => {
    setIsMobileMenuOpen(true);
  };

  const closeMobileMenuHandler = () => {
    setIsMobileMenuOpen(false);
  };

  const toggleEditModalHandler = () => {
    setIsEditAddressModalOpen((prev) => !prev);
  };

  const clickRestaurantsHandler = () => {
    if (address === "Choose your address") {
      setIsSnackbarErrorOpen(true);
    } else {
      navigate("/restaurants");
      closeMobileMenuHandler();
    }
  };

  const clickShoppingCartHandler = () => {
    navigate(`/checkout/${user.cart.id}`);
    closeMobileMenuHandler();
  };
  const logoutHandler = () => {
    logout();
    navigate("/");
    setAddress("Choose your address");
    setPositionOnMap({
      lat: 45.7488716,
      lng: 21.2086793,
    });
    setIsMobileMenuOpen(false);
  };
  const truncatedAddress = () => {
    return address.split(",").slice(0, 1);
  };

  return (
    <React.Fragment>
      <nav className="navbar">
        <div className="logo-and-search-container">
          <div className="brand-logo">
            <a href="/">
              <img className="logo" alt="logo" src={foodieLogo} />
            </a>
          </div>
          {user !== null && (
            <div
              className="location-container"
              onClick={toggleEditModalHandler}
            >
              <div className="">
                <FmdGoodOutlined sx={{ color: "#ed2647" }} />{" "}
              </div>
              <div className="address-text">{truncatedAddress()}</div>
              <KeyboardArrowDownOutlinedIcon />
            </div>
          )}
        </div>

        <div className="menu-items-desktop">
          {user?.role === "user" && (
            <li className="menu-item">
              <div className="anchor" onClick={clickRestaurantsHandler}>
                RESTAURANTS
              </div>
            </li>
          )}
          <li className="menu-item">
            <a className="anchor" href="/orders">
              ORDERS
            </a>
          </li>
          {user?.role === "admin" && (
            <li className="menu-item">
              <a className="anchor" href="/add-restaurant">
                ADD RESTAURANT
              </a>
            </li>
          )}
          {user?.role === "admin" && (
            <li className="menu-item">
              <a className="anchor" href="/add-product">
                ADD PRODUCT
              </a>
            </li>
          )}
          {user === null ? (
            <li className="menu-item">
              <a className="anchor" href="/login">
                LOGIN
              </a>
            </li>
          ) : (
            <li className="menu-item">
              <div className="anchor" onClick={logoutHandler}>
                LOGOUT
              </div>
            </li>
          )}
          {user?.role === "user" && (
            <li className="menu-item">
              <div className="anchor" onClick={clickShoppingCartHandler}>
                <ShoppingCartOutlinedIcon />
              </div>
            </li>
          )}
        </div>

        {!isMobileMenuOpen ? (
          <li onClick={openMobileMenuHandler} className="mobile-menu-button">
            <MenuRoundedIcon />
          </li>
        ) : (
          <li onClick={closeMobileMenuHandler} className="mobile-menu-button">
            <CloseRoundedIcon />
          </li>
        )}

        {isMobileMenuOpen && (
          //   <Drawer
          //     // className="menu-items-mobile"
          //     open={isMobileMenuOpen}
          //     onClose={closeMobileMenuHandler}
          //     anchor="right"
          //     PaperProps={{ style: { width: "55%" } }}
          //   >
          <div className="menu-items-mobile">
            {user?.role === "user" && (
              <div
                className="menu-item-mobile anchor-mobile"
                onClick={clickRestaurantsHandler}
              >
                <div>RESTAURANTS</div>
                <div>
                  <RestaurantOutlinedIcon />
                </div>
              </div>
            )}
            <a className="menu-item-mobile anchor-mobile" href="/orders">
              <div>ORDERS</div>
              <div>
                <ReceiptTwoToneIcon />
              </div>
            </a>
            {user?.role === "admin" && (
              <a
                className="menu-item-mobile anchor-mobile"
                href="/add-restaurant"
              >
                <div>ADD RESTAURANT</div>
                <div>
                  <AddLocationIcon />
                </div>
              </a>
            )}
            {user?.role === "admin" && (
              <a className="menu-item-mobile anchor-mobile" href="/add-product">
                <div>ADD PRODUCT</div>
                <div>
                  <LocalPizzaIcon />
                </div>
              </a>
            )}
            {user === null ? (
              <a className="menu-item-mobile anchor-mobile" href="/">
                <div>LOGIN</div>
                <div>
                  <PersonIcon />
                </div>
              </a>
            ) : (
              <div
                className="menu-item-mobile anchor-mobile"
                onClick={logoutHandler}
              >
                <div>LOGOUT</div>
                <div>
                  <PersonIcon />
                </div>
              </div>
            )}
            {user?.role === "user" && (
              <div
                className="menu-item-mobile anchor-mobile"
                onClick={clickShoppingCartHandler}
              >
                <div>SHOPPING CART</div>
                <div>
                  <ShoppingCartOutlinedIcon />
                </div>
              </div>
            )}
          </div>
          //   </Drawer>
        )}
      </nav>
      {user !== null && (
        <div
          className="location-container-mobile"
          onClick={toggleEditModalHandler}
        >
          <FmdGoodOutlined sx={{ color: "#ed2647" }} />
          <div className="text-address">{truncatedAddress()}</div>
          <KeyboardArrowDownOutlinedIcon />
        </div>
      )}
      {isEditAddressModalOpen && (
        <EditAddressModal toggleEditModalHandler={toggleEditModalHandler} />
      )}
      <SnackBar
        open={isSnackbarErrorOpen}
        message={"Please choose an address"}
        closeSnackbarHandler={() => setIsSnackbarErrorOpen(false)}
        severity="error"
      />
    </React.Fragment>
  );
};

export default Navbar;
