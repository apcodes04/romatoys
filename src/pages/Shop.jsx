import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { allProducts } from '../data/products';
import ProductCard from '../components/ProductCard';
import './Shop.css';

const Shop = () => {
  const location = useLocation();
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (location.state && location.state.category) {
      setFilter(location.state.category);
    }
  }, [location]);

  const filteredProducts = filter === 'all' 
    ? allProducts 
    : allProducts.filter(p => p.category === filter);

  return (
    <div className="shop-page">
      <div className="shop-header">
        <h1>Our Amazing Toys</h1>
        <p>Find the perfect ride for your little one!</p>
      </div>

      <div className="filter-container">
        <button className={`filter-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All</button>
        <button className={`filter-btn ${filter === 'car' ? 'active' : ''}`} onClick={() => setFilter('car')}>Cars</button>
        <button className={`filter-btn ${filter === 'jeep' ? 'active' : ''}`} onClick={() => setFilter('jeep')}>Jeeps</button>
        <button className={`filter-btn ${filter === 'bike' ? 'active' : ''}`} onClick={() => setFilter('bike')}>Bikes</button>
        <button className={`filter-btn ${filter === 'other' ? 'active' : ''}`} onClick={() => setFilter('other')}>Other Toys</button>
      </div>

      <div className="products-grid">
        {filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      
      {filteredProducts.length === 0 && (
        <div className="no-products">
          <h2>No products found in this category.</h2>
        </div>
      )}
    </div>
  );
};

export default Shop;
