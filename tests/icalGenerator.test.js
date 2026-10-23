import { describe, it, expect } from 'vitest';
import { generateIcsCalendar } from '../src/services/icalGenerator.js';

describe('iCalendar (.ics) RFC 5545 Generator', () => {
  const mockEvent = {
    id: 'test-wedding-1',
    title: 'Aarav & Meera Wedding',
    date: '2027-02-14',
    location: 'Jaipur Palace Courtyard',
    dayOfRunSheet: [
      { time: '09:00 AM', title: 'Bridal Prep & Hair', owner: 'Lead Stylist', note: 'Fruit & sparkling water' },
      { time: '04:00 PM', title: 'Sunset Nuptial Vows', owner: 'Priest & Couple', note: 'Ring exchange' },
    ],
  };

  it('generates valid VCALENDAR wrapper tags', () => {
    const ics = generateIcsCalendar(mockEvent);
    expect(ics).toContain('BEGIN:VCALENDAR');
    expect(ics).toContain('VERSION:2.0');
    expect(ics).toContain('END:VCALENDAR');
  });

  it('generates separate VEVENT blocks for each run-sheet item', () => {
    const ics = generateIcsCalendar(mockEvent);
    const eventBlocks = ics.match(/BEGIN:VEVENT/g);
    expect(eventBlocks).toHaveLength(2);
  });

  it('includes proper DTSTART formatting, summary, and location', () => {
    const ics = generateIcsCalendar(mockEvent);
    expect(ics).toContain('SUMMARY:Bridal Prep & Hair');
    expect(ics).toContain('SUMMARY:Sunset Nuptial Vows');
    expect(ics).toContain('LOCATION:Jaipur Palace Courtyard');
    expect(ics).toContain('DTSTART:20270214T');
  });
});
