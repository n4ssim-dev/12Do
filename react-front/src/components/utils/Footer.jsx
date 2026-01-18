import React from 'react';
import './Footer.scss';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <div className="logo">
            <div className="logo-icon"></div>
            <span>Pulse</span>
          </div>
          <p>La plateforme nouvelle génération pour les créatifs audacieux.</p>
        </div>

        <div className="footer-grid">
          <div className="footer-column">
            <h4>Produit</h4>
            <a href="#">Télécharger</a>
            <a href="#">Documentation</a>
            <a href="#">Mises à jour</a>
          </div>
          <div className="footer-column">
            <h4>Société</h4>
            <a href="#">Carrières</a>
            <a href="#">Blog</a>
            <a href="#">Contact</a>
          </div>
          <div className="footer-column">
            <h4>Légal</h4>
            <a href="#">Confidentialité</a>
            <a href="#">CGU</a>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; 2024 Pulse Inc. Tous droits réservés.</p>
      </div>
    </footer>
  );
};

export default Footer;