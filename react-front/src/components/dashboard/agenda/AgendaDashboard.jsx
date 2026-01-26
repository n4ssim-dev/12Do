import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../../AuthContext';
import './AgendaDashboard.scss';
import AddAgendaEvent from '../modals/AddAgendaEvent';
import DeleteAgendaEvent from '../modals/DeleteAgendaEvent';

const VIEW_MODES = ['Jour', 'Semaine', 'Mois'];
const HOURS = Array.from({ length: 17 }, (_, i) => i + 6);

const AgendaDashboard = () => {
  const { user, loading: authLoading } = useAuth();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [viewMode, setViewMode] = useState('Semaine');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState(null);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  /* ------------------ helpers dates ------------------ */
  const isSameDay = (d1, d2) => d1.toDateString() === d2.toDateString();

  const eventsForDay = (date) =>
    events.filter(e => isSameDay(new Date(e.start_date), date));

  const eventStartsInHour = (event, hour) => {
    const start = new Date(event.start_date);
    return start.getHours() === hour;
  };

  const eventDurationInHours = (event) => {
    const start = new Date(event.start_date);
    const end = new Date(event.end_date);
    const diff = end.getHours() - start.getHours();
    return Math.max(1, diff);
  };

  const getDateRange = () => {
    const start = new Date(currentDate);
    const end = new Date(currentDate);

    if (viewMode === 'Semaine') {
      start.setDate(start.getDate() - start.getDay());
      end.setDate(start.getDate() + 6);
    }

    if (viewMode === 'Mois') {
      start.setDate(1);
      end.setMonth(start.getMonth() + 1);
      end.setDate(0);
    }

    return {
      start: start.toISOString().split('T')[0],
      end: end.toISOString().split('T')[0],
    };
  };

  /* ------------------ fetch ------------------ */
  const fetchAgenda = useCallback(async () => {
    if (!user?.token) return;

    setLoading(true);
    const { start, end } = getDateRange();

    try {
      const response = await fetch(
        `http://localhost:8000/agenda?start=${start}&end=${end}`,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      if (!response.ok) throw new Error('Erreur de chargement de l’agenda');

      const data = await response.json();
      setEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user, currentDate, viewMode]);

  useEffect(() => {
    if (!authLoading) fetchAgenda();
  }, [authLoading, fetchAgenda]);

  /* ------------------ navigation ------------------ */
  const navigate = (dir) => {
    const d = new Date(currentDate);
    if (viewMode === 'Jour') d.setDate(d.getDate() + dir);
    if (viewMode === 'Semaine') d.setDate(d.getDate() + dir * 7);
    if (viewMode === 'Mois') d.setMonth(d.getMonth() + dir);
    setCurrentDate(d);
  };

  if (authLoading || loading) {
    return <div className="agenda-loading">Chargement de l’agenda…</div>;
  }

  return (
    <div className="agenda-container full-width">

      {/* HEADER */}
      <header className="agenda-header">
        <div>
          <h1>Agenda des tâches</h1>
          <p className="agenda-subtitle">Vue {viewMode}</p>
        </div>

        <div className="agenda-controls">
          {VIEW_MODES.map(mode => (
            <button
              key={mode}
              className={viewMode === mode ? 'active' : ''}
              onClick={() => setViewMode(mode)}
            >
              {mode.toUpperCase()}
            </button>
          ))}

          <button className="btn-add-agenda" onClick={() => setIsAddOpen(true)}>
            ＋ Événement
          </button>
        </div>
      </header>

      {/* NAV */}
      <div className="agenda-nav">
        <button onClick={() => navigate(-1)}>← Précédent</button>
        <button onClick={() => setCurrentDate(new Date())}>Aujourd’hui</button>
        <button onClick={() => navigate(1)}>Suivant →</button>
      </div>

      {error && <div className="agenda-error">⚠️ {error}</div>}

      {/* ================= JOUR ================= */}
      {viewMode === 'Jour' && (
        <div className="day-view">
          <div className="hours">
            {HOURS.map(h => (
              <div key={h} className="hour-label">{h}:00</div>
            ))}
          </div>

          <div className="day-events">
            {HOURS.map(h => (
              <div key={h} className="hour-slot">
                {events
                  .filter(e => eventStartsInHour(e, h))
                  .map(event => (
                    <div
                      key={event.id}
                      className="agenda-event"
                      style={{
                        borderLeftColor: event.color,
                        height: `${eventDurationInHours(event) * 60}px`,
                        width: '100%'
                      }}
                      onClick={() => {
                        setSelectedEvent(event);
                        setIsDeleteOpen(true);
                      }}
                    >
                      <strong>{event.title}</strong>
                    </div>
                  ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= SEMAINE ================= */}
      {viewMode === 'Semaine' && (
        <div className="week-view">
          {[...Array(7)].map((_, i) => {
            const day = new Date(currentDate);
            day.setDate(day.getDate() - day.getDay() + i);

            return (
              <div key={i} className="week-day">
                <div className="week-day-header">
                  {day.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' })}
                </div>

                {HOURS.map(h => (
                  <div key={h} className="hour-slot">
                    {eventsForDay(day)
                      .filter(e => eventStartsInHour(e, h))
                      .map(event => (
                        <div
                          key={event.id}
                          className="agenda-event small"
                          style={{
                            borderLeftColor: event.color,
                            height: `${eventDurationInHours(event) * 60}px`,
                            width: '100%'
                          }}
                          onClick={() => {
                            setSelectedEvent(event);
                            setIsDeleteOpen(true);
                          }}
                        >
                          {event.title}
                        </div>
                      ))}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}

      {/* ================= MOIS ================= */}
      {viewMode === 'Mois' && (
        <div className="month-view">
          {[...Array(31)].map((_, i) => {
            const day = new Date(currentDate.getFullYear(), currentDate.getMonth(), i + 1);

            return (
              <div key={i} className="month-day">
                <div className="month-day-number">{i + 1}</div>
                {eventsForDay(day).map(event => (
                  <div
                    key={event.id}
                    className="agenda-event tiny"
                    style={{ borderLeftColor: event.color }}
                    onClick={() => {
                      setSelectedEvent(event);
                      setIsDeleteOpen(true);
                    }}
                  >
                    {event.title}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}

      {/* MODALS */}
      <DeleteAgendaEvent
        isOpen={isDeleteOpen}
        event={selectedEvent}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={async (id) => {
          await fetch(`http://localhost:8000/agenda/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${user.token}` },
          });
          setIsDeleteOpen(false);
          setSelectedEvent(null);
          fetchAgenda();
        }}
      />

      <AddAgendaEvent
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSuccess={fetchAgenda}
      />
    </div>
  );
};

export default AgendaDashboard;