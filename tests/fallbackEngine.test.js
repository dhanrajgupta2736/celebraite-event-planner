import { describe, it, expect } from 'vitest';
import {
  calculateBudgetBreakdown,
  generateMacroTimeline,
  generateDayOfRunSheet,
  generateVendorChecklist,
  generateCreativeSuite,
  BUDGET_RATIOS,
  EVENT_TYPES,
} from '../src/services/fallbackEngine.js';

describe('Deterministic Fallback Generative Engine', () => {
  it('exports valid event types and budget ratio benchmarks', () => {
    expect(EVENT_TYPES.WEDDING).toBe('wedding');
    expect(EVENT_TYPES.BIRTHDAY).toBe('birthday');
    expect(BUDGET_RATIOS.wedding).toBeInstanceOf(Array);
    expect(BUDGET_RATIOS.birthday).toBeInstanceOf(Array);
  });

  it('calculates mathematically balanced budget breakdowns adhering to industry ratios', () => {
    const totalBudget = 50000;
    const items = calculateBudgetBreakdown(totalBudget, 'wedding');
    const allocatedSum = items.reduce((sum, item) => sum + item.allocatedAmount, 0);

    expect(allocatedSum).toBe(totalBudget);
    const venueItem = items.find((i) => i.category.includes('Venue'));
    expect(venueItem.allocatedAmount).toBeGreaterThan(totalBudget * 0.3);
  });

  it('produces milestone phases and day-of run-sheets with chronological ordering', () => {
    const milestones = generateMacroTimeline('wedding');
    expect(milestones.some((m) => m.phase.includes('6-9 Months'))).toBe(true);
    expect(milestones.some((m) => m.phase.includes('Day of'))).toBe(true);

    const runSheet = generateDayOfRunSheet('wedding');
    expect(runSheet.length).toBeGreaterThan(5);
    expect(runSheet[0]).toHaveProperty('time');
    expect(runSheet[0]).toHaveProperty('owner');
  });

  it('produces vendor checklists with contact templates', () => {
    const vendors = generateVendorChecklist('wedding');
    expect(vendors.length).toBeGreaterThan(0);
    expect(vendors[0]).toHaveProperty('rfpTemplate');
  });

  it('generates creative suites for weddings with themes, menus, and speeches', () => {
    const suite = generateCreativeSuite('wedding', 'Vintage Glamour');
    expect(suite.theme.palette.length).toBe(5);
    expect(suite.menu.length).toBeGreaterThanOrEqual(4);
    expect(suite.activities.length).toBeGreaterThan(0);
    expect(suite.speechTemplate.content).toContain('Good evening');
  });

  it('generates creative suites for birthdays and community events', () => {
    const bdaySuite = generateCreativeSuite('birthday');
    expect(bdaySuite.theme.title).toBeDefined();
    expect(bdaySuite.menu.length).toBeGreaterThanOrEqual(3);

    const galaSuite = generateCreativeSuite('community');
    expect(galaSuite.theme.palette.length).toBeGreaterThan(0);
  });
});
