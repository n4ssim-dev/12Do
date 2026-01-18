import React from 'react';
import './About.scss';

const About = () => {
  return (
    <div className="about-page">
      {/* Hero Section Simplifiée */}
      <section className="about-hero">
        <h1>Nous redéfinissons la simplicité.</h1>
        <p>Pulse est né d'une idée simple : la technologie doit s'effacer au profit de la créativité.</p>
      </section>

      {/* Section Mission */}
      <section className="about-mission">
        <div className="mission-content">
          <span className="badge">Notre Mission</span>
          <h2>Donner du pouvoir aux visionnaires.</h2>
          <p>
            Depuis 2024, nous construisons des outils intuitifs pour ceux qui refusent 
            le statu quo. Notre équipe est passionnée par le design, la performance 
            et l'expérience utilisateur.
          </p>
        </div>
        <div className="mission-stats">
          <div className="stat-card">
            <h3>10k+</h3>
            <p>Utilisateurs actifs</p>
          </div>
          <div className="stat-card">
            <h3>99.9%</h3>
            <p>Uptime serveur</p>
          </div>
        </div>
      </section>

      {/* Section Valeurs */}
      <section className="about-values">
        <h2>Nos valeurs fondamentales</h2>
        <div className="values-grid">
          <div className="value-item">
            <div className="value-icon">✦</div>
            <h3>Intégrité</h3>
            <p>La transparence est au cœur de chaque ligne de code que nous écrivons.</p>
          </div>
          <div className="value-item">
            <div className="value-icon">⚡</div>
            <h3>Vitesse</h3>
            <p>Parce que votre temps est la ressource la plus précieuse.</p>
          </div>
          <div className="value-item">
            <div className="value-icon">🎨</div>
            <h3>Design</h3>
            <p>Nous croyons qu'un bel outil rend le travail plus agréable.</p>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="about-cta">
        <div className="cta-box">
          <h2>Prêt à voir la différence ?</h2>
          <a href="/register" className="btn-primary">Rejoindre l'aventure</a>
        </div>
      </section>
    </div>
  );
};

export default About;