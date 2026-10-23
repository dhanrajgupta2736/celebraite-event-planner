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
    .replace(/[\u0000-\u0008\u000B-\u000C\u000E-\u001F]/g, '') // remove control chars
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
