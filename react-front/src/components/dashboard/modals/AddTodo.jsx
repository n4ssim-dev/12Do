import React, { useState } from 'react';
import './AddTodo.scss';

const AddTodo = ({ isOpen, onClose, onSubmit, userToken }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: 'Moyen'
    });
    const [issubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch('http://localhost:8000/todos/todo', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${userToken}`,
                    'Content-Type': 'application/json',
                },
                // On s'assure que les clés correspondent au TodoRequest de FastAPI
                body: JSON.stringify({
                    title: formData.title,
                    description: formData.description,
                    priority: formData.priority,
                    complete: false
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.log("Détails de l'erreur 422:", errorData);
                throw new Error(JSON.stringify(errorData.detail));
            }
            
            // Le backend renvoie maintenant le todo_model complet (avec son ID)
            const createdTodo = await response.json();
            
            onSubmit(createdTodo); // On envoie l'objet complet au parent
            setFormData({ title: '', description: '', priority: 'Moyen' });
            onClose();
        } catch (err) {
            alert(`Erreur: ${err.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Nouvelle Tâche</h2>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>
                
                <form onSubmit={handleSubmit} className="todo-form">
                    <div className="form-group">
                        <label>Titre</label>
                        <input 
                            type="text" 
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Qu'avez-vous à faire ?"
                            required 
                        />
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea 
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Détails supplémentaires..."
                            rows="3"
                        />
                    </div>

                    <div className="form-group">
                        <label>Priorité (1 à 5)</label>
                        <select 
                            name="priority" 
                            value={formData.priority} 
                            onChange={handleChange}
                        >
                            <option value="1">1 - Très Bas (Bas)</option>
                            <option value="2">2 - Bas</option>
                            <option value="3">3 - Moyen</option>
                            <option value="4">4 - Haut</option>
                            <option value="5">5 - Urgent (Haut)</option>
                        </select>
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn-cancel" onClick={onClose}>Annuler</button>
                        <button type="submit" className="btn-submit" disabled={issubmitting}>
                            {issubmitting ? 'Création...' : 'Ajouter la tâche'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddTodo;