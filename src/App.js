import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import ProductDetailsPage from './pages/ProductDetailsPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import LoginPage from './pages/LoginPage';
import { useCart } from './hooks/useCart';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import './App.css';

function AppContent() {
  const { customer, loading, logout } = useAuth();
  const [cartMessage, setCartMessage] = useState('');
  
  // Use customer id if logged in
  const customerId = customer?.id;
  const { cartCount } = useCart(customerId || 1); // fallback to prevent errors when hook renders

  if (loading) {
    return <div className="text-center mt-5"><span className="spinner-border text-primary"></span></div>;
  }

  if (!customer) {
    return <LoginPage />;
  }

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
        <nav className="navbar border-bottom shadow-sm">
          <div className="nav-container d-flex justify-content-between align-items-center w-100 px-4 py-2">
            <Link to="/" className="logo text-decoration-none fw-bold fs-4 text-primary">QuickShop</Link>
            
            <div className="nav-links d-flex align-items-center gap-4">
              <Link to="/" className="text-decoration-none text-dark fw-semibold">Shop</Link>
              <Link to="/cart" className="cart-link text-decoration-none text-dark fw-semibold position-relative">
                Cart
                {cartCount > 0 && <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{fontSize: '0.65rem'}}>{cartCount}</span>}
              </Link>
              <Link to="/orders" className="text-decoration-none text-dark fw-semibold">Orders</Link>
              
              <div className="d-flex align-items-center gap-2 border-start ps-3 ms-2">
                <span className="text-muted small">👤 {customer.name || customer.email.split('@')[0]}</span>
                <button className="btn btn-sm btn-danger rounded-pill px-3 fw-bold" onClick={logout}>Sign Out</button>
              </div>
            </div>
          </div>
        </nav>

        {cartMessage && (
          <div className="alert alert-success m-3 text-center rounded-3 shadow-sm py-2">
            {cartMessage}
            <button type="button" className="btn-close btn-sm float-end" onClick={() => setCartMessage('')}></button>
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

        <footer className="footer text-center py-4 bg-light mt-auto border-top text-muted">
          <p className="mb-0 small fw-semibold">&copy; 2026 QuickShop. Powered by ProductERP</p>
        </footer>
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
