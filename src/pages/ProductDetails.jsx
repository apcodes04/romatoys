import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { allProducts } from '../data/products';
import { companyInfo } from '../data/companyInfo';
import './ProductDetails.css';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = allProducts.find(p => p.id === id);

  if (!product) {
    return (
      <div className="product-not-found">
        <h2>Product not found</h2>
        <button onClick={() => navigate('/shop')} className="btn btn-primary">Back to Shop</button>
      </div>
    );
  }

  const handleBuyNow = () => {
    navigate('/checkout', { state: { product } });
  };

  return (
    <div className="product-details-container">
      <div className="product-details-content">
        <div className="product-image-section">
          <img src={product.image} alt={product.name} className="product-details-img" />
        </div>
        <div className="product-info-section">
          <h1 className="product-title-large">{product.name}</h1>
          <p className="product-price-large">₹{product.price.toLocaleString()}</p>
          <div className="product-description-box">
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>
          <div className="product-features">
            <h3>Key Features</h3>
            <ul>
              {product.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>
          <div className="action-buttons">
            <button onClick={handleBuyNow} className="btn btn-buy">Buy Now</button>
            <a 
              href={`https://wa.me/${companyInfo.contactNumbers[0].replace(/\D/g, '')}?text=Hi, I am interested in ${product.name} (ID: ${product.id}). Is it available?`}
              className="btn btn-whatsapp"
              target="_blank"
              rel="noopener noreferrer"
            >
              Enquire on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
