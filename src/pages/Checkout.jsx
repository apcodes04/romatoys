import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Checkout.css';

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state?.product;

  if (!product) {
    return (
      <div className="checkout-empty">
        <h2>Your cart is empty</h2>
        <button onClick={() => navigate('/shop')} className="btn btn-primary">Go to Shop</button>
      </div>
    );
  }

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    alert('This is a demo frontend. Payment Gateway integration will be done later!');
  };

  return (
    <div className="checkout-container">
      <div className="checkout-content">
        <div className="order-summary">
          <h2>Order Summary</h2>
          <div className="summary-item">
            <img src={product.image} alt={product.name} />
            <div className="summary-info">
              <h3>{product.name}</h3>
              <p>Quantity: 1</p>
              <p className="summary-price">₹{product.price.toLocaleString()}</p>
            </div>
          </div>
          <div className="summary-total">
            <h3>Total: ₹{product.price.toLocaleString()}</h3>
          </div>
        </div>

        <div className="payment-section">
          <h2>Payment Details</h2>
          <form onSubmit={handlePaymentSubmit} className="payment-form">
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" placeholder="John Doe" required />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" placeholder="john@example.com" required />
            </div>
            <div className="form-group">
              <label>Shipping Address</label>
              <textarea placeholder="123 Street Name, City, Country" required></textarea>
            </div>
            
            <div className="payment-methods-mockup">
              <p>Select Payment Method:</p>
              <div className="methods-grid">
                <label><input type="radio" name="payment" required /> Credit Card</label>
                <label><input type="radio" name="payment" /> UPI / Google Pay</label>
                <label><input type="radio" name="payment" /> Cash on Delivery</label>
              </div>
            </div>

            <button type="submit" className="btn btn-pay">Proceed to Pay ₹{product.price.toLocaleString()}</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
