import React, { useState } from 'react';
import {
  Sparkles,
  Heart,
  PartyPopper,
  Building2,
  CheckCircle2,
} from 'lucide-react';
import { generateFullEventPlan } from '../services/geminiService';
import { createNewEvent } from '../services/storageService';
import { sanitizeInput } from '../services/securityGuard';

/**
 * Event Wizard Component
 * Guides the user through a 3-step structured parameter intake
 * to autonomously synthesize a comprehensive celebration plan.
 * @param {{ isOpen: boolean, onClose: () => void, onEventCreated: (event: object) => void }} props
 */
export default function EventWizard({ isOpen, onClose, onEventCreated }) {
  if (!isOpen) return null;

  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    eventType: 'wedding',
    title: '',
    date: new Date(Date.now() + 180 * 86400000).toISOString().split('T')[0],
    location: '',
    guestCount: 120,
    budget: 25000,
    vibes: 'Timeless Elegance & Romantic Florals',
    notes: 'Prioritize a relaxed dinner flow, excellent photography, and great music.',
  });

  const EVENT_OPTIONS = [
    {
      type: 'wedding',
      title: 'Wedding Celebration',
      description: 'Engagements, Multi-day Ceremonies, Receptions & Sangeet',
      icon: Heart,
      defaultBudget: 35000,
      defaultVibes: 'Timeless Romance, Candlelight & Warm Florals',
    },
    {
      type: 'birthday',
      title: 'Milestone Birthday',
      description: 'Sweet 16, 21st, 30th/50th Jubilee, Themed Parties',
      icon: PartyPopper,
      defaultBudget: 6000,
      defaultVibes: 'High Energy, Neon Glow & Playful Cocktails',
    },
    {
      type: 'community',
      title: 'Community Gathering & Gala',
      description: 'Charity Fundraisers, Festivals, Block Parties & Galas',
      icon: Building2,
      defaultBudget: 20000,
      defaultVibes: 'Sustainable, Farm-to-Table & Inclusive Unity',
    },
  ];

  const handleSelectType = (opt) => {
    setFormData({
      ...formData,
      eventType: opt.type,
      budget: opt.defaultBudget,
      vibes: opt.defaultVibes,
    });
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    setIsGenerating(true);

    try {
      const sanitizedData = {
        title: sanitizeInput(formData.title) || `${formData.eventType.toUpperCase()} Celebration`,
        eventType: formData.eventType,
        date: formData.date,
        location: sanitizeInput(formData.location) || 'Selected Venue Grounds',
        guestCount: Number(formData.guestCount) || 100,
        budget: Number(formData.budget) || 15000,
        vibes: sanitizeInput(formData.vibes),
        notes: sanitizeInput(formData.notes),
      };

      const generated = await generateFullEventPlan(sanitizedData);

      const createdEvent = createNewEvent({
        ...sanitizedData,
        budgetItems: generated.budgetItems,
        macroTimeline: generated.macroTimeline,
        dayOfRunSheet: generated.dayOfRunSheet,
        vendors: generated.vendorChecklist,
        theme: generated.creativeSuite?.theme,
        menu: generated.creativeSuite?.menu,
        activities: generated.creativeSuite?.activities,
      });

      onEventCreated(createdEvent);
      onClose();
    } catch (err) {
      console.error('Error generating event:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '680px' }}>
        {/* Modal Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, var(--gold-primary), var(--purple-primary))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
              }}
            >
              <Sparkles size={16} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', margin: 0 }}>CelebrAIte Autonomous Event Wizard</h3>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                Step {step} of 3: {step === 1 ? 'Vertical Persona' : step === 2 ? 'Details & Venue' : 'Financials & Vibe'}
              </span>
            </div>
          </div>

          <button onClick={onClose} className="btn btn-secondary btn-icon" style={{ width: '30px', height: '30px' }}>
            ✕
          </button>
        </div>

        {/* Modal Content */}
        {isGenerating ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <Sparkles size={48} className="pulse-glow" style={{ color: 'var(--gold-primary)', margin: '0 auto 1.5rem' }} />
            <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>
              Synthesizing Autonomous Event Architecture...
            </h3>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '480px', margin: '0 auto', fontSize: '0.92rem' }}>
              Gemini 3.8 Flash is deriving categorical budget ratios, day-of operational buffers, curated catering courses, and bespoke color swatches.
            </p>
          </div>
        ) : (
          <form onSubmit={step === 3 ? handleFinalSubmit : (e) => { e.preventDefault(); setStep(step + 1); }}>
            <div className="modal-body">
              {/* STEP 1: SELECT VERTICAL PERSONA */}
              {step === 1 && (
                <div>
                  <h4 style={{ fontSize: '1.05rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
                    Select Your Celebration Vertical
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    {EVENT_OPTIONS.map((opt) => {
                      const Icon = opt.icon;
                      const isSelected = formData.eventType === opt.type;
                      return (
                        <div
                          key={opt.type}
                          onClick={() => handleSelectType(opt)}
                          className="glass-card-interactive"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            padding: '1.15rem 1.25rem',
                            borderRadius: 'var(--radius-lg)',
                            background: isSelected ? 'rgba(212, 175, 55, 0.12)' : 'rgba(15, 20, 34, 0.65)',
                            border: isSelected ? '1px solid var(--gold-primary)' : '1px solid var(--border-subtle)',
                            cursor: 'pointer',
                          }}
                        >
                          <div
                            style={{
                              width: '42px',
                              height: '42px',
                              borderRadius: '10px',
                              background: isSelected ? 'var(--gold-primary)' : 'rgba(255, 255, 255, 0.06)',
                              color: isSelected ? '#000' : 'var(--gold-light)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                            }}
                          >
                            <Icon size={20} />
                          </div>

                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>
                              {opt.title}
                            </div>
                            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                              {opt.description}
                            </div>
                          </div>

                          {isSelected && <CheckCircle2 size={20} style={{ color: 'var(--gold-primary)' }} />}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 2: DETAILS & VENUE */}
              {step === 2 && (
                <div>
                  <div className="form-group">
                    <label className="form-label">Celebration Title *</label>
                    <input
                      type="text"
                      required
                      className="form-input"
                      placeholder="e.g. Maya & Ethan's Coastal Cliff Wedding"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                  </div>

                  <div className="grid-2">
                    <div className="form-group">
                      <label className="form-label">Event Target Date *</label>
                      <input
                        type="date"
                        required
                        className="form-input"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Estimated Guest Count *</label>
                      <input
                        type="number"
                        min="5"
                        max="5000"
                        required
                        className="form-input"
                        value={formData.guestCount}
                        onChange={(e) => setFormData({ ...formData, guestCount: Number(e.target.value) })}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Location / Desired Venue Setting</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Historic Manor, Rooftop Lounge, Coastal Pavilion"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    />
                  </div>
                </div>
              )}

              {/* STEP 3: FINANCIALS & AESTHETICS */}
              {step === 3 && (
                <div>
                  <div className="form-group">
                    <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Total Budget Ceiling ($ USD) *</span>
                      <strong style={{ color: 'var(--gold-light)', fontSize: '1rem' }}>
                        ${formData.budget.toLocaleString()}
                      </strong>
                    </label>
                    <input
                      type="range"
                      min="1000"
                      max="150000"
                      step="500"
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) })}
                      style={{ width: '100%', accentColor: 'var(--gold-primary)', margin: '0.5rem 0' }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      <span>$1,000 (Micro / DIY)</span>
                      <span>$50,000 (Premium)</span>
                      <span>$150,000+ (Ultra-Luxury)</span>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Desired Aesthetic / Vibe Keywords</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Modern Minimalist, Italian Vineyard, Cyberpunk 80s"
                      value={formData.vibes}
                      onChange={(e) => setFormData({ ...formData, vibes: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Special Inclusions or Priorities</label>
                    <textarea
                      className="form-textarea"
                      rows={3}
                      placeholder="e.g. Gluten-free catering, drone videography, sunset timing"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="modal-footer">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="btn btn-secondary"
                >
                  Back
                </button>
              )}
              {step < 3 ? (
                <button
                  type="button"
                  onClick={() => setStep(step + 1)}
                  className="btn btn-primary"
                >
                  Continue &rarr;
                </button>
              ) : (
                <button
                  type="submit"
                  className="btn btn-primary"
                  id="btn-generate-full-plan"
                >
                  <Sparkles size={16} />
                  <span>Generate Full Event Plan</span>
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
