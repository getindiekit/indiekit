/**
 * @todo Add support for `draft` scope
 */
export const scopes = ["create", "delete", "media", "update"];

/**
 * Get `items` object for checkboxes component
 *
 * @param {string} scope - Selected scope(s)
 * @param {object} response - HTTP response
 * @returns {object} Items for checkboxes component
 */
export function getScopeItems(scope, response) {
  return scopes.map((value) => ({
    text: response.__(`scope.${value}.label`),
    value,
    checked: scope?.includes(value),
  }));
}
