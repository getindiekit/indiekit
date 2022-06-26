/**
 * Check provided scope(s) satisfies required scope
 *
 * @param {object} providedScope - Provided scope
 * @returns {boolean} True if provided scope includes `create` or `media`
 */
export const checkScope = (providedScope = "media") => {
  return providedScope.includes("create") || providedScope.includes("media");
};
