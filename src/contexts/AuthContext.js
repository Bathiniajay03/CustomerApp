import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [customer, setCustomer] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage for existing session
    const storedToken = localStorage.getItem('customer_token');
    const storedCustomer = localStorage.getItem('customer_data');

    if (storedToken && storedCustomer) {
      setToken(storedToken);
      setCustomer(JSON.parse(storedCustomer));
    }
    setLoading(false);
  }, []);

  const login = (tokenData, customerData) => {
    setToken(tokenData);
    setCustomer(customerData);
    localStorage.setItem('customer_token', tokenData);
    localStorage.setItem('customer_data', JSON.stringify(customerData));
  };

  const logout = () => {
    setToken(null);
    setCustomer(null);
    localStorage.removeItem('customer_token');
    localStorage.removeItem('customer_data');
  };

  return (
    <AuthContext.Provider value={{ customer, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
