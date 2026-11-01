import React, { useState } from 'react';
import {
  CloudRain,
  Wind,
  Flame,
  Sparkles,
  ShieldAlert,
} from 'lucide-react';
import { generateContingencyPlan } from '../services/weatherContingencyEngine';

export default function WeatherContingency({ event, onUpdateEvent }) {
  const [selectedWeather, setSelectedWeather] = useState('RAIN');
  const [applied, setApplied] = useState(false);

  const contingency = generateContingencyPlan(event.eventType, selectedWeather);

  const handleApplyToRunSheet = () => {
    const updatedRunSheet = (event.dayOfRunSheet || []).map((slot) => {
      if (
        slot.title.toLowerCase().includes('ceremony') ||
        slot.title.toLowerCase().includes('arrival') ||
        slot.title.toLowerCase().includes('cocktail')
      ) {
        return {
          ...slot,
          note: `${slot.note ? slot.note + ' • ' : ''}[Weather Plan B: ${contingency.weather}]`,
        };
      }
      return slot;
    });

    onUpdateEvent({ ...event, dayOfRunSheet: updatedRunSheet });
    setApplied(true);
    setTimeout(() => setApplied(false), 2500);
  };

  const WEATHER_TABS = [
    { id: 'RAIN', label: 'Rain & Storm Downpour', icon: CloudRain, color: '#06B6D4' },
    { id: 'HEAT', label: 'Extreme Heatwave', icon: Flame, color: '#EF4444' },
    { id: 'WIND', label: 'High Winds & Gusts', icon: Wind, color: '#A78BFA' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Banner Bar */}
      <div className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <CloudRain size={20} style={{ color: 'var(--info)' }} />
            <h2 style={{ fontSize: '1.45rem' }}>Weather Risk & Emergency Plan B Advisor</h2>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: 0 }}>
            Simulate meteorological disruptions and deploy automated contingency protocols for outdoor venues.
          </p>
        </div>

        <button onClick={handleApplyToRunSheet} className="btn btn-primary btn-sm" id="btn-apply-weather-plan">
          <Sparkles size={14} />
          <span>{applied ? '✓ Plan B Injected into Run-Sheet!' : 'Apply Plan B to Run-Sheet'}</span>
        </button>
      </div>

      {/* Weather Selector Tabs */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        {WEATHER_TABS.map((w) => {
          const Icon = w.icon;
          const isActive = selectedWeather === w.id;
          return (
            <button
              key={w.id}
              onClick={() => setSelectedWeather(w.id)}
              className="glass-card-interactive"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.25rem',
                borderRadius: 'var(--radius-lg)',
                background: isActive ? `${w.color}22` : 'rgba(15, 20, 34, 0.65)',
                border: isActive ? `1px solid ${w.color}` : '1px solid var(--border-subtle)',
                color: isActive ? '#fff' : 'var(--text-secondary)',
                cursor: 'pointer',
                fontFamily: 'var(--font-display)',
                fontWeight: 600,
                fontSize: '0.92rem',
              }}
            >
              <Icon size={18} style={{ color: w.color }} />
              <span>{w.label}</span>
            </button>
          );
        })}
      </div>

      {/* Contingency Plan Card */}
      <div className="glass-card" style={{ border: '1px solid var(--border-highlight)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem' }}>{contingency.weather}</h3>
            <span style={{ fontSize: '0.82rem', color: 'var(--gold-light)' }}>
              Recommended Execution Window: {contingency.triggerNotice}
            </span>
          </div>

          <span className="badge badge-rose" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <ShieldAlert size={13} />
            <span>High Priority Protocol</span>
          </span>
        </div>

        {/* Action Items List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.25rem' }}>
          {contingency.actionItems.map((item, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '1rem',
                background: 'rgba(10, 13, 20, 0.65)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
              }}
            >
              <span
                className={`badge ${
                  item.priority === 'Immediate' || item.priority === 'Essential'
                    ? 'badge-rose'
                    : 'badge-purple'
                }`}
                style={{ fontSize: '0.7rem', flexShrink: 0, marginTop: '2px' }}
              >
                {item.priority}
              </span>

              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                  {item.title}
                </div>
                <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                  {item.note}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Schedule Shift Callout */}
        <div
          style={{
            background: 'rgba(212, 175, 55, 0.08)',
            border: '1px solid var(--border-accent)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem 1.25rem',
            fontSize: '0.88rem',
            color: 'var(--text-secondary)',
          }}
        >
          <strong style={{ color: 'var(--gold-light)' }}>Operational Run-Sheet Shift: </strong>
          {contingency.runSheetShiftNotes}
        </div>
      </div>
    </div>
  );
}
