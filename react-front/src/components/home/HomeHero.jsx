import React from 'react';
import './HomeHero.scss';

const Hero = () => {
  return (
    <section className="hero-section">
      <div className="hero-content">
        <h1 className="hero-title">
          Débloquez votre potentiel. <br/> Commencez dès aujourd'hui.
        </h1>
        <p className="hero-description">
          Rejoignez des milliers d'utilisateurs et transformez la façon dont vous travaillez. Simplicité, puissance et innovation à portée de main.
        </p>
        <div className="hero-cta">
          <a href="/register" className="btn-primary-hero">
            Créer un compte gratuit
          </a>
          {/* Optionnel: un deuxième CTA pour "En savoir plus" ou une démo */}
          <a href="#features" className="btn-secondary-hero">
            En savoir plus
          </a>
        </div>
        <p className="hero-small-text">
          Aucune carte de crédit requise. Annulez à tout moment.
        </p>
      </div>
      <div className="hero-image-container">
        {/* Ici, tu peux insérer une image ou une illustration SVG */}
        <img src='https://i.ibb.co/hRQ9fVbf/dashboard-illustration.png'/>
      </div>
    </section>
  );
};

export default Hero;