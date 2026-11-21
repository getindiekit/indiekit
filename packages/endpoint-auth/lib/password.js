import process from "node:process";

import { hash, compare } from "bcryptjs";

/**
 * Create password hash
 * @param {string} password - Password
 * @returns {Promise<string>} Password hash
 */
export async function createPasswordHash(password) {
  return hash(password, 10);
}

/**
 * Verify password against the hash in `PASSWORD_SECRET`
 * @param {string} password - Password
 * @returns {Promise<boolean>} Password valid
 */
export async function verifyPassword(password) {
  const passwordHash = process.env.PASSWORD_SECRET;

  // With no password set, no password can be valid
  if (!passwordHash) {
    return false;
  }

  return compare(password, passwordHash);
}
