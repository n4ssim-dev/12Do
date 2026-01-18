import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext'
import './Header.scss';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth(); // Récup de l'état global
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/'); // Redirection vers l'accueil après déconnexion
  };

  return (
    <nav className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="header-container">
        <Link to="/">
          <div className="logo">
            <img 
              className="logo-icon" 
              src='https://i.ibb.co/RGBN1p5R/Gemini-Generated-Image-lfu970lfu970lfu9.png' 
              alt="Logo"
            />
          </div>
        </Link>
        
        <ul className="nav-links">
          {/* Liens visibles par tout le monde */}
          <li><a href="#features">Fonctionnalités</a></li>
          <li><a href="#pricing">Tarifs</a></li>
          
          {/* Lien Dashboard visible uniquement si connecté */}
          {user && (
            <li><Link to="/dashboard">Tableau de bord</Link></li>
          )}
        </ul>

        <div className="header-actions">
          {user ? (
            /* État : CONNECTÉ */
            <>
              <span className="user-welcome">Salut, <strong>{user.username}</strong></span>
              <button onClick={handleLogout} className="btn-logout">
                Déconnexion
              </button>
            </>
          ) : (
            /* État : DÉCONNECTÉ */
            <>
              <Link to="/login" className="btn-login">Connexion</Link>
              <Link to="/register" className="btn-signup">Essai gratuit</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;