import React from 'react';
import { Link } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const displayImage = product.images && product.images.length > 0 ? product.images[0] : product.image;
  
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

  return (
    <div className="product-card">
      <div className="product-image-container" style={{position: 'relative'}}>
        {product.isOutOfStock && <div className="public-badge-oos">Out of Stock</div>}
        {hasDiscount && !product.isOutOfStock && <div className="discount-badge" style={{position: 'absolute', top: '10px', right: '10px', background: '#ff4757', color: 'white', padding: '5px 10px', borderRadius: '5px', fontWeight: 'bold', zIndex: '2'}}>{discountPercent}% OFF</div>}
        {(product.images && product.images.length > 0) ? (
          <div className="product-image-carousel">
            {product.images.map((img, i) => (
              <img key={i} src={img} alt={`${product.name} ${i}`} className="product-image" />
            ))}
          </div>
        ) : (
          <img src={product.image} alt={product.name} className="product-image" />
        )}
      </div>
      <div className="product-info">
        <h3 className="product-title">{product.name}</h3>
        <p className="category" style={{textTransform: 'capitalize', color: '#747d8c', fontSize: '0.9rem', marginBottom: '10px', marginTop: '0'}}>{product.category}</p>
        <div className="price-container" style={{display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px'}}>
          <p className="product-price" style={{margin: '0', fontSize: '1.3rem', fontWeight: 'bold', color: '#2ed573'}}>₹{product.price.toLocaleString()}</p>
          {hasDiscount && (
            <p className="original-price" style={{textDecoration: 'line-through', color: '#a4b0be', margin: '0', fontSize: '1rem'}}>
              ₹{product.originalPrice.toLocaleString()}
            </p>
          )}
        </div>
        <Link to={`/product/${product.id}`} className="view-details-btn">
          {product.isOutOfStock ? 'View Details' : 'Buy Now'}
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
