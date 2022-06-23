import { IndiekitError } from "@indiekit/error";

/**
 * Check provided scope(s) satisfies required scope
 *
 * @param {object} providedScope - Provided scope
 * @returns {boolean} True if provided scope includes `create` or `media`
 */
export const checkScope = (providedScope = "media") => {
  const hasScope =
    providedScope.includes("create") || providedScope.includes("media");

  if (hasScope) {
    return true;
  }

  throw IndiekitError.insufficientScope("Insufficient scope", {
    scope: "create media",
  });
};
