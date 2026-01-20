import React from 'react';
import './ErrorModal.scss';

const ErrorModal = ({ isOpen, message, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="error-modal-backdrop" onClick={onClose}>
      <div
        className="error-modal"
        onClick={(e) => e.stopPropagation()}
        role="alertdialog"
        aria-modal="true"
      >
        <header className="error-modal-header">
          <h2>Une erreur est survenue</h2>

          <button
            className="error-modal-close"
            onClick={onClose}
            aria-label="Fermer"
            type="button"
          >
            ✕
          </button>
        </header>

        <div className="error-modal-content">
          <p>{message}</p>
        </div>

        <footer className="error-modal-footer">
          <button
            className="error-modal-button"
            onClick={onClose}
            type="button"
          >
            J’ai compris
          </button>
        </footer>
      </div>
    </div>
  );
};

export default ErrorModal;
