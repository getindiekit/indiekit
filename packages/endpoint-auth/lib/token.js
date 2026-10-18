import { getSecret } from "@indiekit/util";
import jwt from "jsonwebtoken";

/**
 * Sign token
 * @param {object} payload - JSON Web Token payload
 * @param {SignOptions["expiresIn"]} [expiresIn] - Token expiry, i.e. `10m`
 * @returns {string} Signed JSON Web Token
 */
export const signToken = (payload, expiresIn = "10m") =>
  jwt.sign(payload, getSecret("SECRET"), { expiresIn });

/**
 * Verify signed token
 * @param {string} code - Signed JSON Web Token
 * @returns {JwtPayload} JSON Web Token payload
 * @throws {JsonWebTokenError} Token invalid
 */
export const verifyToken = (code) => {
  const payload = jwt.verify(code, getSecret("SECRET"));

  // Indiekit only signs tokens with an object payload
  if (typeof payload === "string") {
    throw new jwt.JsonWebTokenError("Token payload is not an object");
  }

  return payload;
};

/**
 * @import { JsonWebTokenError, JwtPayload, SignOptions } from "jsonwebtoken"
 */
