import { describe, it, expect } from 'vitest';
import ErrorBoundary from '../src/components/ErrorBoundary.jsx';

describe('Production ErrorBoundary Component', () => {
  it('updates state to hasError when getDerivedStateFromError is triggered', () => {
    const error = new Error('Test component crash');
    const state = ErrorBoundary.getDerivedStateFromError(error);

    expect(state.hasError).toBe(true);
    expect(state.error).toBe(error);
  });
});

