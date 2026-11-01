import React, { useState } from 'react';
import {
  Settings,
  ShieldCheck,
  Cpu,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  RotateCcw,
  Eye,
  EyeOff,
} from 'lucide-react';
import { getActiveApiKey, setActiveApiKey } from '../services/geminiService';
import { resetToSampleEvents } from '../services/storageService';

/**
 * Settings & Configuration Modal Component
 * Manages Google Gemini API key persistence, connection diagnostics, and state reset.
 * @param {{ isOpen: boolean, onClose: () => void, onResetEvents: () => void }} props
 * @returns {React.ReactElement | null}
 */
export default function SettingsModal({ isOpen, onClose, onResetEvents }) {
  if (!isOpen) return null;

  const [apiKey, setApiKey] = useState(getActiveApiKey());
  const [showKey, setShowKey] = useState(false);
  const [testStatus, setTestStatus] = useState(null); // { state: 'testing'|'success'|'error', message: '' }
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setActiveApiKey(apiKey);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleTestConnection = async () => {
    setTestStatus({ state: 'testing', message: 'Testing Google Gemini API connection...' });
    const keyToTest = apiKey.trim() || getActiveApiKey();

    if (!keyToTest) {
      setTestStatus({
        state: 'error',
        message: 'No API key entered. Operating in Deterministic Intelligent Fallback mode.',
      });
      return;
    }

    const startTime = performance.now();
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${keyToTest}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'Ping test' }] }],
        }),
      });

      const elapsed = Math.round(performance.now() - startTime);

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson?.error?.message || `HTTP ${res.status}`);
      }

      setTestStatus({
        state: 'success',
        message: `Successfully connected to Gemini 3.8 Flash! (Latency: ${elapsed}ms)`,
      });
    } catch (err) {
      setTestStatus({
        state: 'error',
        message: `Connection failed: ${err.message}. The app will seamlessly use offline intelligence.`,
      });
    }
  };

  const handleResetData = () => {
    if (window.confirm('Reset all event plans back to default benchmark sample events?')) {
      const reset = resetToSampleEvents();
      onResetEvents(reset);
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Settings size={18} style={{ color: 'var(--gold-primary)' }} />
            <h3 style={{ fontSize: '1.25rem' }}>Configuration & AI Credentials</h3>
          </div>
          <button onClick={onClose} className="btn btn-secondary btn-icon" style={{ width: '30px', height: '30px' }}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSave}>
          <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* API Key Configuration */}
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Google Gemini API Key</span>
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: 'var(--gold-light)',
                    fontSize: '0.78rem',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                  }}
                >
                  <span>Get Free API Key</span>
                  <ExternalLink size={12} />
                </a>
              </label>

              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                  type={showKey ? 'text' : 'password'}
                  className="form-input"
                  style={{ paddingRight: '40px' }}
                  placeholder="AIzaSy... or AQ.Ab8..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                  }}
                >
                  {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.4rem' }}>
                Stored locally in your browser. Never committed to version control or third parties.
              </div>
            </div>

            {/* Test Connection Button & Status */}
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <button
                type="button"
                onClick={handleTestConnection}
                className="btn btn-secondary btn-sm"
                id="btn-test-gemini"
              >
                <Cpu size={14} />
                <span>Test Gemini Connection</span>
              </button>

              {savedSuccess && (
                <span style={{ fontSize: '0.82rem', color: 'var(--success)' }}>
                  ✓ Settings saved successfully!
                </span>
              )}
            </div>

            {testStatus && (
              <div
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.84rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background:
                    testStatus.state === 'success'
                      ? 'rgba(16, 185, 129, 0.12)'
                      : testStatus.state === 'error'
                      ? 'rgba(239, 68, 68, 0.12)'
                      : 'rgba(139, 92, 246, 0.12)',
                  border:
                    testStatus.state === 'success'
                      ? '1px solid rgba(16, 185, 129, 0.35)'
                      : testStatus.state === 'error'
                      ? '1px solid rgba(239, 68, 68, 0.35)'
                      : '1px solid rgba(139, 92, 246, 0.35)',
                  color:
                    testStatus.state === 'success'
                      ? '#34d399'
                      : testStatus.state === 'error'
                      ? '#f87171'
                      : '#c4b5fd',
                }}
              >
                {testStatus.state === 'success' ? (
                  <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
                ) : (
                  <AlertCircle size={16} style={{ flexShrink: 0 }} />
                )}
                <span>{testStatus.message}</span>
              </div>
            )}

            {/* Security Guard Architecture Notice */}
            <div
              style={{
                background: 'rgba(212, 175, 55, 0.05)',
                border: '1px solid var(--border-accent)',
                borderRadius: 'var(--radius-md)',
                padding: '0.85rem 1rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.35rem' }}>
                <ShieldCheck size={16} style={{ color: 'var(--gold-primary)' }} />
                <strong style={{ fontSize: '0.88rem', color: 'var(--gold-light)' }}>
                  Security & Responsible AI Architecture
                </strong>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                CelebrAIte implements client-side prompt injection pattern matching, HTML/XSS sanitization, and strict sliding-window rate limiting (20 calls/min) to prevent abuse and protect user data integrity.
              </p>
            </div>

            {/* Reset Data Button */}
            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>Reset Sample Events</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Restore benchmark Wedding, Birthday, and Gala plans.
                </div>
              </div>
              <button
                type="button"
                onClick={handleResetData}
                className="btn btn-secondary btn-sm"
                style={{ color: 'var(--danger)' }}
              >
                <RotateCcw size={14} />
                <span>Reset</span>
              </button>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Close
            </button>
            <button type="submit" className="btn btn-primary" id="btn-save-settings">
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
