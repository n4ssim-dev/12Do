import React, { useState, useEffect } from 'react';
import './Modal.scss';

const EditTodoModal = ({ isOpen, onClose, onSubmit, todo }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        if (todo) {
            setTitle(todo.title || '');
            setDescription(todo.description || '');
        }
    }, [todo]);

    if (!isOpen || !todo) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            ...todo,
            title,
            description,
        });
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>Modifier la tâche</h2>

                <form onSubmit={handleSubmit}>
                    <label>
                        Titre
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </label>

                    <label>
                        Description
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </label>

                    <div className="modal-actions">
                        <button
                            type="button"
                            className="btn-secondary"
                            onClick={onClose}
                        >
                            Annuler
                        </button>
                        <button type="submit" className="btn-primary">
                            Enregistrer
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditTodoModal;
