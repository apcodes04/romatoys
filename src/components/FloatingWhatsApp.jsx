import React from 'react';
import './FloatingWhatsApp.css';

const FloatingWhatsApp = () => {
  return (
    <a
      href="https://wa.me/917978823397"
      className="whatsapp-float"
      target="_blank"
      rel="noopener noreferrer"
    >
      <img 
        src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" 
        alt="WhatsApp" 
        className="whatsapp-icon" 
      />
    </a>
  );
};

export default FloatingWhatsApp;
