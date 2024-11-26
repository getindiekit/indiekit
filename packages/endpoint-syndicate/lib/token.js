import process from "node:process";

import { IndiekitError } from "@indiekit/error";
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
    process.env.SECRET,
    {
      expiresIn: "10m",
    },
  );

/**
 * Verify that token provided by signature was issued by Netlify
 * @param {string} signature - JSON Web Signature
 * @returns {object} JSON Web Token
 * @see {@link https://docs.netlify.com/site-deploys/notifications/#payload-signature}
 */
export const verifyToken = (signature) =>
  jwt.verify(signature, process.env.WEBHOOK_SECRET, {
    algorithms: ["HS256"],
    issuer: ["netlify"],
  });
