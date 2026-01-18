import React from 'react';
import { useNavigate } from 'react-router-dom';
import './NotFound.scss';
import Header from '../../components/utils/Header';
import Footer from '../../components/utils/Footer';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <>
    <Header/>
    <div className="error-container">
      <div className="error-content">
        <div className="error-code">404</div>
        <h1 className="error-title">Oups ! Page égarée.</h1>
        <p className="error-message">
          Il semble que le chemin que vous avez emprunté n'existe plus ou a été déplacé. 
          Pas de panique, on vous raccompagne.
        </p>
        
        <div className="error-actions">
          <button onClick={() => navigate('/')} className="btn-home">
            Retour à l'accueil
          </button>
          <button onClick={() => navigate(-1)} className="btn-back">
            Page précédente
          </button>
        </div>
      </div>
      
      {/* Élément décoratif fluide */}
      <div className="error-decoration">
        <div className="blob"></div>
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default NotFound;