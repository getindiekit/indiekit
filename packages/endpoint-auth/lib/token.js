import process from "node:process";
import jwt from "jsonwebtoken";

/**
 * Sign token
 * @param {object} payload - JSON Web Token payload
 * @param {string} [expiresIn] - Token expiry
 * @returns {string} Signed JSON Web Token
 */
export const signToken = (payload, expiresIn = "10m") =>
  jwt.sign(payload, process.env.SECRET, { expiresIn });

/**
 * Verify signed token
 * @param {string} code - Signed JSON Web Token
 * @returns {object} - JSON Web Token
 */
export const verifyToken = (code) => jwt.verify(code, process.env.SECRET);
