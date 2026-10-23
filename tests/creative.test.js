import { describe, it, expect } from 'vitest';
import { generateCreativeSuite } from '../src/services/fallbackEngine.js';

describe('Creative Suite & Generative Styling Engine', () => {
  it('generates a full creative package for weddings', () => {
    const weddingCreative = generateCreativeSuite('wedding', 'Romantic Elegance');
    expect(weddingCreative.theme).toBeDefined();
    expect(weddingCreative.theme.palette.length).toBeGreaterThanOrEqual(4);
    expect(weddingCreative.menu.length).toBeGreaterThanOrEqual(4);
    expect(weddingCreative.activities.length).toBeGreaterThanOrEqual(2);
    expect(weddingCreative.speechTemplate.content.length).toBeGreaterThan(50);
  });

  it('validates HEX color code structure for all generated palette swatches', () => {
    const birthdayCreative = generateCreativeSuite('birthday', 'Neon Synthwave');
    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

    birthdayCreative.theme.palette.forEach((color) => {
      expect(color.name).toBeDefined();
      expect(color.hex).toMatch(hexRegex);
      expect(color.role).toBeDefined();
    });
  });

  it('ensures catering menus include diverse dietary accommodations', () => {
    const communityCreative = generateCreativeSuite('community', 'Eco Festival');
    const dietaries = communityCreative.menu.map((m) => m.dietary);
    const hasVegetarianOrVegan = dietaries.some((d) => d.includes('Veg') || d.includes('Vegan') || d.includes('GF'));
    expect(hasVegetarianOrVegan).toBe(true);
  });
});
