import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../AuthContext'; 
import './TodoTable.scss';
import AddTodo from '../modals/AddTodo';
import EditTodoModal from './EditTodoModal';
import DeleteTodoModal from './DeleteTodoModal';

const TodoTable = () => {
    const { user, loading: authLoading } = useAuth(); 
    const [todos, setTodos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTodo, setSelectedTodo] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [priorityOrder, setPriorityOrder] = useState(null); // 'asc' | 'desc' | null
    const [hideCompleted, setHideCompleted] = useState(false);


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

    const toggleTodoStatus = async (todo) => {
        try {
            const response = await fetch(`http://localhost:8000/todos/todo/${todo.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...todo,
                    complete: !todo.complete,
                }),
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la mise à jour du statut');
            }

            fetchTodos(); // sync avec le backend
        } catch (err) {
            setError(err.message);
        }
    };

    const deleteTodo = async (todoId) => {
        try {
            const response = await fetch(
                `http://localhost:8000/todos/todo/${todoId}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${user.token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error('Erreur lors de la suppression');
            }

            fetchTodos();
            setIsDeleteModalOpen(false);
            setSelectedTodo(null);
        } catch (err) {
            setError(err.message);
        }
    };


    const editTodo = async (updatedTodo) => {
        try {
            const response = await fetch(
                `http://localhost:8000/todos/todo/${updatedTodo.id}`,
                {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${user.token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updatedTodo),
                }
            );

            if (!response.ok) {
                throw new Error('Erreur lors de la modification');
            }

            fetchTodos();
            setIsEditModalOpen(false);
            setSelectedTodo(null);
        } catch (err) {
            setError(err.message);
        }
    };

    const getPriorityValue = (priority) => {
        const p = String(priority || '').toLowerCase();

        if (p === '3' || p === '4' || p === '5' || p.includes('haut')) return 3;
        if (p === '2' || p.includes('moyen')) return 2;
        return 1; // faible par défaut
    };

    const displayedTodos = [...todos]
    // 1. Filtre état
    .filter(todo => {
        if (!todo) return false;
        if (hideCompleted) return !todo.complete;
        return true;
    })
    // 2. Tri priorité
    .sort((a, b) => {
        if (!priorityOrder) return 0;

        const pa = getPriorityValue(a.priority);
        const pb = getPriorityValue(b.priority);

        return priorityOrder === 'asc' ? pa - pb : pb - pa;
    });



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
                <div className="todo-filters">
                    <button
                        className={`btn-filter ${priorityOrder === 'asc' ? 'active' : ''}`}
                        onClick={() =>
                            setPriorityOrder(priorityOrder === 'asc' ? null : 'asc')
                        }
                    >
                        🔼 Priorité croissante
                    </button>

                    <button
                        className={`btn-filter ${priorityOrder === 'desc' ? 'active' : ''}`}
                        onClick={() =>
                            setPriorityOrder(priorityOrder === 'desc' ? null : 'desc')
                        }
                    >
                        🔽 Priorité décroissante
                    </button>

                    <button
                        className={`btn-filter ${hideCompleted ? 'active' : ''}`}
                        onClick={() => setHideCompleted(!hideCompleted)}
                    >
                        {hideCompleted ? '👁️ Afficher complétées' : '🚫 Masquer complétées'}
                    </button>
                </div>

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
                            {displayedTodos && displayedTodos.length > 0 ? (
                                displayedTodos.map((todo, index) => {

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
                                    <button
                                        className={`todo-status-btn ${todo.complete ? 'completed' : 'pending'}`}
                                        onClick={() => toggleTodoStatus(todo)}
                                        title="Changer le statut"
                                    >
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
                                    <button
                                        className="btn-edit"
                                        title="Modifier"
                                        onClick={() => {
                                            setSelectedTodo(todo);
                                            setIsEditModalOpen(true);
                                        }}
                                    >
                                        ✎
                                    </button>

                                    <button
                                        className="btn-delete"
                                        title="Supprimer"
                                        onClick={() => {
                                            setSelectedTodo(todo);
                                            setIsDeleteModalOpen(true);
                                        }}
                                    >
                                        🗑
                                    </button>

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
            <EditTodoModal
                isOpen={isEditModalOpen}
                todo={selectedTodo}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setSelectedTodo(null);
                }}
                onSubmit={editTodo}
            />

            <DeleteTodoModal
                isOpen={isDeleteModalOpen}
                todo={selectedTodo}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setSelectedTodo(null);
                }}
                onConfirm={deleteTodo}
            />

        </div>
    );
};

export default TodoTable;