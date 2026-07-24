import { useState, useEffect, useCallback } from 'react';
import { cartApi } from '../services/api';

export const useCart = (customerId) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch cart items
  const fetchCart = useCallback(async () => {
    if (!customerId) return;
    
    const token = localStorage.getItem('customer_token');
    if (!token) return;
    
    setLoading(true);
    try {
      const response = await cartApi.get(customerId);
      setCartItems(response.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [customerId]);

  // Add item to cart
  const addToCart = async (productId, quantity) => {
    if (!customerId) {
      setError('Customer ID is required');
      return false;
    }

    try {
      const response = await cartApi.add(customerId, productId, quantity);
      await fetchCart(); // Refresh cart
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      return false;
    }
  };

  // Remove item from cart
  const removeFromCart = async (cartItemId) => {
    try {
      await cartApi.remove(cartItemId);
      await fetchCart(); // Refresh cart
      return true;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      return false;
    }
  };

  // Update cart item quantity
  const updateQuantity = async (cartItemId, quantity) => {
    try {
      const response = await cartApi.update(cartItemId, quantity);
      await fetchCart(); // Refresh cart
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      return false;
    }
  };

  // Clear cart
  const clearCart = async () => {
    try {
      const promises = cartItems.map(item => cartApi.remove(item.id));
      await Promise.all(promises);
      setCartItems([]);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      return false;
    }
  };

  // Calculate cart total
  const cartTotal = cartItems.reduce((total, item) => total + item.totalPrice, 0);
  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  // Load cart on mount or when customerId changes
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  return {
    cartItems,
    loading,
    error,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotal,
    cartCount,
    refreshCart: fetchCart,
  };
};
