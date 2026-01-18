import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../AuthContext'; 
import './TodoTable.scss';
import AddTodo from '../modals/AddTodo';

const TodoTable = () => {
    const { user, loading: authLoading } = useAuth(); 
    const [todos, setTodos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    /**
     * 1. Fonction de chargement des données (stable via useCallback)
     * On l'utilise au montage et après chaque ajout réussi.
     */
    const fetchTodos = useCallback(async () => {
        if (!user?.token) {
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('http://localhost:8000/todos', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) throw new Error(`Erreur serveur: ${response.status}`);
            const data = await response.json();
            
            // On s'assure que data est bien un tableau
            setTodos(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [user]);

    /**
     * 2. Chargement initial
     */
    useEffect(() => {
        if (!authLoading) {
            fetchTodos();
        }
    }, [authLoading, fetchTodos]);

    /**
     * 3. Action après soumission de la modale
     * On refresh les données depuis le serveur pour garantir la synchronisation
     */
    const handleAddTodoSuccess = () => {
        fetchTodos(); // Re-fetch au lieu de juste mettre à jour l'état local
    };

    if (authLoading || loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p className="loading-text">Chargement de votre espace...</p>
            </div>
        );
    }

    /**
     * 4. Calcul des statistiques SÉCURISÉ
     * Ajout de vérifications (t && ...) pour éviter le crash si un élément est null
     */
    const stats = {
        total: todos ? todos.length : 0,
        completed: todos ? todos.filter(t => t && t.complete).length : 0,
        pending: todos ? todos.filter(t => t && !t.complete).length : 0
    };

    return (
        <div className="todo-container">
            <div className="todo-wrapper">
                
                {/* Header Moderne */}
                <header className="todo-header">
                    <div className="header-content">
                        <div>
                            <h1>Tableau de bord</h1>
                            <div className="status-text">
                                <span className="status-indicator"></span>
                                Bienvenue, {user?.username || 'Utilisateur'}
                            </div>
                        </div>
                        <button className="btn-add" onClick={() => setIsModalOpen(true)}>
                            <span>+</span> Nouvelle tâche
                        </button>
                    </div>
                </header>

                {/* Grille de Statistiques */}
                <div className="stats-grid">
                    <div className="stat-card stat-total">
                        <div className="stat-content">
                            <div className="stat-info">
                                <p className="stat-label">Total</p>
                                <p className="stat-value">{stats.total}</p>
                            </div>
                            <div className="stat-icon">📋</div>
                        </div>
                    </div>
                    <div className="stat-card stat-completed">
                        <div className="stat-content">
                            <div className="stat-info">
                                <p className="stat-label">Terminées</p>
                                <p className="stat-value">{stats.completed}</p>
                            </div>
                            <div className="stat-icon">✅</div>
                        </div>
                    </div>
                    <div className="stat-card stat-pending">
                        <div className="stat-content">
                            <div className="stat-info">
                                <p className="stat-label">En cours</p>
                                <p className="stat-value">{stats.pending}</p>
                            </div>
                            <div className="stat-icon">⏳</div>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="error-banner">
                        <span>⚠️ {error}</span>
                        <button className="error-close" onClick={() => setError(null)}>×</button>
                    </div>
                )}

                {/* Table Section */}
                <div className="todo-table-wrapper">
                    <table className="todo-table">
                        <thead>
                            <tr>
                                <th>État</th>
                                <th>Tâche</th>
                                <th>Priorité</th>
                                <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                          {todos && todos.length > 0 ? (
                            todos.map((todo, index) => {
                              if (!todo) return null; // Sécurité supplémentaire

                              const rawPriority = String(todo.priority || '').toLowerCase();
                              let priorityClass = 'low';
                              if (rawPriority === '3' || rawPriority === '4' || rawPriority === '5' || rawPriority.includes('haut')) {
                                priorityClass = 'high';
                              } else if (rawPriority === '2' || rawPriority.includes('moyen')) {
                                priorityClass = 'medium';
                              }

                              return (
                                <tr key={todo.id || `todo-${index}`}>
                                  <td data-label="État" style={{ width: '80px' }}>
                                    <button className={`todo-status-btn ${todo.complete ? 'completed' : 'pending'}`}>
                                      {todo.complete ? '✔' : '○'}
                                    </button>
                                  </td>

                                  <td data-label="Tâche">
                                    <div className={`todo-title ${todo.complete ? 'completed' : ''}`}>
                                      {todo.title}
                                    </div>
                                    <div className={`todo-description ${todo.complete ? 'completed' : ''}`}>
                                      {todo.description}
                                    </div>
                                  </td>

                                  <td data-label="Priorité">
                                    <span className={`todo-priority priority-${priorityClass}`}>
                                      Prio: {todo.priority}
                                    </span>
                                  </td>

                                  <td data-label="Actions" className="todo-actions">
                                    <button className="btn-edit" title="Modifier">✎</button>
                                    <button className="btn-delete" title="Supprimer">🗑</button>
                                  </td>
                                </tr>
                              );
                            })
                          ) : (
                            <tr>
                              <td colSpan="4">
                                <div className="todo-empty-state">
                                  <p className="empty-title">Aucune tâche trouvée</p>
                                </div>
                              </td>
                            </tr>
                          )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modale d'ajout */}
            <AddTodo
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onSubmit={handleAddTodoSuccess} 
                userToken={user?.token}
            />
        </div>
    );
};

export default TodoTable;