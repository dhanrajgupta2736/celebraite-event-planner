import { describe, it, expect } from 'vitest';
import { convertCurrency, formatCurrency, CURRENCIES } from '../src/services/currencyEngine.js';

describe('Multi-Currency Engine', () => {
  it('supports major international event currencies', () => {
    expect(CURRENCIES.USD).toBeDefined();
    expect(CURRENCIES.INR).toBeDefined();
    expect(CURRENCIES.EUR).toBeDefined();
    expect(CURRENCIES.GBP).toBeDefined();
  });

  it('accurately converts base USD to Indian Rupees (INR)', () => {
    const usdAmount = 1000;
    const inrAmount = convertCurrency(usdAmount, 'INR');
    expect(inrAmount).toBe(86500); // 1000 * 86.5
  });

  it('accurately converts base USD to Euro (EUR)', () => {
    const usdAmount = 10000;
    const eurAmount = convertCurrency(usdAmount, 'EUR');
    expect(eurAmount).toBe(9200); // 10000 * 0.92
  });

  it('formats localized currency with proper symbols', () => {
    const formattedUsd = formatCurrency(5000, 'USD');
    expect(formattedUsd).toContain('$');
    expect(formattedUsd).toContain('5,000');

    const formattedInr = formatCurrency(10000, 'INR');
    expect(formattedInr).toContain('₹');
  });

  it('handles zero and negative amounts without crashing', () => {
    expect(convertCurrency(0, 'USD')).toBe(0);
    expect(convertCurrency(null, 'EUR')).toBe(0);
    expect(formatCurrency(0, 'USD')).toBe('$0');
  });
});
