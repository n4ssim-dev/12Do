import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../AuthContext'
import './AgendaModal.scss';

const AddAgendaEvent = ({ isOpen, onClose, onSuccess }) => {
    const { user } = useAuth();

    const [todos, setTodos] = useState([]);
    const [form, setForm] = useState({
        todo_id: '',
        start_date: '',
        end_date: '',
        all_day: false,
        color: '#4f46e5',
        notes: '',
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!isOpen || !user?.token) return;

        fetch('http://localhost:8000/todos', {
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
        })
            .then(res => res.json())
            .then(data => setTodos(Array.isArray(data) ? data : []));
    }, [isOpen, user]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!form.todo_id || !form.start_date || !form.end_date) {
            setError('Veuillez remplir tous les champs obligatoires.');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('http://localhost:8000/agenda', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${user.token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(form),
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la création de l’événement');
            }

            onSuccess();
            onClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="agenda-modal-backdrop">
            <div className="agenda-modal">
                <h3>Nouvel événement</h3>

                {error && <div className="modal-error">⚠️ {error}</div>}

                <form onSubmit={handleSubmit}>
                    <label>
                        Tâche liée
                        <select name="todo_id" value={form.todo_id} onChange={handleChange} required>
                            <option value="">— Sélectionner —</option>
                            {todos.map(todo => (
                                <option key={todo.id} value={todo.id}>
                                    {todo.title}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label>
                        Début
                        <input
                            type="datetime-local"
                            name="start_date"
                            value={form.start_date}
                            onChange={handleChange}
                            required
                        />
                    </label>

                    <label>
                        Fin
                        <input
                            type="datetime-local"
                            name="end_date"
                            value={form.end_date}
                            onChange={handleChange}
                            required
                        />
                    </label>

                    <label className="checkbox">
                        <input
                            type="checkbox"
                            name="all_day"
                            checked={form.all_day}
                            onChange={handleChange}
                        />
                        Journée entière
                    </label>

                    <label>
                        Couleur
                        <input
                            type="color"
                            name="color"
                            value={form.color}
                            onChange={handleChange}
                        />
                    </label>

                    <label>
                        Notes
                        <textarea
                            name="notes"
                            value={form.notes}
                            onChange={handleChange}
                        />
                    </label>

                    <div className="modal-actions">
                        <button type="button" onClick={onClose}>
                            Annuler
                        </button>
                        <button type="submit" disabled={loading}>
                            {loading ? 'Création…' : 'Créer'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddAgendaEvent;
