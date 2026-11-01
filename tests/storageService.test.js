import { describe, it, expect, beforeEach } from 'vitest';

// Polyfill localStorage for node test runner
const memoryStorage = (() => {
  let store = {};
  return {
    getItem: (key) => (key in store ? store[key] : null),
    setItem: (key, value) => {
      store[key] = String(value);
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

globalThis.localStorage = memoryStorage;

import {
  getStoredEvents,
  saveAllEvents,
  getActiveEvent,
  setActiveEventId,
  updateEvent,
  createNewEvent,
  resetToSampleEvents,
} from '../src/services/storageService.js';

describe('Storage Service & Event State Persistence', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('initializes and seeds sample events when storage is empty', () => {
    const events = getStoredEvents();
    expect(events.length).toBeGreaterThan(0);
    expect(events[0]).toHaveProperty('id');
    expect(events[0]).toHaveProperty('title');
    expect(events[0]).toHaveProperty('budget');
  });

  it('persists and retrieves updated events', () => {
    const events = getStoredEvents();
    const firstEvent = { ...events[0], title: 'Modified Celebration Title' };
    saveAllEvents([firstEvent]);

    const retrieved = getStoredEvents();
    expect(retrieved[0].title).toBe('Modified Celebration Title');
  });

  it('gets and sets active event ID properly', () => {
    const events = getStoredEvents();
    setActiveEventId(events[0].id);
    const active = getActiveEvent();
    expect(active.id).toBe(events[0].id);
  });

  it('updates an existing event while preserving the collection', () => {
    const events = getStoredEvents();
    const target = events[0];
    const updated = updateEvent({ ...target, budget: 99999 });

    expect(updated.budget).toBe(99999);
    const refreshed = getStoredEvents();
    const found = refreshed.find((e) => e.id === target.id);
    expect(found.budget).toBe(99999);
  });

  it('creates a new event and prepends to the events list', () => {
    const initialCount = getStoredEvents().length;
    const created = createNewEvent({
      title: 'Neon Nights Birthday',
      eventType: 'birthday',
      budget: 8000,
      guestCount: 60,
    });

    expect(created.id).toBeDefined();
    expect(created.title).toBe('Neon Nights Birthday');
    expect(getStoredEvents().length).toBe(initialCount + 1);
  });

  it('resets events to standard sample events on demand', () => {
    localStorage.setItem('celebraite_events', JSON.stringify([]));
    const reset = resetToSampleEvents();
    expect(reset.length).toBeGreaterThan(0);
  });
});
