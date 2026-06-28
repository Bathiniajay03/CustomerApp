import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { productsApi } from '../services/api';
import ProductList from '../components/ProductList';
import './Home.css';

const QUICK_CATEGORIES = [
  'All',
  'Dairy',
  'Bakery',
  'Fruits',
  'Vegetables',
  'Beverages',
  'Snacks',
  'Personal Care',
  'Household'
];

const Home = ({ customerId, onAddToCart }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('');

  const liveStats = useMemo(() => {
    const availableCount = products.filter((product) => product.inStock).length;
    const outOfStockCount = Math.max(0, products.length - availableCount);
    return [
      { label: 'Live items', value: products.length },
      { label: 'Ready now', value: availableCount },
      { label: 'Out of stock', value: outOfStockCount }
    ];
  }, [products]);

  const fetchProducts = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      const response = await productsApi.getAll(searchQuery, category);
      setProducts(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, category]);

  // Auto-fetch products on mount and when filters change
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Auto-refresh every 15 seconds to pick up new items added from ERP (silent - no loading spinner)
  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchProducts(false);
    }, 15000);
    return () => clearInterval(intervalId);
  }, [fetchProducts]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  return (
    <div className="home-page">
      <section className="hero-card">
        <div className="hero-copy">
          <div className="hero-eyebrow">Quick commerce</div>
          <h1>Daily essentials, delivered fast</h1>
          <p>
            Browse fresh groceries, snacks, personal care, and household items from your live ERP catalog.
          </p>
        </div>

        <div className="hero-panel">
          {liveStats.map((stat) => (
            <div key={stat.label} className="stat-pill">
              <span>{stat.label}</span>
              <strong>{stat.value}</strong>
            </div>
          ))}
        </div>
      </section>

      <div className="toolbar-card">
        <form onSubmit={handleSearch} className="search-form">
          <span className="search-icon">⌕</span>
          <input
            type="text"
            placeholder="Search milk, bread, snacks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-btn">Search</button>
        </form>

        <div className="category-strip">
          {QUICK_CATEGORIES.map((option) => {
            const optionValue = option === 'All' ? '' : option;
            const isActive = category === optionValue;
            return (
              <button
                key={option}
                type="button"
                className={`category-chip ${isActive ? 'active' : ''}`}
                onClick={() => setCategory(optionValue)}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>

      {loading ? (
        <div className="loading-card">Loading products...</div>
      ) : error ? (
        <div className="error-card">{error}</div>
      ) : (
        <section className="catalog-section">
          <div className="catalog-header">
            <div>
              <p className="section-label">Live catalog</p>
              <h2>Shop by what is fresh now</h2>
            </div>
            <button
              type="button"
              className="clear-filters-btn"
              onClick={() => {
                setSearchQuery('');
                setCategory('');
              }}
            >
              Clear filters
            </button>
            <button
              type="button"
              className="clear-filters-btn"
              onClick={() => fetchProducts()}
              style={{ marginLeft: '8px' }}
            >
              Refresh
            </button>
          </div>

          <ProductList products={products} onAddToCart={onAddToCart} />
        </section>
      )}
    </div>
  );
};

export default Home;
