/**
 * Storage Service - CelebrAIte
 * Manages client-side persistence, event switching, JSON import/export,
 * and state hydration with zero external dependencies.
 */

import { SAMPLE_EVENTS } from '../data/sampleEvents.js';

const STORAGE_KEY = 'celebraite_events_store_v1';
const ACTIVE_EVENT_KEY = 'celebraite_active_event_id';

/**
 * Initializes and retrieves all stored events
 */
export function getStoredEvents() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Seed with sample events
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_EVENTS));
      return SAMPLE_EVENTS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : SAMPLE_EVENTS;
  } catch (e) {
    console.error('Error reading localStorage events, falling back to sample events:', e);
    return SAMPLE_EVENTS;
  }
}

/**
 * Saves the entire list of events
 */
export function saveAllEvents(events) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  } catch (e) {
    console.error('Error saving events to localStorage:', e);
  }
}

/**
 * Retrieves the currently active event
 */
export function getActiveEvent() {
  const events = getStoredEvents();
  const activeId = localStorage.getItem(ACTIVE_EVENT_KEY);
  const found = events.find((e) => e.id === activeId);
  return found || events[0];
}

/**
 * Sets the active event ID
 */
export function setActiveEventId(id) {
  localStorage.setItem(ACTIVE_EVENT_KEY, id);
}

/**
 * Updates a specific event by ID
 */
export function updateEvent(updatedEvent) {
  const events = getStoredEvents();
  const index = events.findIndex((e) => e.id === updatedEvent.id);
  if (index !== -1) {
    events[index] = { ...events[index], ...updatedEvent };
  } else {
    events.unshift(updatedEvent);
  }
  saveAllEvents(events);
  return events[index] || updatedEvent;
}

/**
 * Creates and stores a new event
 */
export function createNewEvent(newEvent) {
  const events = getStoredEvents();
  const id = `event-${Date.now()}`;
  const fullEvent = {
    id,
    ...newEvent,
    createdAt: new Date().toISOString(),
  };
  events.unshift(fullEvent);
  saveAllEvents(events);
  setActiveEventId(id);
  return fullEvent;
}

/**
 * Deletes an event by ID
 */
export function deleteEvent(id) {
  let events = getStoredEvents();
  events = events.filter((e) => e.id !== id);
  if (events.length === 0) {
    events = [...SAMPLE_EVENTS];
  }
  saveAllEvents(events);
  setActiveEventId(events[0].id);
  return events;
}

/**
 * Resets all events back to initial high-fidelity samples
 */
export function resetToSampleEvents() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_EVENTS));
  setActiveEventId(SAMPLE_EVENTS[0].id);
  return SAMPLE_EVENTS;
}
