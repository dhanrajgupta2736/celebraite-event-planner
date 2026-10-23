import { describe, it, expect } from 'vitest';
import { generateContingencyPlan, WEATHER_CONDITIONS } from '../src/services/weatherContingencyEngine.js';

describe('Weather Contingency & Emergency Plan B Engine', () => {
  it('defines all key meteorological threats for outdoor celebrations', () => {
    expect(WEATHER_CONDITIONS.RAIN).toBeDefined();
    expect(WEATHER_CONDITIONS.HEAT).toBeDefined();
    expect(WEATHER_CONDITIONS.WIND).toBeDefined();
  });

  it('generates high-priority actions for rain downpour', () => {
    const rainPlan = generateContingencyPlan('wedding', 'RAIN');
    expect(rainPlan.weather).toContain('Rain');
    expect(rainPlan.actionItems.length).toBeGreaterThanOrEqual(4);

    const titles = rainPlan.actionItems.map((a) => a.title.toLowerCase());
    const hasTent = titles.some((t) => t.includes('tent') || t.includes('marquee'));
    const hasAV = titles.some((t) => t.includes('audio') || t.includes('power'));

    expect(hasTent).toBe(true);
    expect(hasAV).toBe(true);
  });

  it('generates heatwave contingency with cooling protocols', () => {
    const heatPlan = generateContingencyPlan('birthday', 'HEAT');
    expect(heatPlan.weather).toContain('Heatwave');

    const titles = heatPlan.actionItems.map((a) => a.title.toLowerCase());
    const hasCooling = titles.some((t) => t.includes('fan') || t.includes('cool'));
    const hasHydration = titles.some((t) => t.includes('hydration') || t.includes('water'));

    expect(hasCooling).toBe(true);
    expect(hasHydration).toBe(true);
  });

  it('provides actionable run-sheet shift notes for planners', () => {
    const plan = generateContingencyPlan('community', 'WIND');
    expect(plan.runSheetShiftNotes.length).toBeGreaterThan(15);
  });
});
