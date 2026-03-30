import React from 'react';
import ProductCard from './ProductCard';
import './ProductList.css';

const ProductList = ({ products, onAddToCart }) => {
  if (!products || products.length === 0) {
    return (
      <div className="product-list-empty">
        <p>No products available</p>
      </div>
    );
  }

  return (
    <div className="product-list-grid">
      {products.map(product => (
        <ProductCard 
          key={product.id} 
          product={product} 
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
};

export default ProductList;
