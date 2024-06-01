import React from 'react';
import "../styles/PaymentMethods.css";
import CashIcon from '@mui/icons-material/Money';
import PaymentRoundedIcon from '@mui/icons-material/PaymentRounded';

const PaymentMethods = () => {
  return (
    <div className="payment-methods">
      <h2>Payment method</h2>
      <div className="method">
        <span><PaymentRoundedIcon/> Card</span>
        <input type='checkbox'/>
      </div>
      <div className="method">
        <span><CashIcon /> Cash</span>
        <input type='checkbox'/>
      </div>
    </div>
  );
};

export default PaymentMethods;
