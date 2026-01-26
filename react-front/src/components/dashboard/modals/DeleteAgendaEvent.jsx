import React from 'react';
import { useAuth } from '../../../AuthContext';
import './AgendaModal.scss';

const DeleteAgendaEvent = ({ event, isOpen, onClose, onConfirm }) => {
    const { user } = useAuth();

    if (!isOpen || !event) return null;

    return (
        <div className="agenda-modal-backdrop">
            <div className="agenda-modal">
                <h3>Supprimer l’événement</h3>

                <p>
                    Voulez-vous vraiment supprimer
                    <strong> “{event.title}”</strong> ?
                </p>

                <div className="modal-actions">
                    <button onClick={onClose}>Annuler</button>
                    <button
                        className="btn-danger"
                        onClick={() => onConfirm(event.id)}
                    >
                        Supprimer
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteAgendaEvent;
