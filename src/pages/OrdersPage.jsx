import React, { useState, useEffect, useCallback } from 'react';
import { ordersApi } from '../services/api';
import './CartPage.css';

const OrdersPage = ({ customerId }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    try {
      const response = await ordersApi.getCustomerOrders(customerId);
      setOrders(response.data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  }, [customerId]);

  useEffect(() => {
    fetchOrders();

    const refreshOnFocus = () => {
      fetchOrders();
    };
    const refreshOnVisible = () => {
      if (document.visibilityState === 'visible') {
        fetchOrders();
      }
    };

    const intervalId = window.setInterval(() => {
      if (document.visibilityState === 'visible') {
        fetchOrders();
      }
    }, 4000);

    window.addEventListener('focus', refreshOnFocus);
    document.addEventListener('visibilitychange', refreshOnVisible);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener('focus', refreshOnFocus);
      document.removeEventListener('visibilitychange', refreshOnVisible);
    };
}, [fetchOrders]);

  if (loading) return <div className="loading">Loading orders...</div>;

  return (
    <div className="orders-page">
      <h1>My Orders</h1>

      {orders.length === 0 ? (
        <div className="empty-orders">
          <p>You haven't placed any orders yet</p>
          <a href="/" className="back-link">Start Shopping</a>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map(order => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div>
                  <h3>Order #{order.orderNumber}</h3>
                  <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                  {order.deliveryAddress && <p>Deliver to: {order.deliveryAddress}</p>}
                </div>
                <span className={`status-badge status-${order.status.toLowerCase()}`}>
                  {order.status}
                </span>
              </div>
              
              <div className="order-items">
                {order.items.map((item, idx) => (
                  <div key={idx} className="order-item">
                    <span>{item.productName} x {item.quantity}</span>
                    <strong>${item.totalPrice.toFixed(2)}</strong>
                  </div>
                ))}
              </div>
              
              <div className="order-total">
                <strong>Total: ${order.totalAmount.toFixed(2)}</strong>
              </div>
              
              {order.deliveryStatus && (
                <div className="delivery-info">
                  <p>Delivery Status: {order.deliveryStatus.status}</p>
                  {order.deliveryStatus.assignedAt && (
                    <p>Assigned: {new Date(order.deliveryStatus.assignedAt).toLocaleString()}</p>
                  )}
                  {order.deliveryStatus.riderId && (
                    <p>Rider ID: {order.deliveryStatus.riderId}</p>
                  )}
                  {order.deliveryStatus.deliveredAt && (
                    <p>Delivered: {new Date(order.deliveryStatus.deliveredAt).toLocaleString()}</p>
                  )}
                </div>
              )}

              {!order.deliveryStatus && (
                <div className="delivery-info">
                  <p>Delivery Status: Waiting for rider assignment</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
