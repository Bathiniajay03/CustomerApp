import React from 'react';
import { useCart } from '../hooks/useCart';
import { Link, useNavigate } from 'react-router-dom';
import './CartPage.css';

const CartPage = ({ customerId }) => {
  const { cartItems, loading, removeFromCart, updateQuantity, cartTotal, error } = useCart(customerId);
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (loading) return <div className="loading">Loading cart...</div>;

  return (
    <div className="cart-page">
      <h1>Shopping Cart</h1>
      {error && <div className="error-message">{error}</div>}
      
      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty</p>
          <Link to="/" className="continue-shopping">Continue Shopping</Link>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {cartItems.map(item => (
              <div key={item.id} className="cart-item">
                <div className="item-details">
                  <h3>{item.productName}</h3>
                  <p className="item-code">{item.productCode}</p>
                  <p className="item-price">${item.price.toFixed(2)}</p>
                </div>
                
                <div className="item-quantity">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                </div>
                
                <div className="item-total">
                  <strong>${item.totalPrice.toFixed(2)}</strong>
                </div>
                
                <button 
                  className="remove-btn"
                  onClick={() => removeFromCart(item.id)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          
          <div className="cart-summary">
            <h2>Order Summary</h2>
            <div className="summary-row">
              <span>Total:</span>
              <strong>${cartTotal.toFixed(2)}</strong>
            </div>
            <button className="checkout-btn" onClick={handleCheckout}>
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
