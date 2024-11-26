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
 * Verify password
 * @param {string} password - Password
 * @returns {Promise<boolean>} Password valid
 */
export async function verifyPassword(password) {
  return bcrypt.compare(password, process.env.PASSWORD_SECRET);
}
