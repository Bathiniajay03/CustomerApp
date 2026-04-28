import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import ProductDetailsPage from './pages/ProductDetailsPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import { useCart } from './hooks/useCart';
import './App.css';

// Demo customer ID - in production this would come from authentication
const DEMO_CUSTOMER_ID = 1;

function App() {
  const [customerId] = useState(DEMO_CUSTOMER_ID);
  const [cartMessage, setCartMessage] = useState('');
  const { cartCount } = useCart(customerId);

  const handleAddToCart = async (productId, quantity) => {
    try {
      const { cartApi } = await import('./services/api');
      const response = await cartApi.add(customerId, productId, quantity);
      setCartMessage(`${quantity} item${quantity > 1 ? 's' : ''} added to cart successfully.`);
      return response.data;
    } catch (error) {
      const errMsg = error?.response?.data?.message || error?.message || 'Failed to add to cart';
      setCartMessage(errMsg);
      return false;
    }
  };

  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <div className="nav-container">
            <Link to="/" className="logo">QuickShop</Link>
            
            <div className="nav-links">
              <Link to="/">Shop</Link>
              <Link to="/cart" className="cart-link">
                Cart
                {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
              </Link>
              <Link to="/orders">Orders</Link>
            </div>
          </div>
        </nav>

        {cartMessage && (
          <div className="notification-message">
            {cartMessage}
          </div>
        )}

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home customerId={customerId} onAddToCart={handleAddToCart} />} />
            <Route
              path="/product/:productId"
              element={<ProductDetailsPage customerId={customerId} onAddToCart={handleAddToCart} />}
            />
            <Route path="/cart" element={<CartPage customerId={customerId} />} />
            <Route path="/checkout" element={<CheckoutPage customerId={customerId} />} />
            <Route path="/orders" element={<OrdersPage customerId={customerId} />} />
          </Routes>
        </main>

        <footer className="footer">
          <p>&copy; 2026 QuickShop. Powered by ProductERP</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
