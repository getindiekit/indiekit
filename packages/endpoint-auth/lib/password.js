import crypto from "node:crypto";
import process from "node:process";

/**
 * Create password hash
 *
 * @param {string} password - Password
 * @returns {boolean} Password hash
 */
export function createPasswordHash(password) {
  return crypto
    .createHash("md5")
    .update(password)
    .update(process.env.SECRET)
    .digest("hex");
}

/**
 * Verify password
 *
 * @param {string} password - Password
 * @returns {boolean} Password is valid
 */
export function verifyPassword(password) {
  return createPasswordHash(password) === process.env.PASSWORD_SECRET;
}
