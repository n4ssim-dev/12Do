import React from 'react';
import './Footer.scss';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <div className="logo">
            <div>
              <img 
                className="logo-icon" 
                src='https://i.ibb.co/RGBN1p5R/Gemini-Generated-Image-lfu970lfu970lfu9.png' 
                alt="Logo"
              />
            </div>
            <span>12Do</span>
          </div>
          <p>La gestion de tâches simplifié.</p>
        </div>

      </div>
      
      <div className="footer-bottom">
        <p>&copy; 2026 12Do. Tous droits réservés.</p>
      </div>
    </footer>
  );
};

export default Footer;