/**
 * UID generation utilities for Microsub
 * @module utils/uid
 */

import { randomBytes } from "node:crypto";

import { randomString } from "@indiekit/util";

/**
 * Generate a random channel UID
 * @returns {string} 24-character random string
 */
export function generateChannelUid() {
  return randomString(24);
}

/**
 * Generate a UUIDv7 whose timestamp is the given date
 *
 * Timeline items are listed and paged by this identifier, the same way posts
 * are paged by their uid. Node's `randomUUIDv7()` stamps the current time;
 * an item is ordered by when it was published, so the stamp is set here.
 * @param {Date} date - Time to encode in the first 48 bits
 * @returns {string} UUIDv7
 */
export function uuidv7At(date) {
  const bytes = randomBytes(16);
  bytes.writeUIntBE(date.getTime(), 0, 6);
  bytes[6] = (bytes[6] & 0x0f) | 0x70; // version 7
  bytes[8] = (bytes[8] & 0x3f) | 0x80; // variant 10
  const hex = bytes.toString("hex");

  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}
