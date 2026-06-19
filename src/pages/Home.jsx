import React from 'react';
import { Link } from 'react-router-dom';
import { companyInfo } from '../data/companyInfo';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import './Home.css';

const Home = () => {
  useDocumentTitle('Roma Toys | Best Battery Operated Toy Cars & Bikes in Mumbai');
  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Welcome to {companyInfo.name}!</h1>
          <p>The ultimate destination for the coolest toy cars, jeeps, and bikes.</p>
          <div className="hero-btns">
            <Link to="/shop" className="btn btn-primary">Shop Now</Link>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="categories-section">
        <h2>Our Categories</h2>
        <div className="categories-grid">
          <Link to="/shop" className="category-card" state={{ category: 'car' }}>
            <img src="/images/products/car/2.jpg" alt="Cars" loading="lazy" />
            <h3>Battery Operated Cars</h3>
          </Link>
          <Link to="/shop" className="category-card" state={{ category: 'jeep' }}>
            <img src="/images/products/jeep/RomaToys JEEP aug_page-0040.jpg" alt="Jeeps" loading="lazy" />
            <h3>Off-Road Jeeps</h3>
          </Link>
          <Link to="/shop" className="category-card" state={{ category: 'bike' }}>
            <img src="/images/products/bike/13.jpg" alt="Bikes" loading="lazy" />
            <h3>Sporty Bikes</h3>
          </Link>
          <Link to="/shop" className="category-card" state={{ category: 'other' }}>
            <img src="/images/products/moretoys/1.png" alt="Other Toys" loading="lazy" />
            <h3>Other Fun Toys</h3>
          </Link>
        </div>
      </section>

      {/* Shop Images */}
      <section className="shop-images-section">
        <h2>Visit Our Store in Mumbai</h2>
        <p>{companyInfo.address}</p>
        <div className="shop-gallery">
          <img src="/images/shopimage/1.png" alt="Shop view 1" />
          <img src="/images/shopimage/2.png" alt="Shop view 2" />
          <img src="/images/shopimage/3.png" alt="Shop view 3" />
        </div>
      </section>
    </div>
  );
};

export default Home;
