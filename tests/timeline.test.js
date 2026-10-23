import { describe, it, expect } from 'vitest';
import {
  generateMacroTimeline,
  generateDayOfRunSheet,
} from '../src/services/fallbackEngine.js';

describe('Timeline & Run-Sheet Generation Engine', () => {
  it('generates chronological milestone phases for wedding planning', () => {
    const milestones = generateMacroTimeline('wedding');
    expect(milestones.length).toBeGreaterThanOrEqual(5);

    const phases = milestones.map((m) => m.phase);
    expect(phases).toContain('6-9 Months Out');
    expect(phases).toContain('Day of Wedding');

    milestones.forEach((m) => {
      expect(m.tasks.length).toBeGreaterThan(0);
      expect(typeof m.completed).toBe('boolean');
    });
  });

  it('generates an hour-by-hour day-of schedule with owners and notes', () => {
    const runSheet = generateDayOfRunSheet('wedding');
    expect(runSheet.length).toBeGreaterThanOrEqual(8);

    const morningPrep = runSheet[0];
    expect(morningPrep.time).toBeDefined();
    expect(morningPrep.owner).toBeDefined();
    expect(morningPrep.note).toBeDefined();

    // Verify day progression
    const times = runSheet.map((r) => r.time);
    expect(times[0]).toContain('AM');
    expect(times[times.length - 1]).toContain('PM');
  });

  it('supports birthday milestone schedules with high-energy party segments', () => {
    const birthdayRunSheet = generateDayOfRunSheet('birthday');
    expect(birthdayRunSheet.length).toBeGreaterThanOrEqual(5);

    const titles = birthdayRunSheet.map((b) => b.title.toLowerCase());
    const hasCake = titles.some((t) => t.includes('cake'));
    const hasParty = titles.some((t) => t.includes('dance') || t.includes('dj'));
    expect(hasCake).toBe(true);
    expect(hasParty).toBe(true);
  });
});
