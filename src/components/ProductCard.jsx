import React from 'react';
import { Link } from 'react-router-dom';
import { optimizeImageUrl } from '../utils/optimizeImage';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

  return (
    <div className="product-card">
      <div className="product-image-container" style={{position: 'relative'}}>
        {product.isOutOfStock && <div className="public-badge-oos">Out of Stock</div>}
        {hasDiscount && !product.isOutOfStock && <div className="discount-badge" style={{position: 'absolute', top: '10px', right: '10px', background: '#ff4757', color: 'white', padding: '5px 10px', borderRadius: '5px', fontWeight: 'bold', zIndex: '2'}}>{discountPercent}% OFF</div>}
        {product.images && product.images.length > 1 ? (
          <div className="product-image-carousel">
            {product.images.map((img, i) => (
              <img key={i} src={optimizeImageUrl(img)} alt={`${product.name} ${i}`} className="product-image" loading="lazy" />
            ))}
          </div>
        ) : (
          <img src={optimizeImageUrl(product.image || (product.images && product.images[0]))} alt={product.name} className="product-image" loading="lazy" />
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
