import process from "node:process";

import bcrypt from "bcrypt";

/**
 * Create password hash
 * @param {string} password - Password
 * @returns {Promise<string>} Password hash
 */
export async function createPasswordHash(password) {
  return bcrypt.hash(password, 10);
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

  return bcrypt.compare(password, passwordHash);
}
