import process from "node:process";

import { IndiekitError } from "@indiekit/error";

/**
 * Get secret from an environment variable
 * @param {string} name - Environment variable name
 * @returns {string} Secret
 * @throws {IndiekitError} Secret not set
 */
export const getSecret = (name) => {
  const secret = process.env[name];

  if (!secret) {
    throw IndiekitError.notImplemented(
      `No secret. Set the \`${name}\` environment variable.`,
    );
  }

  return secret;
};
