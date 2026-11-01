/**
 * Multi-Currency Engine - CelebrAIte
 * Provides real-time currency switching and locale formatting
 * for USD, EUR, GBP, INR, CAD, AUD.
 */

export const CURRENCIES = {
  USD: { code: 'USD', symbol: '$', rate: 1.0, locale: 'en-US', name: 'US Dollar' },
  INR: { code: 'INR', symbol: '₹', rate: 86.5, locale: 'en-IN', name: 'Indian Rupee' },
  EUR: { code: 'EUR', symbol: '€', rate: 0.92, locale: 'de-DE', name: 'Euro' },
  GBP: { code: 'GBP', symbol: '£', rate: 0.79, locale: 'en-GB', name: 'British Pound' },
  CAD: { code: 'CAD', symbol: 'CA$', rate: 1.38, locale: 'en-CA', name: 'Canadian Dollar' },
  AUD: { code: 'AUD', symbol: 'A$', rate: 1.54, locale: 'en-AU', name: 'Australian Dollar' },
};

/**
 * Converts an amount from base USD to the target currency
 * @param {number} amountInUsd
 * @param {string} targetCurrency
 * @returns {number}
 */
export function convertCurrency(amountInUsd, targetCurrency = 'USD') {
  const curr = CURRENCIES[targetCurrency] || CURRENCIES.USD;
  const num = Number(amountInUsd) || 0;
  return Math.round(num * curr.rate);
}

/**
 * Formats a number into a localized currency string
 * @param {number} amountInUsd
 * @param {string} currencyCode
 * @returns {string}
 */
export function formatCurrency(amountInUsd, currencyCode = 'USD') {
  const curr = CURRENCIES[currencyCode] || CURRENCIES.USD;
  const converted = convertCurrency(amountInUsd, currencyCode);

  try {
    return new Intl.NumberFormat(curr.locale, {
      style: 'currency',
      currency: curr.code,
      maximumFractionDigits: 0,
    }).format(converted);
  } catch {
    return `${curr.symbol}${converted.toLocaleString()}`;
  }
}
