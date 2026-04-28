import React from 'react';
import { useCart } from '../hooks/useCart';
import { ordersApi } from '../services/api';
import { useNavigate } from 'react-router-dom';
import './CartPage.css';

const CheckoutPage = ({ customerId }) => {
  const { cartItems, cartTotal, clearCart } = useCart(customerId);
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: '',
    phone: '',
    address: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const items = cartItems.map(item => ({
        productId: Number(item.productId || item.ProductId),
        quantity: Number(item.quantity || item.Quantity),
        price: Number(item.price || item.Price)
      }));

      console.log('Items being sent to order:', items);
      console.log('Cart items structure:', cartItems[0]);

      await ordersApi.placeOrder(Number(customerId), items);
      await clearCart();
      alert('Order placed successfully!');
      navigate('/orders');
    } catch (error) {
      console.error('Checkout error full:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        error: error
      });
      const errorMsg = error.response?.data?.message || error.message || 'Failed to place order';
      alert(`Order Error: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="checkout-page">
        <h1>Checkout</h1>
        <div className="empty-cart">
          <p>Your cart is empty</p>
          <a href="/" className="back-link">Continue Shopping</a>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>
      
      <div className="checkout-content">
        <form onSubmit={handleSubmit} className="checkout-form">
          <h2>Delivery Information</h2>
          <div className="form-group">
            <label>Name:</label>
            <input 
              type="text" 
              required 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>Phone:</label>
            <input 
              type="tel" 
              required 
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>Address:</label>
            <textarea 
              required 
              rows="4"
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
            />
          </div>
          <button type="submit" className="place-order-btn" disabled={loading}>
            {loading ? 'Placing Order...' : 'Place Order'}
          </button>
        </form>

        <div className="order-summary">
          <h2>Order Summary</h2>
          {cartItems.map(item => (
            <div key={item.id} className="summary-item">
              <span>{item.productName} x {item.quantity}</span>
              <strong>${item.totalPrice.toFixed(2)}</strong>
            </div>
          ))}
          <div className="summary-total">
            <strong>Total: ${cartTotal.toFixed(2)}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
