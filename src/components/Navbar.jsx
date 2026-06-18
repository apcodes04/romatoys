import React from 'react';
import { Link } from 'react-router-dom';
import { companyInfo } from '../data/companyInfo';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <img src="/images/brand/logo.jpg" alt="Roma Toys Logo" className="logo-image" />
          <span className="brand-name">Roma Toys</span>
        </Link>
        <div className="nav-menu-wrapper">
          <ul className="nav-menu">
            <li className="nav-item">
              <Link to="/" className="nav-links">Home</Link>
            </li>
            <li className="nav-item">
              <Link to="/shop" className="nav-links">Shop</Link>
            </li>
            <li className="nav-item">
              <Link to="/about" className="nav-links">About Us</Link>
            </li>
            <li className="nav-item">
              <Link to="/contact" className="nav-links">Contact</Link>
            </li>
            <li className="nav-item">
              <a 
                href={`https://wa.me/${companyInfo.contactNumbers[0].replace(/\D/g, '')}?text=Hi! I have an enquiry.`} 
                className="nav-links enquiry-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                Enquiry
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
