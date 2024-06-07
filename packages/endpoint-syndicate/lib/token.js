import process from "node:process";
import { IndiekitError } from "@indiekit/error";
import makeDebug from "debug";
import jwt from "jsonwebtoken";

const debug = makeDebug(`indiekit:endpoint-syndicate:token`);

export const findBearerToken = (request) => {
  debug(`find bearer token`);
  if (request.headers?.["x-webhook-signature"]) {
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
export const signToken = (verifiedToken, url) => {
  const expiresIn = "10m";
  const scope = "update";
  debug(`sign token %O`, { scope, expiresIn });

  return jwt.sign({ me: url, scope }, process.env.SECRET, {
    expiresIn,
  });
};

/**
 * Verify that token provided by signature was issued by Netlify
 * @param {string} signature - JSON Web Signature
 * @returns {object} JSON Web Token
 * @see {@link https://docs.netlify.com/site-deploys/notifications/#payload-signature}
 */
export const verifyToken = (signature) => {
  const issuer = ["netlify"];
  debug(`verify token %O`, { issuer });

  return jwt.verify(signature, process.env.WEBHOOK_SECRET, {
    algorithms: ["HS256"],
    issuer,
  });
};
