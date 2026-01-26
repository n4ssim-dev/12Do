import React, { useState, useEffect } from 'react';
import { parseFastApiErrors } from '../../utils/fastApiErrors';

import './Modal.scss';

const TODO_THEMES = [
    'Travail',
    'Personnel',
    'Santé',
    'Études',
    'Maison',
    'Finances',
    'Urgent',
];

const EditTodoModal = ({ isOpen, onClose, onSubmit, todo }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        theme: TODO_THEMES[0],
    });

    const [errors, setErrors] = useState({});
    const [apiError, setApiError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (todo) {
            setFormData({
                title: todo.title || '',
                description: todo.description || '',
                theme: todo.theme || TODO_THEMES[0],
            });
            setErrors({});
            setApiError(null);
        }
    }, [todo]);

    if (!isOpen || !todo) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: null }));
        setApiError(null);
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Le titre est obligatoire';
        }

        if (formData.title.length > 100) {
            newErrors.title = 'Le titre est trop long';
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setIsSubmitting(true);
        setErrors({});
        setApiError(null);

        try {
            await onSubmit({
                ...todo,
                ...formData,
            });
            onClose();
        } catch (err) {
            // onSubmit doit throw en cas d'erreur API
            if (err?.detail) {
                setErrors(parseFastApiErrors(err.detail));
            } else {
                setApiError('Erreur lors de la mise à jour');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>Modifier la tâche</h2>

                {apiError && <div className="error-banner">{apiError}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Titre</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                        />
                        {errors.title && (
                            <span className="error error-msg">{errors.title}</span>
                        )}
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                        />
                        {errors.description && (
                            <span className="error error-msg">{errors.description}</span>
                        )}
                    </div>

                    <div className="form-group">
                        <label>Thème</label>
                        <select
                            name="theme"
                            value={formData.theme}
                            onChange={handleChange}
                        >
                            {TODO_THEMES.map(t => (
                                <option key={t} value={t}>
                                    {t}
                                </option>
                            ))}
                        </select>
                        {errors.theme && (
                            <span className="error error-msg">{errors.theme}</span>
                        )}
                    </div>

                    <div className="modal-actions">
                        <button
                            type="button"
                            className="btn-secondary"
                            onClick={onClose}
                            disabled={isSubmitting}
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditTodoModal;
