import "dotenv/config.js"; // Load process.env.SECRET for signing token
import { signToken } from "@indiekit/endpoint-auth/lib/token.js";

/**
 * Generate access token for testing
 * @param {object} [options] - Options
 * @param {boolean} [options.invalid] - Invalidate token
 * @param {string} [options.me] - Publication URL
 * @param {string} [options.scope] - Permissions scope
 * @returns {object} Access token
 */
export const testToken = (options = {}) => {
  const expiresIn = options?.invalid ? "0s" : "10m";
  const me = options?.me || "https://website.example";
  const scope = options?.scope || "create update delete media";

  return signToken(
    {
      client_id: "https://test.server",
      me,
      scope,
    },
    expiresIn
  );
};
