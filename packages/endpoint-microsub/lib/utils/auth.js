/**
 * Authentication utilities for Microsub
 * @module utils/auth
 */

/**
 * Get the user ID from request context
 *
 * In Indiekit, the userId can come from:
 * 1. request.session.userId (if explicitly set)
 * 2. request.session.me (from token introspection)
 * 3. application.publication.me (single-user fallback)
 * @param {object} request - Express request
 * @returns {string} User ID
 */
export function getUserId(request) {
  // Check session for explicit userId
  if (request.session?.userId) {
    return request.session.userId;
  }

  // Check session for me URL from token introspection
  if (request.session?.me) {
    return request.session.me;
  }

  // Fall back to publication me URL (single-user mode)
  const { application } = request.app.locals;
  if (application?.publication?.me) {
    return application.publication.me;
  }

  // Final fallback: use "default" as user ID for single-user instances
  return "default";
}
