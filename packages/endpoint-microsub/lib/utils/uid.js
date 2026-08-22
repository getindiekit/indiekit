/**
 * UID generation utilities for Microsub
 * @module utils/uid
 */

import { randomString } from "@indiekit/util";

/**
 * Generate a random channel UID
 * @returns {string} 24-character random string
 */
export function generateChannelUid() {
  return randomString(24);
}
