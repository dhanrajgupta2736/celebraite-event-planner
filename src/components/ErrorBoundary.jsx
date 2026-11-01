import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

/**
 * Production Error Boundary Component
 * Gracefully captures unexpected React runtime errors, displays an accessible
 * recovery screen, and provides a 1-click state reset button.
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log to audit console in development
    if (process.env.NODE_ENV !== 'production') {
      console.error('CelebrAIte Error Boundary caught an exception:', error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          aria-live="assertive"
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            background: 'var(--bg-main, #0B0E14)',
            color: 'var(--text-primary, #F8FAFC)',
            fontFamily: 'var(--font-sans, system-ui, sans-serif)',
          }}
        >
          <div
            className="glass-card"
            style={{
              maxWidth: '520px',
              width: '100%',
              padding: '2.5rem',
              textAlign: 'center',
              border: '1px solid var(--border-subtle, rgba(255,255,255,0.1))',
              borderRadius: '16px',
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(239, 68, 68, 0.15)',
                color: '#EF4444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
              }}
            >
              <AlertTriangle size={32} />
            </div>

            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.75rem' }}>
              Something went sideways
            </h1>

            <p style={{ color: 'var(--text-secondary, #94A3B8)', fontSize: '0.95rem', marginBottom: '1.75rem', lineHeight: 1.6 }}>
              CelebrAIte encountered an unexpected rendering error. Your data is safely stored in local persistence.
            </p>

            <button
              onClick={this.handleReset}
              className="btn btn-primary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.75rem',
                fontSize: '0.95rem',
                cursor: 'pointer',
              }}
            >
              <RotateCcw size={16} />
              <span>Reload CelebrAIte</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
