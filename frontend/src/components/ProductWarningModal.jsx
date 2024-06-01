import React from "react";
import "../styles/ProductWarningModal.css";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

const ProductWarningModal = ({
  confirmRemoveItemsFromCartHandler,
  toggleWarningModal,
}) => {
  const storedRestaurant = localStorage.getItem("selectedRestaurant");
  const restaurantName = JSON.parse(storedRestaurant).name;
  return (
    <div className="backdrop">
      <div className="product-warning-modal">
        <div className="product-warning-modal-container">
          <div className="product-warning-modal-top-section">
            <button
              className="product-warning-close-button"
              onClick={toggleWarningModal}
            >
              <CloseRoundedIcon />
            </button>
          </div>
          <div className="">
            Your cart contains products from {restaurantName}. By adding
            products from another restaurant, you will have to drop products
            from your current cart
          </div>
          <div className="">
            <div className="product-warning-actions">
              <button
                className="product-warning-action-button"
                onClick={confirmRemoveItemsFromCartHandler}
              >
                Confirm
              </button>
              <button
                className="product-warning-action-button"
                onClick={toggleWarningModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductWarningModal;
