import React, { useState } from 'react';
import {
  Clock,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  PlusCircle,
  Sparkles,
  ChevronDown,
  ChevronUp,
  User,
  Info,
} from 'lucide-react';

export default function TimelineGenerator({ event, onUpdateEvent }) {
  const [activeView, setActiveView] = useState('runsheet'); // 'runsheet' or 'milestones'
  const [macroTimeline, setMacroTimeline] = useState(event.macroTimeline || []);
  const [dayOfRunSheet, setDayOfRunSheet] = useState(event.dayOfRunSheet || []);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItem, setNewItem] = useState({
    time: '12:00 PM',
    title: '',
    owner: 'Coordinator',
    note: '',
  });

  // Toggle milestone completion
  const handleToggleMilestone = (milestoneId) => {
    const updated = macroTimeline.map((m) => {
      if (m.id === milestoneId) {
        return { ...m, completed: !m.completed };
      }
      return m;
    });
    setMacroTimeline(updated);
    onUpdateEvent({ ...event, macroTimeline: updated });
  };

  // Add new run-sheet item
  const handleAddRunSheetItem = (e) => {
    e.preventDefault();
    if (!newItem.title.trim()) return;

    const created = {
      time: newItem.time.trim(),
      title: newItem.title.trim(),
      owner: newItem.owner.trim() || 'Coordinator',
      note: newItem.note.trim() || '',
    };

    const updated = [...dayOfRunSheet, created];
    setDayOfRunSheet(updated);
    onUpdateEvent({ ...event, dayOfRunSheet: updated });
    setShowAddModal(false);
    setNewItem({ time: '12:00 PM', title: '', owner: 'Coordinator', note: '' });
  };

  // AI Buffer Injector: Adds safety buffers to prevent event delays
  const handleInjectBuffers = () => {
    const updated = dayOfRunSheet.map((item) => {
      if (item.title.toLowerCase().includes('dinner') || item.title.toLowerCase().includes('ceremony') || item.title.toLowerCase().includes('photo')) {
        return {
          ...item,
          note: item.note ? `${item.note} (Includes 15-min AI buffer)` : 'Includes 15-min AI buffer',
        };
      }
      return item;
    });
    setDayOfRunSheet(updated);
    onUpdateEvent({ ...event, dayOfRunSheet: updated });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Controls Bar */}
      <div className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <Clock size={20} style={{ color: 'var(--purple-primary)' }} />
            <h2 style={{ fontSize: '1.45rem' }}>Precision Timeline & Day-Of Run-Sheet</h2>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: 0 }}>
            Macro milestone countdown and minute-by-minute execution schedule with contingency buffers.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Sub-view toggle pills */}
          <div
            style={{
              display: 'flex',
              background: 'rgba(10, 13, 20, 0.6)',
              padding: '0.25rem',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <button
              onClick={() => setActiveView('runsheet')}
              className={`tab-btn ${activeView === 'runsheet' ? 'active' : ''}`}
              style={{ padding: '0.45rem 1rem', fontSize: '0.82rem' }}
            >
              Day-of Run-Sheet ({dayOfRunSheet.length})
            </button>
            <button
              onClick={() => setActiveView('milestones')}
              className={`tab-btn ${activeView === 'milestones' ? 'active' : ''}`}
              style={{ padding: '0.45rem 1rem', fontSize: '0.82rem' }}
            >
              Countdown Milestones ({macroTimeline.length})
            </button>
          </div>

          <button onClick={handleInjectBuffers} className="btn btn-secondary btn-sm" title="Add 15-min buffers to major events">
            <Sparkles size={14} style={{ color: 'var(--gold-primary)' }} />
            <span>AI Buffer Polish</span>
          </button>

          <button onClick={() => setShowAddModal(true)} className="btn btn-primary btn-sm" id="btn-add-schedule-item">
            <PlusCircle size={15} />
            <span>Add Event Slot</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: DAY-OF RUN-SHEET */}
      {activeView === 'runsheet' && (
        <div className="glass-card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <h3 style={{ fontSize: '1.2rem' }}>Day-of Minute-by-Minute Operational Schedule</h3>
            <span className="badge badge-purple">
              {event.eventType === 'wedding'
                ? 'Ceremony & Reception Flow'
                : event.eventType === 'birthday'
                ? 'Party & Entertainment Flow'
                : 'Gates & Community Program Flow'}
            </span>
          </div>

          {/* Timeline Visual Track */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative' }}>
            {/* Vertical connector line */}
            <div
              style={{
                position: 'absolute',
                top: '20px',
                bottom: '20px',
                left: '85px',
                width: '2px',
                background: 'linear-gradient(to bottom, var(--gold-primary), var(--purple-primary), var(--rose-primary))',
                opacity: 0.35,
              }}
            />

            {dayOfRunSheet.map((item, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '1.5rem',
                  position: 'relative',
                  zIndex: 2,
                }}
              >
                {/* Time Badge */}
                <div
                  style={{
                    minWidth: '95px',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    fontSize: '0.92rem',
                    color: 'var(--gold-light)',
                    background: 'rgba(212, 175, 55, 0.1)',
                    border: '1px solid var(--border-accent)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '0.35rem 0.6rem',
                    textAlign: 'center',
                  }}
                >
                  {item.time}
                </div>

                {/* Content Box */}
                <div
                  style={{
                    flex: 1,
                    background: 'rgba(15, 20, 34, 0.75)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1rem 1.25rem',
                    transition: 'border-color var(--transition-fast)',
                  }}
                  className="glass-card-interactive"
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.35rem' }}>
                    <h4 style={{ fontSize: '1.05rem', margin: 0 }}>{item.title}</h4>
                    <span className="badge badge-purple" style={{ fontSize: '0.72rem' }}>
                      <User size={11} style={{ marginRight: '3px' }} />
                      {item.owner}
                    </span>
                  </div>

                  {item.note && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                      <Info size={14} style={{ color: 'var(--gold-primary)', flexShrink: 0 }} />
                      <span>{item.note}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 2: MACRO COUNTDOWN MILESTONES */}
      {activeView === 'milestones' && (
        <div className="grid-2">
          {macroTimeline.map((m) => (
            <div
              key={m.id}
              className="glass-card"
              style={{
                border: m.completed ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid var(--border-subtle)',
                background: m.completed ? 'rgba(16, 185, 129, 0.05)' : 'var(--bg-card)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.85rem' }}>
                <div>
                  <span className="badge badge-gold" style={{ fontSize: '0.72rem', marginBottom: '0.4rem' }}>
                    {m.phase}
                  </span>
                  <h3 style={{ fontSize: '1.2rem', marginTop: '0.25rem' }}>{m.title}</h3>
                </div>

                <button
                  onClick={() => handleToggleMilestone(m.id)}
                  className={`btn btn-sm ${m.completed ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ borderRadius: 'var(--radius-full)', padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}
                >
                  <CheckCircle2 size={14} />
                  <span>{m.completed ? 'Completed' : 'Mark Done'}</span>
                </button>
              </div>

              {/* Task Checklist */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
                {(m.tasks || []).map((t, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      fontSize: '0.88rem',
                      color: m.completed ? 'var(--text-muted)' : 'var(--text-primary)',
                      textDecoration: m.completed ? 'line-through' : 'none',
                    }}
                  >
                    <div
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: m.completed ? 'var(--success)' : 'var(--purple-primary)',
                      }}
                    />
                    <span>{t}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Run-Sheet Item Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.25rem' }}>Add Run-Sheet Time Slot</h3>
              <button onClick={() => setShowAddModal(false)} className="btn btn-secondary btn-icon" style={{ width: '30px', height: '30px' }}>
                ✕
              </button>
            </div>
            <form onSubmit={handleAddRunSheetItem}>
              <div className="modal-body">
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Time Slot *</label>
                    <input
                      type="text"
                      required
                      className="form-input"
                      placeholder="e.g. 03:30 PM"
                      value={newItem.time}
                      onChange={(e) => setNewItem({ ...newItem, time: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Lead Owner / Stakeholder *</label>
                    <input
                      type="text"
                      required
                      className="form-input"
                      placeholder="e.g. DJ, Catering Captain, Officiant"
                      value={newItem.owner}
                      onChange={(e) => setNewItem({ ...newItem, owner: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Activity Title *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="e.g. First Dance & Champagne Toast"
                    value={newItem.title}
                    onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Operational Notes & Buffers</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Dim lighting, test microphones 5 mins prior"
                    value={newItem.note}
                    onChange={(e) => setNewItem({ ...newItem, note: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Add to Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
