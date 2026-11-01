import React, { useState } from 'react';
import {
  Users,
  UserCheck,
  UserX,
  Clock,
  PlusCircle,
  Sparkles,
  Utensils,
  Copy,
  Check,
  Trash2,
} from 'lucide-react';
import { sanitizeInput } from '../services/securityGuard';

/**
 * Guest Manager Component
 * Tracks RSVP headcounts, table seating arrangements, and dietary restriction rollups.
 * @param {{ event: object, onUpdateEvent: (updated: object) => void }} props
 */
export default function GuestManager({ event, onUpdateEvent }) {
  const [guests, setGuests] = useState(
    event.guests || [
      { id: 'g1', name: 'Kabir & Ananya Sharma', status: 'Attending', partySize: 2, table: 'Table 1 - Family VIP', dietary: 'Vegetarian', email: 'kabir@example.com' },
      { id: 'g2', name: 'Dr. Priya Venkatesh', status: 'Attending', partySize: 1, table: 'Table 2 - College Friends', dietary: 'Vegan, GF', email: 'priya@example.com' },
      { id: 'g3', name: 'Marcus & Chloe Vance', status: 'Pending', partySize: 2, table: 'Table 4 - City Partners', dietary: 'None', email: 'marcus@example.com' },
      { id: 'g4', name: 'David & Sarah Kim', status: 'Attending', partySize: 2, table: 'Table 2 - College Friends', dietary: 'Nut Allergy', email: 'david@example.com' },
      { id: 'g5', name: 'Rohan Mehta', status: 'Declined', partySize: 1, table: 'Unassigned', dietary: 'None', email: 'rohan@example.com' },
    ]
  );

  const [showAddModal, setShowAddModal] = useState(false);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [copiedReminder, setCopiedReminder] = useState(false);
  const [newGuest, setNewGuest] = useState({
    name: '',
    status: 'Pending',
    partySize: 1,
    table: 'Table 1',
    dietary: 'None',
    email: '',
  });

  // Calculate RSVP stats
  const attendingCount = guests
    .filter((g) => g.status === 'Attending')
    .reduce((sum, g) => sum + g.partySize, 0);
  const pendingCount = guests
    .filter((g) => g.status === 'Pending')
    .reduce((sum, g) => sum + g.partySize, 0);
  const declinedCount = guests
    .filter((g) => g.status === 'Declined')
    .reduce((sum, g) => sum + g.partySize, 0);

  // Calculate dietary aggregations
  const dietarySummary = guests
    .filter((g) => g.status === 'Attending')
    .reduce((acc, g) => {
      const diet = g.dietary || 'None';
      acc[diet] = (acc[diet] || 0) + g.partySize;
      return acc;
    }, {});

  const handleStatusChange = (id, newStatus) => {
    const updated = guests.map((g) => (g.id === id ? { ...g, status: newStatus } : g));
    setGuests(updated);
    onUpdateEvent({ ...event, guests: updated });
  };

  const handleDeleteGuest = (id) => {
    const updated = guests.filter((g) => g.id !== id);
    setGuests(updated);
    onUpdateEvent({ ...event, guests: updated });
  };

  const handleAddGuest = (e) => {
    e.preventDefault();
    const cleanName = sanitizeInput(newGuest.name);
    if (!cleanName) return;

    const created = {
      id: `g-${Date.now()}`,
      name: cleanName,
      status: newGuest.status,
      partySize: Number(newGuest.partySize) || 1,
      table: sanitizeInput(newGuest.table) || 'Table 1',
      dietary: sanitizeInput(newGuest.dietary) || 'None',
      email: sanitizeInput(newGuest.email),
    };

    const updated = [...guests, created];
    setGuests(updated);
    onUpdateEvent({ ...event, guests: updated });
    setShowAddModal(false);
    setNewGuest({
      name: '',
      status: 'Pending',
      partySize: 1,
      table: 'Table 1',
      dietary: 'None',
      email: '',
    });
  };

  const reminderText = `Hi there! 👋 We are finalizing headcounts and seating for ${event.title} on ${event.date || 'our celebration date'}. Could you please let us know if you'll be able to join us and confirm any dietary preferences by this Friday? We can't wait to celebrate together! ✨`;

  const handleCopyReminder = () => {
    navigator.clipboard.writeText(reminderText);
    setCopiedReminder(true);
    setTimeout(() => setCopiedReminder(false), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Banner Bar */}
      <div className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <Users size={20} style={{ color: 'var(--gold-primary)' }} />
            <h2 style={{ fontSize: '1.45rem' }}>Guest Roster, RSVPs & Dietary Aggregator</h2>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: 0 }}>
            Real-time headcounts, table allocations, and automated catering dietary summaries.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.65rem' }}>
          <button
            onClick={() => setShowReminderModal(true)}
            className="btn btn-secondary btn-sm"
            title="Draft AI RSVP reminder message"
          >
            <Sparkles size={14} style={{ color: 'var(--gold-primary)' }} />
            <span>AI RSVP Reminder</span>
          </button>

          <button onClick={() => setShowAddModal(true)} className="btn btn-primary btn-sm" id="btn-add-guest">
            <PlusCircle size={15} />
            <span>Add Guest</span>
          </button>
        </div>
      </div>

      {/* KPI Cards: RSVP Counts & Dietary Rollup */}
      <div className="grid-4">
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>
              Confirmed Attending
            </span>
            <UserCheck size={18} style={{ color: 'var(--success)' }} />
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--success)' }}>
            {attendingCount}{' '}
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Attendees</span>
          </div>
        </div>

        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>
              Awaiting RSVP
            </span>
            <Clock size={18} style={{ color: 'var(--warning)' }} />
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--warning)' }}>
            {pendingCount}{' '}
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Pending</span>
          </div>
        </div>

        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>
              Declined
            </span>
            <UserX size={18} style={{ color: 'var(--danger)' }} />
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--danger)' }}>
            {declinedCount}{' '}
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Seats Freed</span>
          </div>
        </div>

        {/* Dietary Aggregation Pill */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>
              Catering Dietary Rollup
            </span>
            <Utensils size={18} style={{ color: 'var(--purple-primary)' }} />
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.25rem' }}>
            {Object.entries(dietarySummary).map(([diet, count]) => (
              <span key={diet} className="badge badge-purple" style={{ fontSize: '0.7rem' }}>
                {diet}: {count}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Guest List Table */}
      <div className="glass-card" style={{ padding: '1.25rem', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
              <th style={{ padding: '0.75rem 1rem' }}>Guest / Family Party</th>
              <th style={{ padding: '0.75rem 1rem' }}>Party Size</th>
              <th style={{ padding: '0.75rem 1rem' }}>Seating Table</th>
              <th style={{ padding: '0.75rem 1rem' }}>Dietary Requirements</th>
              <th style={{ padding: '0.75rem 1rem' }}>RSVP Status</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {guests.map((g) => (
              <tr key={g.id} style={{ borderBottom: '1px solid var(--border-subtle)', fontSize: '0.92rem' }}>
                <td style={{ padding: '0.85rem 1rem' }}>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{g.name}</div>
                  {g.email && <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{g.email}</div>}
                </td>
                <td style={{ padding: '0.85rem 1rem', color: 'var(--text-secondary)' }}>
                  {g.partySize} {g.partySize > 1 ? 'guests' : 'guest'}
                </td>
                <td style={{ padding: '0.85rem 1rem' }}>
                  <span className="badge badge-gold" style={{ fontSize: '0.72rem' }}>{g.table}</span>
                </td>
                <td style={{ padding: '0.85rem 1rem' }}>
                  <span
                    className={`badge ${
                      g.dietary === 'None' ? 'badge-purple' : 'badge-rose'
                    }`}
                    style={{ fontSize: '0.72rem' }}
                  >
                    {g.dietary || 'Standard'}
                  </span>
                </td>
                <td style={{ padding: '0.85rem 1rem' }}>
                  <select
                    className="form-select"
                    style={{ width: 'auto', padding: '0.25rem 0.65rem', fontSize: '0.8rem' }}
                    value={g.status}
                    onChange={(e) => handleStatusChange(g.id, e.target.value)}
                  >
                    <option value="Attending">Attending</option>
                    <option value="Pending">Pending</option>
                    <option value="Declined">Declined</option>
                  </select>
                </td>
                <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                  <button
                    onClick={() => handleDeleteGuest(g.id)}
                    className="btn btn-secondary btn-icon"
                    style={{ width: '32px', height: '32px', color: 'var(--danger)' }}
                    title="Remove guest"
                  >
                    <Trash2 size={13} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* AI RSVP Reminder Modal */}
      {showReminderModal && (
        <div className="modal-overlay" onClick={() => setShowReminderModal(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sparkles size={18} style={{ color: 'var(--gold-primary)' }} />
                <h3 style={{ fontSize: '1.25rem' }}>AI RSVP Nudge Message</h3>
              </div>
              <button onClick={() => setShowReminderModal(false)} className="btn btn-secondary btn-icon" style={{ width: '30px', height: '30px' }}>
                ✕
              </button>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
                Personalized nudge tailored for pending guests via WhatsApp, SMS, or email:
              </p>
              <textarea
                className="form-textarea"
                rows={5}
                readOnly
                value={reminderText}
                style={{ fontSize: '0.9rem', lineHeight: 1.6 }}
              />
            </div>
            <div className="modal-footer">
              <button onClick={() => setShowReminderModal(false)} className="btn btn-secondary">
                Close
              </button>
              <button onClick={handleCopyReminder} className="btn btn-primary">
                {copiedReminder ? <Check size={16} /> : <Copy size={16} />}
                <span>{copiedReminder ? 'Copied Nudge!' : 'Copy to Clipboard'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Guest Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.25rem' }}>Add New Guest / Party</h3>
              <button onClick={() => setShowAddModal(false)} className="btn btn-secondary btn-icon" style={{ width: '30px', height: '30px' }}>
                ✕
              </button>
            </div>
            <form onSubmit={handleAddGuest}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Guest / Party Name *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="e.g. Maya Lin & Plus One"
                    value={newGuest.name}
                    onChange={(e) => setNewGuest({ ...newGuest, name: e.target.value })}
                  />
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Party Size</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      className="form-input"
                      value={newGuest.partySize}
                      onChange={(e) => setNewGuest({ ...newGuest, partySize: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Assigned Table</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Table 3 - Friends"
                      value={newGuest.table}
                      onChange={(e) => setNewGuest({ ...newGuest, table: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Dietary Preference</label>
                    <select
                      className="form-select"
                      value={newGuest.dietary}
                      onChange={(e) => setNewGuest({ ...newGuest, dietary: e.target.value })}
                    >
                      <option value="None">None (Standard Menu)</option>
                      <option value="Vegetarian">Vegetarian</option>
                      <option value="Vegan">Vegan</option>
                      <option value="Gluten-Free">Gluten-Free</option>
                      <option value="Halal">Halal</option>
                      <option value="Nut Allergy">Nut Allergy</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Contact Email / Phone</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="guest@example.com"
                      value={newGuest.email}
                      onChange={(e) => setNewGuest({ ...newGuest, email: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Guest
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
