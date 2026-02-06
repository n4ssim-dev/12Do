import React, { useState } from 'react';
import { Link } from 'react-router-dom'
import '../_auth-shared.scss';
import { useAuth } from '../../../AuthContext';
import ErrorModal from "../../utils/errors/ErrorModal"

const Login = () => {
  const { login } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:8000/auth/google/login';
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);

    try {
      const response = await fetch('http://localhost:8000/auth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });

      if (!response.ok) {
        throw new Error('Nom d’utilisateur ou mot de passe incorrect');
      }

      const data = await response.json();

      login(data.access_token);
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err.message);
    }
  };

  // ... (imports inchangés)

  return (
    <div className="auth-container">
      <div className="auth-card">
        <header className="auth-header">
          <h1>Connexion</h1>
          <p>Heureux de vous revoir !</p>
        </header>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Nom d'utilisateur</label>
            <input
              type="text"
              placeholder="Ex: jean.dupont"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Mot de passe</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-primary">Se connecter</button>

          <div className="oauth-divider">
            <span>ou</span>
          </div>

          <div className="oauth-section">
            <button
              type="button"
              className="btn-google"
              onClick={handleGoogleLogin}
            >
              <svg className="google-icon" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.02 1.53 7.4 2.81l5.47-5.47C33.6 3.89 29.27 2 24 2 14.9 2 7.17 7.43 3.56 15.29l6.67 5.18C11.94 14.36 17.52 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.5 24c0-1.64-.15-3.22-.43-4.74H24v9.01h12.7c-.55 2.95-2.22 5.45-4.7 7.12l7.18 5.58C43.27 37.18 46.5 31.05 46.5 24z"/>
                <path fill="#FBBC05" d="M10.23 28.47c-.48-1.45-.75-2.99-.75-4.47s.27-3.02.75-4.47l-6.67-5.18C1.56 17.6 0 20.7 0 24s1.56 6.4 3.56 9.65l6.67-5.18z"/>
                <path fill="#34A853" d="M24 46c6.27 0 11.54-2.07 15.38-5.63l-7.18-5.58c-2 1.34-4.56 2.13-8.2 2.13-6.48 0-12.06-4.36-14.02-10.29l-6.67 5.18C7.17 40.57 14.9 46 24 46z"/>
              </svg>
              <span>Continuer avec Google</span>
            </button>
          </div>
        </form>

        <footer className="auth-footer">
          <p>Pas encore de compte ? <Link to="/register">S’inscrire</Link></p>
        </footer>
      </div>

      <ErrorModal isOpen={!!error} message={error} onClose={() => setError(null)} />
    </div>
  );
};

export default Login;