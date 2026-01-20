import React from 'react';
import './Modal.scss';

const DeleteTodoModal = ({ isOpen, onClose, onConfirm, todo }) => {
    if (!isOpen || !todo) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>Supprimer la tâche</h2>
                <p>
                    Êtes-vous sûr de vouloir supprimer la tâche :
                    <strong> {todo.title}</strong> ?
                </p>

                <div className="modal-actions">
                    <button className="btn-secondary" onClick={onClose}>
                        Annuler
                    </button>
                    <button
                        className="btn-danger"
                        onClick={() => onConfirm(todo.id)}
                    >
                        Supprimer
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteTodoModal;
