import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { companyInfo } from '../data/companyInfo';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { SettingsContext } from '../context/SettingsContext';
import './Home.css';

const Home = () => {
  useDocumentTitle('Roma Toys | Best Battery Operated Toy Cars & Bikes in Mumbai');
  const { homeSettings } = useContext(SettingsContext);
  
  const images = homeSettings?.categoryImages || {
    car: '/images/products/car/2.jpg',
    jeep: '/images/products/jeep/RomaToys JEEP aug_page-0040.jpg',
    bike: '/images/products/bike/13.jpg',
    other: '/images/products/moretoys/1.png'
  };
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
            <img src={images.car} alt="Cars" loading="lazy" />
            <h3>Battery Operated Cars</h3>
          </Link>
          <Link to="/shop" className="category-card" state={{ category: 'jeep' }}>
            <img src={images.jeep} alt="Jeeps" loading="lazy" />
            <h3>Off-Road Jeeps</h3>
          </Link>
          <Link to="/shop" className="category-card" state={{ category: 'bike' }}>
            <img src={images.bike} alt="Bikes" loading="lazy" />
            <h3>Sporty Bikes</h3>
          </Link>
          <Link to="/shop" className="category-card" state={{ category: 'other' }}>
            <img src={images.other} alt="Other Toys" loading="lazy" />
            <h3>Other Fun Toys</h3>
          </Link>
        </div>
      </section>

      {/* Store Location & Gallery */}
      <section className="shop-images-section" style={{padding: '60px 20px', background: '#ffffff'}}>
        <h2>Visit Our Store in Mumbai</h2>
        <p style={{marginBottom: '30px', fontSize: '1.2rem', color: '#57606f'}}>{companyInfo.address}</p>
        
        <div className="location-container" style={{maxWidth: '1000px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '30px', alignItems: 'stretch'}}>
          {/* Map */}
          <div className="map-wrapper" style={{flex: '2 1 500px', display: 'flex', flexDirection: 'column', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 10px 20px rgba(0,0,0,0.1)'}}>
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3773.602860225355!2d72.83286187497399!3d18.948964882229667!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7ce24202fb2cd%3A0xbb7b9fb1e5949da!2sRoma%20Toys!5e0!3m2!1sen!2sin!4v1781876640347!5m2!1sen!2sin" 
              width="100%" 
              style={{flexGrow: 1, minHeight: '400px', border: 0, display: 'block'}} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Roma Toys Location"
            ></iframe>
            <div style={{background: '#ff4757', padding: '15px', textAlign: 'center'}}>
              <a 
                href="https://maps.app.goo.gl/ihEomRkzNQLcmhQb8" 
                target="_blank" 
                rel="noreferrer"
                style={{color: 'white', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.1rem', display: 'block'}}
              >
                📍 Get Directions to Store
              </a>
            </div>
          </div>

          {/* Shop Images */}
          <div className="shop-gallery" style={{flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '20px'}}>
            <img src="/images/shopimage/1.png" alt="Shop view 1" style={{width: '100%', height: '100%', objectFit: 'cover', borderRadius: '15px', boxShadow: '0 5px 15px rgba(0,0,0,0.08)'}} />
            <img src="/images/shopimage/3.png" alt="Shop view 3" style={{width: '100%', height: '100%', objectFit: 'cover', borderRadius: '15px', boxShadow: '0 5px 15px rgba(0,0,0,0.08)'}} />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
