import React, { useState } from 'react';
import '../_auth-shared.scss';
import ErrorModal from '../../utils/errors/ErrorModal';

const Register = () => {
  const [form, setForm] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    phone_number: '',
    role: 'user'
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch('http://localhost:8000/auth/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || "Erreur lors de l'inscription");
      }

      setSuccess(true);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <header className="auth-header">
          <h1>Inscription</h1>
          <p>Créez votre compte</p>
        </header>

        <form className="auth-form" onSubmit={handleSubmit}>

          <div className="input-group">
            <label>Nom d'utilisateur</label>
            <input
              type="text"
              name="username"
              required
              value={form.username}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              required
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label>Prénom</label>
            <input
              type="text"
              name="first_name"
              required
              value={form.first_name}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label>Nom</label>
            <input
              type="text"
              name="last_name"
              required
              value={form.last_name}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label>Mot de passe</label>
            <input
              type="password"
              name="password"
              required
              value={form.password}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label>Téléphone</label>
            <input
              type="text"
              name="phone_number"
              required
              value={form.phone_number}
              onChange={handleChange}
            />
          </div>

          <ErrorModal
            isOpen={!!error}
            message={error}
            onClose={() => setError(null)}
          />

          {success && <p className="success">Compte créé avec succès ✅</p>}

          <button type="submit" className="btn-primary">
            Créer le compte
          </button>
        </form>

        <footer className="auth-footer">
          <span>Déjà inscrit ?</span>
          <a href="/login">Se connecter</a>
        </footer>
      </div>
    </div>
  );
};

export default Register;