import React from 'react';
import { companyInfo } from '../data/companyInfo';
import './Contact.css';

const Contact = () => {
  return (
    <div className="contact-container">
      <div className="contact-header">
        <h1>Contact Us</h1>
        <p>We'd love to hear from you!</p>
      </div>

      <div className="contact-content">
        <div className="contact-info">
          <div className="info-card">
            <i className="fas fa-map-marker-alt"></i>
            <h3>Visit Us</h3>
            <p>{companyInfo.address}</p>
          </div>
          
          <div className="info-card">
            <i className="fas fa-phone-alt"></i>
            <h3>Call Us</h3>
            <p>{companyInfo.contactNumbers[0]}</p>
            <p>{companyInfo.contactNumbers[1]}</p>
          </div>

          <div className="info-card">
            <i className="fab fa-instagram"></i>
            <h3>Follow Us</h3>
            <a href={companyInfo.instagram} target="_blank" rel="noreferrer" className="insta-link">@romatoysmumbai</a>
          </div>
        </div>

        <div className="contact-form-section">
          <h2>Send us a Message</h2>
          <form className="contact-form" onSubmit={(e) => { e.preventDefault(); alert('Message sent!'); }}>
            <div className="form-group">
              <input type="text" placeholder="Your Name" required />
            </div>
            <div className="form-group">
              <input type="email" placeholder="Your Email" required />
            </div>
            <div className="form-group">
              <input type="text" placeholder="Subject" required />
            </div>
            <div className="form-group">
              <textarea placeholder="Your Message" rows="5" required></textarea>
            </div>
            <button type="submit" className="btn btn-primary">Send Message</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
