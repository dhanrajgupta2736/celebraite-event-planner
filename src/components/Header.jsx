import React from 'react';
import {
  Sparkles,
  Calendar,
  Settings,
  Printer,
  PlusCircle,
  Sun,
  Moon,
  ShieldCheck,
  Cpu,
  Command,
} from 'lucide-react';
import { hasLiveApiKey } from '../services/geminiService';
import { CURRENCIES } from '../services/currencyEngine';

/**
 * Top Application Header Component
 * Contains branding, active plan switcher, global currency selector,
 * theme toggle, command palette shortcut, and modal triggers.
 * @param {object} props
 * @returns {React.ReactElement}
 */
export default function Header({
  events,
  activeEvent,
  onSelectEvent,
  onOpenWizard,
  onOpenSettings,
  onOpenExport,
  theme,
  onToggleTheme,
  currency,
  onSelectCurrency,
  onOpenCommandPalette,
}) {
  const isAiActive = hasLiveApiKey();

  return (
    <>
      {/* Skip Navigation Link for Screen Readers & Keyboard Access */}
      <a
        href="#main-content"
        className="skip-link"
        style={{
          position: 'absolute',
          top: '-40px',
          left: '10px',
          background: 'var(--gold-primary)',
          color: '#000',
          padding: '8px 16px',
          fontWeight: 700,
          zIndex: 9999,
          borderRadius: '4px',
          transition: 'top 0.2s ease',
        }}
        onFocus={(e) => (e.target.style.top = '10px')}
        onBlur={(e) => (e.target.style.top = '-40px')}
      >
        Skip to main content
      </a>

      <header
        className="glass-card"
        style={{
          borderRadius: 0,
          borderLeft: 'none',
          borderRight: 'none',
          borderTop: 'none',
          padding: '0.85rem 1.5rem',
          position: 'sticky',
          top: 0,
          zIndex: 50,
        }}
        role="banner"
      >
        <div
          style={{
            maxWidth: '1400px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          {/* Brand Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #d4af37 0%, #8b5cf6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                boxShadow: '0 0 16px rgba(212, 175, 55, 0.4)',
              }}
            >
              <Sparkles size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 800,
                    fontSize: '1.45rem',
                    letterSpacing: '-0.02em',
                  }}
                >
                  Celebr<span className="gradient-text-gold">AI</span>te
                </span>
                <span className="badge badge-gold" style={{ fontSize: '0.68rem', padding: '0.15rem 0.5rem' }}>
                  v1.2 PRO
                </span>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>
                Autonomous GenAI Celebration & Event Planner
              </p>
            </div>
          </div>

          {/* Event Selector & New Event */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar size={18} style={{ color: 'var(--gold-primary)' }} />
              <select
                id="event-selector"
                aria-label="Select Event Plan"
                value={activeEvent?.id || ''}
                onChange={(e) => onSelectEvent(e.target.value)}
                className="form-select"
                style={{
                  padding: '0.45rem 0.85rem',
                  fontSize: '0.88rem',
                  width: 'auto',
                  minWidth: '220px',
                  fontWeight: 600,
                }}
              >
                {events.map((evt) => (
                  <option key={evt.id} value={evt.id}>
                    {evt.eventType === 'wedding' ? '💍 ' : evt.eventType === 'birthday' ? '🎂 ' : '🤝 '}
                    {evt.title}
                  </option>
                ))}
              </select>
            </div>

            <button
              id="btn-new-event"
              onClick={onOpenWizard}
              className="btn btn-primary btn-sm"
              title="Create a new event plan"
            >
              <PlusCircle size={16} />
              <span>New Plan</span>
            </button>
          </div>

          {/* Currency Switcher, Command Palette & Tools */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            {/* Multi-Currency Dropdown */}
            <select
              aria-label="Select Display Currency"
              className="form-select"
              style={{
                width: 'auto',
                padding: '0.35rem 0.6rem',
                fontSize: '0.8rem',
                fontWeight: 600,
              }}
              value={currency}
              onChange={(e) => onSelectCurrency(e.target.value)}
              title="Change display currency"
            >
              {Object.keys(CURRENCIES).map((cCode) => (
                <option key={cCode} value={cCode}>
                  {cCode} ({CURRENCIES[cCode].symbol})
                </option>
              ))}
            </select>

            {/* Quick Command Palette Trigger (Cmd+K) */}
            <button
              onClick={onOpenCommandPalette}
              className="btn btn-secondary btn-sm"
              style={{ padding: '0.35rem 0.65rem', fontSize: '0.78rem' }}
              title="Open Command Palette (Ctrl+K or Cmd+K)"
              id="btn-command-palette"
            >
              <Command size={13} />
              <span>Ctrl+K</span>
            </button>

            {/* AI Connection Status Badge */}
            <div
              className={`badge ${isAiActive ? 'badge-green' : 'badge-purple'}`}
              title={
                isAiActive
                  ? 'Gemini 3.8 Flash live connection active'
                  : 'Deterministic Fallback Engine active (offline safe)'
              }
              style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
              onClick={onOpenSettings}
            >
              {isAiActive ? <Cpu size={13} /> : <ShieldCheck size={13} />}
              <span>{isAiActive ? 'Gemini 3.8 Flash' : 'Offline Engine'}</span>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={onToggleTheme}
              className="btn btn-secondary btn-icon"
              aria-label="Toggle theme mode"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              style={{ width: '36px', height: '36px' }}
            >
              {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
            </button>

            {/* Export / Print Dossier */}
            <button
              id="btn-export-dossier"
              onClick={onOpenExport}
              className="btn btn-secondary btn-icon"
              aria-label="Export or Print Event Dossier"
              title="Export & Print Event Dossier"
              style={{ width: '36px', height: '36px' }}
            >
              <Printer size={17} />
            </button>

            {/* Settings Modal */}
            <button
              id="btn-settings"
              onClick={onOpenSettings}
              className="btn btn-secondary btn-icon"
              aria-label="Settings and API Configuration"
              title="Configure Gemini API Key"
              style={{ width: '36px', height: '36px' }}
            >
              <Settings size={17} />
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
