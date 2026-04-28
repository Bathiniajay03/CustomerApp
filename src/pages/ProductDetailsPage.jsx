import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { productsApi } from '../services/api';
import { getProductImageUrl } from '../utils/productImages';
import './ProductDetailsPage.css';

const ProductDetailsPage = ({ onAddToCart }) => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    let active = true;

    const loadProduct = async () => {
      try {
        setLoading(true);
        const response = await productsApi.getById(productId);
        if (active) {
          setProduct(response.data);
          setError(null);
        }
      } catch (err) {
        if (active) {
          setError(err.response?.data?.message || 'Failed to load product details');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadProduct();

    return () => {
      active = false;
    };
  }, [productId]);

  useEffect(() => {
    if (product?.availableStock && quantity > product.availableStock) {
      setQuantity(product.availableStock);
    }
  }, [product, quantity]);

  const handleAddToCart = async () => {
    if (!product?.inStock) return;

    try {
      setAdding(true);
      await onAddToCart(product.id, quantity);
      setMessage(`${quantity} item${quantity > 1 ? 's' : ''} added to cart`);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to add to cart');
    } finally {
      setAdding(false);
    }
  };

  const increaseQty = () => {
    if (!product?.availableStock) return;
    setQuantity((current) => Math.min(current + 1, product.availableStock));
  };

  const decreaseQty = () => {
    setQuantity((current) => Math.max(current - 1, 1));
  };

  if (loading) {
    return (
      <div className="product-details-page">
        <div className="details-loading">Loading product details...</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-details-page">
        <div className="details-error">
          <h2>Product not found</h2>
          <p>{error || 'The requested product could not be loaded.'}</p>
          <button className="back-button" onClick={() => navigate('/')}>
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="product-details-page">
      <div className="details-shell">
        <button className="back-link" onClick={() => navigate(-1)}>
          ← Back
        </button>

        <div className="details-grid">
          <div className="details-media">
            <img
              src={getProductImageUrl(product)}
              alt={product.description}
              className="details-image"
            />
          </div>

          <div className="details-content">
            <div className="details-badges">
              <span className="details-badge">{product.category}</span>
              <span className="details-badge">{product.uom}</span>
              <span className={`details-badge ${product.inStock ? 'badge-stock' : 'badge-out'}`}>
                {product.inStock ? `In Stock (${product.availableStock})` : 'Out of Stock'}
              </span>
            </div>

            <h1 className="details-title">{product.description}</h1>
            <p className="details-code">{product.itemCode}</p>

            <div className="details-price-row">
              <div>
                <span className="price-label">Price</span>
                <div className="details-price">${product.price?.toFixed(2)}</div>
              </div>
              <div>
                <span className="price-label">Available Stock</span>
                <div className="details-stock">{product.availableStock}</div>
              </div>
            </div>

            <div className="details-section">
              <h3>Product Details</h3>
              <div className="detail-list">
                <div className="detail-row">
                  <span>Product Type</span>
                  <strong>{product.category}</strong>
                </div>
                <div className="detail-row">
                  <span>Unit of Measure</span>
                  <strong>{product.uom}</strong>
                </div>
                <div className="detail-row">
                  <span>Product ID</span>
                  <strong>{product.id}</strong>
                </div>
                <div className="detail-row">
                  <span>Stock Status</span>
                  <strong>{product.inStock ? 'Ready to order' : 'Currently unavailable'}</strong>
                </div>
              </div>
            </div>

            <div className="details-section">
              <h3>Description</h3>
              <p className="details-description">
                {product.description} is available for quick delivery with live stock tracking.
              </p>
            </div>

            <div className="quantity-card">
              <div>
                <span className="price-label">Quantity</span>
                <p className="quantity-hint">Choose how many you want to add</p>
              </div>
              <div className="quantity-controls">
                <button type="button" onClick={decreaseQty} disabled={quantity <= 1}>
                  -
                </button>
                <span>{quantity}</span>
                <button
                  type="button"
                  onClick={increaseQty}
                  disabled={product.availableStock ? quantity >= product.availableStock : true}
                >
                  +
                </button>
              </div>
            </div>

            {message && <div className="details-message">{message}</div>}

            <div className="details-actions">
              <button
                className="primary-action"
                onClick={handleAddToCart}
                disabled={!product.inStock || adding}
              >
                {adding ? 'Adding...' : 'Add to Cart'}
              </button>
              <button className="secondary-action" onClick={() => navigate('/cart')}>
                Go to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
