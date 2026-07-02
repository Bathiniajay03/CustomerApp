// import axios from 'axios';

// // API client configuration for both localhost and ngrok
// const localBaseURL = 'http://localhost:5157/api';
// const ngrokBaseURL = 'https://intermetameric-codi-unexasperating.ngrok-free.dev/api';
// const envBaseURL = (process.env.REACT_APP_API_URL || '').trim();
// const isBrowser = typeof window !== 'undefined';
// const isLocalHost =
//   isBrowser &&
//   ['localhost', '127.0.0.1', '[::1]'].includes(window.location.hostname);
// const shouldForceLocal =
//   isLocalHost ||
//   !envBaseURL ||
//   envBaseURL.includes('localhost');
// const baseURL = shouldForceLocal ? localBaseURL : (envBaseURL || ngrokBaseURL);

// console.log('Customer App using API Base URL:', baseURL);

// // Create axios instance
// const api = axios.create({
//   baseURL: baseURL,
//   headers: {
//     'Content-Type': 'application/json',
//     'ngrok-skip-browser-warning': 'true'
//   },
// });

// // Public Products API
// export const productsApi = {
//   getAll: (search = '', category = '') => 
//     api.get(`/public/products?search=${search}&category=${category}`),
  
//   getById: (id) => 
//     api.get(`/public/products/${id}`),
  
//   search: (query, category = null) => 
//     api.get(`/public/products/search?query=${query}&category=${category}`),
// };

// // Customers API
// export const customersApi = {
//   register: (data) => 
//     api.post('/public/customers/register', data),
  
//   login: (phone) => 
//     api.post('/public/customers/login', { phone }),
  
//   getById: (id) => 
//     api.get(`/public/customers/${id}`),
// };

// // Cart API
// export const cartApi = {
//   add: (customerId, productId, quantity) => {
//     const payload = {
//       customerId: Number(customerId),
//       productId: Number(productId),
//       quantity: Number(quantity),
//     };

//     if (!payload.customerId || !payload.productId || !payload.quantity) {
//       return Promise.reject(new Error('Invalid cart add payload: customerId, productId and quantity must be positive integers.'));
//     }

//     console.debug('cartApi.add payload', payload);
//     return api.post('/public/cart/add', payload);
//   },
  
//   get: (customerId) => 
//     api.get(`/public/cart/${customerId}`),
  
//   remove: (cartItemId) => 
//     api.delete(`/public/cart/remove/${cartItemId}`),
  
//   update: (cartItemId, quantity) => 
//     api.put(`/public/cart/update/${cartItemId}`, { quantity }),
// };

// // Orders API
// export const ordersApi = {
//   placeOrder: (customerId, items) => {
//     const payload = { customerId: Number(customerId), items };
//     console.debug('placeOrder payload:', JSON.stringify(payload, null, 2));
//     if (!customerId || items.length === 0) {
//       return Promise.reject(new Error('CustomerId and items are required'));
//     }
//     return api.post('/public/orders', payload).catch(err => {
//       console.error('placeOrder full error:', {
//         status: err.response?.status,
//         statusText: err.response?.statusText,
//         data: err.response?.data,
//         message: err.message
//       });
//       throw err;
//     });
//   },
  
//   getCustomerOrders: (customerId) => 
//     api.get(`/public/orders/customer/${customerId}`),
  
//   getOrderById: (id) => 
//     api.get(`/public/orders/${id}`),
//   getFinancialStatement: (customerId) =>
//     api.get(`/public/orders/customer/${customerId}/statement`),
// };

// // Delivery API
// export const deliveryApi = {
//   assign: (orderId, riderId) => 
//     api.post('/delivery/assign', { orderId, riderId }),
  
//   updateStatus: (orderId, status) => 
//     api.post('/delivery/update-status', { orderId, status }),
  
//   getByOrderId: (orderId) => 
//     api.get(`/delivery/orders/${orderId}`),
// };

// export default api;

import axios from 'axios';

// -------------------- BASE URL CONFIG --------------------
const localBaseURL = 'http://localhost:5157/api';
// const localBaseURL = 'https://intermetameric-codi-unexasperating.ngrok-free.dev/api';
const ngrokBaseURL = process.env.REACT_APP_API_URL;

const isBrowser = typeof window !== 'undefined';

const isLocalHost =
  isBrowser &&
  ['localhost', '127.0.0.1', '[::1]'].includes(window.location.hostname);

// decide environment
const baseURL = isLocalHost
  ? localBaseURL
  : (ngrokBaseURL || localBaseURL);

console.log('Customer App using API Base URL:', baseURL);

// -------------------- AXIOS INSTANCE --------------------
const api = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('customer_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  const tenantName = localStorage.getItem('customer_tenant_name');
  if (tenantName) {
    config.headers['X-Tenant-Name'] = tenantName;
  }
  
  return config;
});

// -------------------- PRODUCTS API --------------------
export const productsApi = {
  getAll: (search = '', category = '') =>
    api.get('/public/products', {
      params: { search, category }
    }),

  getById: (id) =>
    api.get(`/public/products/${id}`),

  search: (query, category = null) =>
    api.get('/public/products/search', {
      params: { query, category }
    }),
};

// -------------------- CUSTOMERS API --------------------
export const customersApi = {
  requestOtp: (email) =>
    api.post('/public/customers/request-otp', { email }),
    
  verifyOtp: (email, otp) =>
    api.post('/public/customers/verify-otp', { email, otp }),

  register: (data) =>
    api.post('/public/customers/register', data),

  login: (phone) =>
    api.post('/public/customers/login', { phone }),

  getById: (id) =>
    api.get(`/public/customers/${id}`),
};

// -------------------- CART API --------------------
export const cartApi = {
  add: (customerId, productId, quantity) => {
    const payload = {
      customerId: Number(customerId),
      productId: Number(productId),
      quantity: Number(quantity),
    };

    if (!payload.customerId || !payload.productId || !payload.quantity) {
      return Promise.reject(
        new Error('Invalid cart add payload: customerId, productId and quantity must be positive integers.')
      );
    }

    console.debug('cartApi.add payload', payload);
    return api.post('/public/cart/add', payload);
  },

  get: (customerId) =>
    api.get(`/public/cart/${customerId}`),

  remove: (cartItemId) =>
    api.delete(`/public/cart/remove/${cartItemId}`),

  update: (cartItemId, quantity) =>
    api.put(`/public/cart/update/${cartItemId}`, { quantity }),
};

// -------------------- ORDERS API --------------------
export const ordersApi = {
  placeOrder: (customerId, items) => {
    const payload = { customerId: Number(customerId), items };

    console.debug('placeOrder payload:', JSON.stringify(payload, null, 2));

    if (!customerId || !items?.length) {
      return Promise.reject(new Error('CustomerId and items are required'));
    }

    return api.post('/public/orders', payload).catch(err => {
      console.error('placeOrder full error:', {
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
        message: err.message
      });
      throw err;
    });
  },

  getCustomerOrders: (customerId) =>
    api.get(`/public/orders/customer/${customerId}`),

  getOrderById: (id) =>
    api.get(`/public/orders/${id}`),

  getFinancialStatement: (customerId) =>
    api.get(`/public/orders/customer/${customerId}/statement`),
};

// -------------------- DELIVERY API --------------------
export const deliveryApi = {
  assign: (orderId, riderId) =>
    api.post('/delivery/assign', { orderId, riderId }),

  updateStatus: (orderId, status) =>
    api.post('/delivery/update-status', { orderId, status }),

  getByOrderId: (orderId) =>
    api.get(`/delivery/orders/${orderId}`),
};

export default api;