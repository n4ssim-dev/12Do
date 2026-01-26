import React, { useState } from 'react';
import './Modal.scss';

const DeleteTodoModal = ({ isOpen, onClose, onConfirm, todo }) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState(null);

    if (!isOpen || !todo) return null;

    const handleConfirm = async () => {
        setIsDeleting(true);
        setError(null);

        try {
            await onConfirm(todo.id);
            onClose();
        } catch {
            setError("Impossible de supprimer la tâche");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>Supprimer la tâche</h2>

                <p>
                    Supprimer <strong>{todo.title}</strong> ?
                </p>

                {error && <div className="error-banner">{error}</div>}

                <div className="modal-actions">
                    <button onClick={onClose} disabled={isDeleting}>
                        Annuler
                    </button>
                    <button
                        className="btn-danger"
                        onClick={handleConfirm}
                        disabled={isDeleting}
                    >
                        {isDeleting ? 'Suppression...' : 'Supprimer'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteTodoModal;
