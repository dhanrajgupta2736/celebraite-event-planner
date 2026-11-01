/**
 * CelebrAIte PRO - Centralized Domain Constants & Enumerations
 * Enhances maintainability, eliminates magic strings, and formalizes planning models.
 */

/**
 * Supported celebration vertical personas
 * @enum {string}
 */
export const EVENT_VERTICALS = {
  WEDDING: 'wedding',
  BIRTHDAY: 'birthday',
  COMMUNITY: 'community',
  CUSTOM: 'custom',
};

/**
 * Standard guest RSVP response statuses
 * @enum {string}
 */
export const RSVP_STATUSES = {
  ATTENDING: 'Attending',
  PENDING: 'Pending',
  DECLINED: 'Declined',
};

/**
 * Vendor procurement lifecycle stages
 * @enum {string}
 */
export const VENDOR_STATUSES = {
  IN_REVIEW: 'In Review',
  DRAFTING_RFP: 'Drafting RFP',
  DEPOSIT_PAID: 'Deposit Paid',
  CONTRACT_SIGNED: 'Contract Signed',
};

/**
 * Meteorological disruption simulation types
 * @enum {string}
 */
export const WEATHER_DISRUPTIONS = {
  RAIN: 'RAIN',
  HEAT: 'HEAT',
  WIND: 'WIND',
};

/**
 * UI theme configurations
 * @enum {string}
 */
export const UI_THEMES = {
  DARK: 'dark',
  LIGHT: 'light',
};

