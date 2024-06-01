import React from "react";
import "../styles/OrderDetailsCheckout.css";
import RemoveCircleOutlineRoundedIcon from "@mui/icons-material/RemoveCircleOutlineRounded";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import ClearIcon from "@mui/icons-material/Clear";

const OrderDetailsCheckout = ({
  restaurant,
  location,
  item,
  quantity,
  price,
  onDeleteProductFromCart,
  onDecrementProductQuantity,
  onIncrementProductQuantity,
  cartItem,
  cartItems,
}) => {
  const deleteProductFromCart = () => {
    onDeleteProductFromCart({ cartItem });
  };
  const decrementProductQuantity = () => {
    onDecrementProductQuantity({ cartItem });
  };
  const incrementProductQuantity = () => {
    onIncrementProductQuantity({ cartItem });
  };

  return (
    <div className="order-card">
      <div className="order-details-checkout">
        <div className="order-item-container">
          <div className="order-item-line">
            <ClearIcon onClick={deleteProductFromCart} />
          </div>
          <div className="order-item-line-title">
            {item} RON {quantity * price}
          </div>

          <div className="order-amount">
            {quantity > 1 && (
              <RemoveCircleOutlineRoundedIcon
                onClick={decrementProductQuantity}
              />
            )}
            <span className="order-price">{quantity}</span>
            <AddCircleOutlineRoundedIcon onClick={incrementProductQuantity} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsCheckout;
