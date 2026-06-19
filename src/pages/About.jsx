import React from 'react';
import { companyInfo } from '../data/companyInfo';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import './About.css';

const About = () => {
  useDocumentTitle('About Us | Roma Toys Mumbai');
  return (
    <div className="about-container">
      <div className="about-header">
        <h1>About Roma Toys</h1>
        <p>Your one-stop destination for the best toys in Mumbai</p>
      </div>

      <div className="about-content">
        <div className="owner-section">
          <img src="/images/about us/owner.jpg" alt={companyInfo.proprietor} className="owner-image" />
          <div className="owner-info">
            <h2>{companyInfo.proprietor}</h2>
            <p className="owner-title">Proprietor</p>
            <p>Dedicated to bringing joy to children with the highest quality toys and exceptional customer service.</p>
          </div>
        </div>

        <div className="about-text-section">
          <h2>Our Story</h2>
          <p>{companyInfo.aboutText}</p>
          <div className="stats-grid">
            <div className="stat-box">
              <h3>{companyInfo.yearOfEstablishment}</h3>
              <p>Established</p>
            </div>
            <div className="stat-box">
              <h3>Crawford Market</h3>
              <p>Location</p>
            </div>
            <div className="stat-box">
              <h3>1000+</h3>
              <p>Happy Kids</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
