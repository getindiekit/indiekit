import { IndiekitError } from "@indiekit/error";
import { getSecret } from "@indiekit/util";
import jwt from "jsonwebtoken";

export const findBearerToken = (request) => {
  if (request.headers?.["x-webhook-signature"] && request.body?.url) {
    const signature = request.headers["x-webhook-signature"];
    const verifiedToken = verifyToken(signature);
    const bearerToken = signToken(verifiedToken, request.body.url);
    return bearerToken;
  }

  if (request.body?.access_token) {
    const bearerToken = request.body.access_token;
    delete request.body.access_token;
    return bearerToken;
  }

  if (request.query?.token) {
    const bearerToken = request.query.token;
    return bearerToken;
  }

  throw IndiekitError.invalidRequest("No bearer token provided by request");
};

/**
 * Generate short-lived bearer token with update scope
 * @param {object} verifiedToken - JSON Web Token
 * @param {string} url - Publication URL
 * @returns {string} Signed JSON Web Token
 */
export const signToken = (verifiedToken, url) =>
  jwt.sign(
    {
      me: url,
      scope: "update",
    },
    getSecret("SECRET"),
    {
      expiresIn: "10m",
    },
  );

/**
 * Verify that token provided by signature was issued by Netlify
 * @param {string} signature - JSON Web Signature
 * @returns {JwtPayload} JSON Web Token payload
 * @throws {JsonWebTokenError} Signature invalid
 * @see {@link https://docs.netlify.com/site-deploys/notifications/#payload-signature}
 */
export const verifyToken = (signature) => {
  const payload = jwt.verify(signature, getSecret("WEBHOOK_SECRET"), {
    algorithms: ["HS256"],
    issuer: ["netlify"],
  });

  // Netlify signs webhooks with an object payload
  if (typeof payload === "string") {
    throw new jwt.JsonWebTokenError("Signature payload is not an object");
  }

  return payload;
};

/**
 * @import { JsonWebTokenError, JwtPayload } from "jsonwebtoken"
 */
