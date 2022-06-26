import { IndiekitError } from "@indiekit/error";

/**
 * Check provided scope(s) satisfies required scope
 *
 * @param {object} providedScope - Provided scope
 * @param {string} requiredScope - Required scope
 * @returns {boolean} True if provided scope includes requiredScope
 */
export const checkScope = (providedScope, requiredScope) => {
  if (!providedScope) {
    providedScope = "create";
  }

  if (!requiredScope) {
    requiredScope = "create";
  }

  let hasScope = providedScope.includes(requiredScope);

  // Handle deprecated `post` scope
  if (!hasScope && requiredScope === "create") {
    hasScope = providedScope.includes("post");
  }

  // Handle `undelete` scope
  if (!hasScope && requiredScope === "undelete") {
    hasScope = providedScope.includes("create");
  }

  if (hasScope) {
    return true;
  }

  throw IndiekitError.insufficientScope("Insufficient scope", {
    scope: requiredScope,
  });
};
