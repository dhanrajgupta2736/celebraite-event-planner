import React, { useState, useEffect } from 'react';
import {
  Search,
  LayoutDashboard,
  DollarSign,
  Clock,
  ShieldCheck,
  Sparkles,
  Users,
  CloudRain,
  Settings,
  Printer,
  Sun,
  Moon,
  Bot,
} from 'lucide-react';

/**
 * Global Keyboard Command Palette Component (Ctrl+K / Cmd+K)
 * Enables rapid keyboard-driven navigation, modal triggering, and theme switching.
 * @param {object} props
 * @returns {React.ReactElement | null}
 */
export default function CommandPalette({
  isOpen,
  onClose,
  onNavigateTab,
  onOpenCopilot,
  onOpenWizard,
  onOpenExport,
  onOpenSettings,
  onToggleTheme,
  theme,
}) {
  const [query, setQuery] = useState('');

  // Keyboard shortcut listener for Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(true); // toggle open
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const COMMANDS = [
    { id: 'tab-overview', label: 'Go to Dashboard Overview', icon: LayoutDashboard, action: () => onNavigateTab('overview') },
    { id: 'tab-budget', label: 'Go to Budget Planner & Variance Calculator', icon: DollarSign, action: () => onNavigateTab('budget') },
    { id: 'tab-timeline', label: 'Go to Precision Timeline & Run-Sheet', icon: Clock, action: () => onNavigateTab('timeline') },
    { id: 'tab-guests', label: 'Go to Guest Roster & RSVPs', icon: Users, action: () => onNavigateTab('guests') },
    { id: 'tab-weather', label: 'Go to Weather Contingency & Plan B Advisor', icon: CloudRain, action: () => onNavigateTab('weather') },
    { id: 'tab-vendors', label: 'Go to Vendor Hub & RFP Generator', icon: ShieldCheck, action: () => onNavigateTab('vendors') },
    { id: 'tab-creative', label: 'Go to Creative Studio (Colors, Menus, Speeches)', icon: Sparkles, action: () => onNavigateTab('creative') },
    { id: 'cmd-copilot', label: 'Open 24/7 AI Event Copilot', icon: Bot, action: onOpenCopilot },
    { id: 'cmd-wizard', label: 'Launch Autonomous Event Wizard', icon: Sparkles, action: onOpenWizard },
    { id: 'cmd-export', label: 'Print or Export Event Dossier / Calendar', icon: Printer, action: onOpenExport },
    { id: 'cmd-theme', label: `Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`, icon: theme === 'dark' ? Sun : Moon, action: onToggleTheme },
    { id: 'cmd-settings', label: 'Open Settings & Gemini API Configuration', icon: Settings, action: onOpenSettings },
  ];

  const filtered = COMMANDS.filter((cmd) =>
    cmd.label.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Command Palette">
      <div
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '580px', padding: 0, overflow: 'hidden' }}
      >
        {/* Search Input Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '1rem 1.25rem',
            borderBottom: '1px solid var(--border-subtle)',
            background: 'var(--bg-secondary)',
          }}
        >
          <Search size={18} style={{ color: 'var(--gold-primary)' }} />
          <input
            type="text"
            autoFocus
            className="form-input"
            style={{
              border: 'none',
              background: 'transparent',
              padding: 0,
              fontSize: '1.05rem',
              boxShadow: 'none',
            }}
            placeholder="Type a command or jump to module... (Esc to close)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <kbd
            style={{
              fontSize: '0.72rem',
              background: 'rgba(255, 255, 255, 0.08)',
              padding: '0.2rem 0.45rem',
              borderRadius: '4px',
              color: 'var(--text-muted)',
            }}
          >
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div style={{ maxHeight: '340px', overflowY: 'auto', padding: '0.5rem' }}>
          {filtered.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              No commands found matching "{query}".
            </div>
          ) : (
            filtered.map((cmd) => {
              const Icon = cmd.icon;
              return (
                <div
                  key={cmd.id}
                  onClick={() => {
                    cmd.action();
                    onClose();
                  }}
                  className="glass-card-interactive"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    fontSize: '0.92rem',
                    color: 'var(--text-primary)',
                    background: 'transparent',
                    border: '1px solid transparent',
                  }}
                >
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--gold-primary)',
                    }}
                  >
                    <Icon size={16} />
                  </div>
                  <span>{cmd.label}</span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
