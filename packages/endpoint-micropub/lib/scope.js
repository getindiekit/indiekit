/**
 * Check provided scope(s) satisfies required scope
 * @param {string} scope - Provided scope (space separated)
 * @param {string} [action] - Required action
 * @returns {boolean|string} `true` if provided scope includes action,
 *                           `draft` if draft scope, otherwise `false`
 */
export const checkScope = (scope, action = "create") => {
  // Default scope request is `create`
  if (!scope) {
    scope = "create";
  }

  // Undeleting a post is equivalent to creating a post
  if (action === "undelete") {
    action = "create";
  }

  // Check for scope matching desired action
  let hasScope = scope.includes(action);

  // Handle deprecated `post` scope
  if (!hasScope && action === "create") {
    hasScope = scope.includes("post");
  }

  // Check for draft scope
  const draftScope = scope.includes("draft");

  // Can create/update with `draft` scope, but using draft post status
  if (draftScope && (action === "create" || action === "update")) {
    hasScope = "draft";
  }

  return hasScope;
};
