import React from 'react';
import './ProductCard.css';

const ProductCard = ({ product, onAddToCart }) => {
  const handleAddToCart = () => {
    if (onAddToCart && product.inStock) {
      onAddToCart(product.id, 1);
    }
  };

  return (
    <div className="product-card">
      <div className="product-image">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.description} />
        ) : (
          <div className="no-image">No Image</div>
        )}
      </div>
      
      <div className="product-info">
        <h3 className="product-name">{product.description}</h3>
        <p className="product-code">{product.itemCode}</p>
        
        <div className="product-meta">
          <span className="product-category">{product.category}</span>
          <span className="product-uom">{product.uom}</span>
        </div>
        
        <div className="product-footer">
          <div className="product-price">
            <span className="currency">$</span>
            <span className="amount">{product.price.toFixed(2)}</span>
          </div>
          
          <div className="product-stock">
            {product.inStock ? (
              <span className="in-stock">✓ In Stock ({product.availableStock})</span>
            ) : (
              <span className="out-of-stock">✗ Out of Stock</span>
            )}
          </div>
        </div>
        
        <button 
          className="add-to-cart-btn"
          onClick={handleAddToCart}
          disabled={!product.inStock}
        >
          {product.inStock ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
