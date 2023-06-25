/**
 * Check provided scope(s) satisfies required scope
 * @param {string} scope - Provided scope (space separated)
 * @param {string} [action] - Required action
 * @returns {boolean} `true` if provided scope includes action
 */
export const checkScope = (scope, action = "media") => {
  // Default scope request is `create`
  if (!scope) {
    scope = "create";
  }

  // Check for scope matching desired action
  let hasScope = scope.includes(action);

  // `create` scope encompasses `media` scope
  if (scope === "create" && action === "media") {
    hasScope = true;
  }

  return hasScope;
};
