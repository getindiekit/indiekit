/**
 * UID generation utilities for Microsub
 * @module utils/uid
 */

/**
 * Generate a random channel UID
 * @returns {string} 24-character random string
 */
export function generateChannelUid() {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let index = 0; index < 24; index++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
