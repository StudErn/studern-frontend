/**
 * safeRedirect.js
 *
 * Validates a `returnTo` redirect path to prevent Open Redirect attacks.
 *
 * Attack vectors defended against:
 *  - Absolute URLs          e.g. "https://evil.com"
 *  - Protocol-relative URLs e.g. "//evil.com/path"
 *  - Scheme-injection       e.g. "javascript:alert(1)"
 *  - Non-whitelisted paths  e.g. "/admin" or "/control-panel"
 *  - Null / non-string inputs
 *
 * Only paths that:
 *  1. Are strings
 *  2. Start with exactly one "/"
 *  3. Match a known internal route prefix (ALLOWED_PREFIXES)
 * are accepted. Everything else falls back to DEFAULT_REDIRECT.
 */

const DEFAULT_REDIRECT = '/dashboard';

/**
 * Whitelisted path prefixes.
 * Add new public or semi-public destinations here as the app grows.
 */
const ALLOWED_PREFIXES = [
  '/find-jobs',
  '/find-internships',
  '/jobs',
  '/internships',
  '/dashboard',
];

/**
 * Returns a safe internal redirect path from a raw (potentially attacker-
 * controlled) string such as a URL query parameter.
 *
 * @param {string|null|undefined} raw  - The raw returnTo value.
 * @returns {string}                   - A validated path safe to navigate to.
 */
export function getSafeReturnUrl(raw) {
  // Reject non-strings and empty values
  if (!raw || typeof raw !== 'string') return DEFAULT_REDIRECT;

  // Decode any percent-encoding before checking, so "%2F%2Fevil.com" is caught
  let decoded;
  try {
    decoded = decodeURIComponent(raw);
  } catch {
    return DEFAULT_REDIRECT;
  }

  // Must start with a single "/"
  if (!decoded.startsWith('/')) return DEFAULT_REDIRECT;

  // Reject protocol-relative URLs: //evil.com
  if (decoded.startsWith('//')) return DEFAULT_REDIRECT;

  // Reject any embedded scheme (http:, https:, javascript:, data:, etc.)
  // This regex catches `scheme:` anywhere in the string
  if (/[a-zA-Z][a-zA-Z0-9+\-.]*:/.test(decoded)) return DEFAULT_REDIRECT;

  // Whitelist: path must exactly match OR start with an allowed prefix + "/"
  const allowed = ALLOWED_PREFIXES.some(
    (prefix) => decoded === prefix || decoded.startsWith(prefix + '/') || decoded.startsWith(prefix + '?')
  );

  return allowed ? decoded : DEFAULT_REDIRECT;
}
