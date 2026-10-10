/**
 * Timeline limit handling
 * @module utils/pagination
 */

/**
 * Default pagination limit
 */
export const DEFAULT_LIMIT = 20;

/**
 * Maximum pagination limit
 */
export const MAX_LIMIT = 100;

/**
 * Parse and validate limit parameter
 * @param {string|number} [limit] - Requested limit
 * @returns {number} Validated limit
 */
export function parseLimit(limit) {
  const parsed = Math.trunc(Number(limit));
  if (Number.isNaN(parsed) || parsed < 1) {
    return DEFAULT_LIMIT;
  }
  return Math.min(parsed, MAX_LIMIT);
}
