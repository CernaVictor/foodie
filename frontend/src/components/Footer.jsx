import React from "react";
import "../styles/Footer.css";
import foodieLogo from "../assets/foodieLogo.png";
import FacebookOutlinedIcon from "@mui/icons-material/FacebookOutlined";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-row">
          <div className="left-column">
            <div className="description-text">
              <div className="copy-right-text">@2024 Foodie, Inc.</div>
              <div className="motto-text"> Where is the PIZZA!</div>
            </div>
            <div className="foodie-logo-container">
              <img className="logo" alt="logo" src={foodieLogo} />
            </div>
          </div>
          <div className="right-column">
            <div>Follow us:</div>
            <div className="social-icons">
              <a href="https://www.instagram.com/">
                <InstagramIcon sx={{ fontSize: 30, color: "#4f5057" }} />
              </a>
              <a href="https://www.facebook.com/">
                <FacebookOutlinedIcon sx={{ fontSize: 30, color: "#4f5057" }} />
              </a>
              <a href="https://www.linkedin.com/">
                <LinkedInIcon sx={{ fontSize: 30, color: "#4f5057" }} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
