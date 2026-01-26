import React from 'react';
import './HomeHero.scss';

const Hero = () => {
  return (
    <section className="hero-section">
      <div className="hero-content">
        <h1 className="hero-title">
          Créér, Organiser, Trier <br />
        </h1>
        <p className="hero-description">
          12Do vous offre une solution de gestion de tâches dans le temps à l'aide d'un tableau de bord et d'un agenda intelligent.
        </p>
        <div className="hero-cta">
          <a href="/register" className="btn-primary-hero">
            Créer un compte gratuit
          </a>
          <a href="#features" className="btn-secondary-hero">
            En savoir plus
          </a>
        </div>
        <p className="hero-small-text">
          Aucune carte de crédit requise. Annulez à tout moment.
        </p>
      </div>
      <div className="hero-image-container">
        <img
          src="https://i.ibb.co/hRQ9fVbf/dashboard-illustration.png"
          alt="Tableau de bord illustration"
          loading="lazy"
        />
      </div>
    </section>
  );
};

export default Hero;
