import React from 'react';
import { Link } from 'react-router-dom';
import { companyInfo } from '../data/companyInfo';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-links">
        <div className="footer-link-wrapper">
          <div className="footer-link-items">
            <h2>About Us</h2>
            <p>{companyInfo.name} - Est. {companyInfo.yearOfEstablishment}</p>
            <p>GSTIN: {companyInfo.gstin}</p>
          </div>
          <div className="footer-link-items">
            <h2>Contact Us</h2>
            <p>{companyInfo.address}</p>
            <p>{companyInfo.contactNumbers[0]}</p>
            <p>{companyInfo.contactNumbers[1]}</p>
          </div>
        </div>
        <div className="footer-link-wrapper">
          <div className="footer-link-items">
            <h2>Payment Modes</h2>
            <ul>
              {companyInfo.paymentModes.map((mode, index) => (
                <li key={index}>{mode}</li>
              ))}
            </ul>
          </div>
          <div className="footer-link-items">
            <h2>Social Media</h2>
            <a href={companyInfo.instagram} target="_blank" rel="noreferrer">Instagram</a>
            <Link to="/admin/login" style={{color: '#fff', textDecoration: 'none', marginTop: '10px', fontSize: '0.9rem', opacity: '0.7'}}>Admin Login</Link>
          </div>
        </div>
      </div>
      <section className="social-media">
        <div className="social-media-wrap">
          <div className="footer-logo">
            <span className="social-logo">Roma Toys</span>
          </div>
          <small className="website-rights">Roma Toys © {new Date().getFullYear()}</small>
        </div>
      </section>
    </footer>
  );
};

export default Footer;
