# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.2.x   | :white_check_mark: |
| 1.0.x   | :white_check_mark: |

## Security & Defense-in-Depth Architecture

CelebrAIte PRO implements rigorous security standards:
- **Client-Side Sanitization:** All user inputs pass through multi-layer HTML entity encoding and tag stripping (`src/services/securityGuard.js`).
- **Prompt Injection Defense:** Regex and pattern-based analysis to detect and neutralize adversarial injection, jailbreaking, and system prompt leakage attempts.
- **Prototype Pollution Prevention:** Deep object recursion guard (`sanitizeObject`) stripping `__proto__`, `constructor`, and `prototype` keys from JSON imports.
- **Rate Limiting:** Sliding-window rate limiter restricting outgoing AI requests to 20 calls/minute.
- **Content Security Policy (CSP):** Strict CSP headers restricting script, font, and connect origins.
- **Zero Secrets Leakage:** API keys are stored solely in user-controlled local storage; zero server-side telemetry or logging.

## Reporting a Vulnerability

If you discover any security issue or vulnerability in CelebrAIte PRO, please report it via GitHub Security Advisories or open an issue labeled `security`. Reports are reviewed within 24 hours.

