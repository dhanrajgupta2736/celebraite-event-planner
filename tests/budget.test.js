import { describe, it, expect } from 'vitest';
import { calculateBudgetBreakdown, BUDGET_RATIOS } from '../src/services/fallbackEngine.js';

describe('Budget Planner & Variance Engine', () => {
  it('allocates exactly 100% across all categories for wedding vertical', () => {
    const totalPercentage = BUDGET_RATIOS.wedding.reduce((sum, item) => sum + item.percentage, 0);
    expect(totalPercentage).toBe(100);
  });

  it('allocates exactly 100% across all categories for birthday vertical', () => {
    const totalPercentage = BUDGET_RATIOS.birthday.reduce((sum, item) => sum + item.percentage, 0);
    expect(totalPercentage).toBe(100);
  });

  it('allocates exactly 100% across all categories for community vertical', () => {
    const totalPercentage = BUDGET_RATIOS.community.reduce((sum, item) => sum + item.percentage, 0);
    expect(totalPercentage).toBe(100);
  });

  it('correctly calculates per-guest metrics for a $50,000 budget with 200 guests', () => {
    const breakdown = calculateBudgetBreakdown(50000, 'wedding', 200);
    expect(breakdown.length).toBeGreaterThan(4);

    // Sum of allocated amounts should equal approximately $50,000
    const totalAllocated = breakdown.reduce((sum, item) => sum + item.allocatedAmount, 0);
    expect(Math.abs(totalAllocated - 50000)).toBeLessThanOrEqual(50); // within rounding cents

    // Venue should be the largest allocation
    const venue = breakdown.find((b) => b.category.includes('Venue'));
    expect(venue).toBeDefined();
    expect(venue.allocatedAmount).toBe(19000); // 38% of 50000
    expect(venue.perGuest).toBe(95); // 19000 / 200
  });

  it('handles edge case of zero or negative guest count gracefully without dividing by zero', () => {
    const breakdown = calculateBudgetBreakdown(10000, 'birthday', 0);
    breakdown.forEach((item) => {
      expect(Number.isFinite(item.perGuest)).toBe(true);
      expect(item.perGuest).toBe(0);
    });
  });
});
