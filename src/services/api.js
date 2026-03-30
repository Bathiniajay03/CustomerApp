import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Public Products API
export const productsApi = {
  getAll: (search = '', category = '') => 
    api.get(`/public/products?search=${search}&category=${category}`),
  
  getById: (id) => 
    api.get(`/public/products/${id}`),
  
  search: (query, category = null) => 
    api.get(`/public/products/search?query=${query}&category=${category}`),
};

// Customers API
export const customersApi = {
  register: (data) => 
    api.post('/public/customers/register', data),
  
  login: (phone) => 
    api.post('/public/customers/login', { phone }),
  
  getById: (id) => 
    api.get(`/public/customers/${id}`),
};

// Cart API
export const cartApi = {
  add: (customerId, productId, quantity) => 
    api.post('/public/cart/add', { customerId, productId, quantity }),
  
  get: (customerId) => 
    api.get(`/public/cart/${customerId}`),
  
  remove: (cartItemId) => 
    api.delete(`/public/cart/remove/${cartItemId}`),
  
  update: (cartItemId, quantity) => 
    api.put(`/public/cart/update/${cartItemId}`, { quantity }),
};

// Orders API
export const ordersApi = {
  placeOrder: (customerId, items) => 
    api.post('/public/orders', { customerId, items }),
  
  getCustomerOrders: (customerId) => 
    api.get(`/public/orders/customer/${customerId}`),
  
  getOrderById: (id) => 
    api.get(`/public/orders/${id}`),
};

// Delivery API
export const deliveryApi = {
  assign: (orderId, riderId) => 
    api.post('/delivery/assign', { orderId, riderId }),
  
  updateStatus: (orderId, status) => 
    api.post('/delivery/update-status', { orderId, status }),
  
  getByOrderId: (orderId) => 
    api.get(`/delivery/orders/${orderId}`),
};

export default api;
