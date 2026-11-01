/**
 * Security Guard Module - CelebrAIte
 * Provides defense-in-depth for AI interactions, input sanitization,
 * prompt injection filtering, and rate limiting.
 */

// Prompt injection patterns to detect and neutralize
const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?(previous|prior|above)\s+(instructions|prompts|rules)/i,
  /system\s+override/i,
  /you\s+are\s+now\s+(unrestricted|jailbroken|dan|evil)/i,
  /<script[\s\S]*?>[\s\S]*?<\/script>/gi,
  /javascript:/gi,
  /drop\s+table/i,
  /format\s+c:/i,
  /reveal\s+(your\s+)?(system\s+prompt|api\s*key|hidden\s+token)/i,
];

/**
 * Sanitizes user input string against HTML tags, scripts, and dangerous chars.
 * @param {string} input - Raw text from user
 * @param {number} maxLength - Maximum allowable length
 * @returns {string} - Clean, safe string
 */
export function sanitizeInput(input, maxLength = 2000) {
  if (typeof input !== 'string') return '';
  
  // Truncate length
  let clean = input.slice(0, maxLength);

  // Strip dangerous HTML tags
  clean = clean.replace(/<[^>]*>?/gm, '');

  // Escape special characters for safe UI rendering
  clean = clean
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

  return clean.trim();
}

/**
 * Unescapes sanitized text for clean AI prompt processing
 */
export function cleanForPrompt(input) {
  if (typeof input !== 'string') return '';
  return input
    .replace(/<[^>]*>?/gm, '')
    .split('')
    .filter((ch) => {
      const code = ch.charCodeAt(0);
      return (code >= 32 && code !== 127) || code === 9 || code === 10 || code === 13;
    })
    .join('')
    .trim();
}

/**
 * Analyzes input for adversarial prompt injection attempts.
 * @param {string} promptText
 * @returns {{ isSafe: boolean, flagReason: string | null }}
 */
export function evaluatePromptSafety(promptText) {
  if (!promptText || typeof promptText !== 'string') {
    return { isSafe: true, flagReason: null };
  }

  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(promptText)) {
      return {
        isSafe: false,
        flagReason: 'Potential prompt injection or policy violation detected. Request sanitized.',
      };
    }
  }

  return { isSafe: true, flagReason: null };
}

/**
 * Validates whether an API key matches expected Google Gemini API key format
 * @param {string} key
 * @returns {boolean}
 */
export function isValidGeminiKey(key) {
  if (!key || typeof key !== 'string') return false;
  const trimmed = key.trim();
  // Typical Google API keys are alphanumeric, underscores/dashes, length 30-60
  return trimmed.length >= 25 && /^[A-Za-z0-9_-]+$/.test(trimmed);
}

/**
 * Simple in-memory sliding window rate limiter
 */
class RateLimiter {
  constructor(maxCalls = 15, windowMs = 60000) {
    this.maxCalls = maxCalls;
    this.windowMs = windowMs;
    this.timestamps = [];
  }

  canMakeCall() {
    const now = Date.now();
    this.timestamps = this.timestamps.filter(t => now - t < this.windowMs);
    if (this.timestamps.length >= this.maxCalls) {
      return false;
    }
    this.timestamps.push(now);
    return true;
  }

  getRemainingTimeMs() {
    if (this.timestamps.length === 0) return 0;
    const oldest = this.timestamps[0];
    const now = Date.now();
    return Math.max(0, this.windowMs - (now - oldest));
  }
}

export const aiRateLimiter = new RateLimiter(20, 60000);

/**
 * Deeply sanitizes an object, stripping prototype pollution vectors and escaping HTML strings.
 * @param {unknown} data - Untrusted data structure
 * @returns {unknown} - Deeply sanitized structure
 */
export function sanitizeObject(data) {
  if (data === null || data === undefined) return data;
  if (typeof data === 'string') return sanitizeInput(data);
  if (typeof data !== 'object') return data;
  if (Array.isArray(data)) return data.map(sanitizeObject);

  const clean = {};
  for (const [key, value] of Object.entries(data)) {
    if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
      continue; // neutralize prototype pollution
    }
    clean[key] = sanitizeObject(value);
  }
  return clean;
}

/**
 * Strict validator for imported event dossiers.
 * @param {unknown} event - Untrusted event object
 * @returns {{ valid: boolean, reason?: string }}
 */
export function validateEventSchema(event) {
  if (!event || typeof event !== 'object' || Array.isArray(event)) {
    return { valid: false, reason: 'Event payload must be a non-null object' };
  }
  if (!event.id || typeof event.id !== 'string') {
    return { valid: false, reason: 'Missing or invalid event id' };
  }
  if (!event.title || typeof event.title !== 'string') {
    return { valid: false, reason: 'Missing or invalid event title' };
  }
  if (typeof event.budget !== 'number' || Number.isNaN(event.budget) || event.budget < 0) {
    return { valid: false, reason: 'Event budget must be a positive number' };
  }
  return { valid: true };
}
