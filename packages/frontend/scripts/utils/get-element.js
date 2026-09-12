/**
 * Get a descendant element, throwing if it is not present
 * @template {Element} T
 * @param {ParentNode} scope - Element to search within
 * @param {string} selector - CSS selector
 * @returns {T} Matching element
 */
export const getElement = (scope, selector) => {
  const element = scope.querySelector(selector);

  if (!element) {
    throw new Error(`No element matching ${selector}`);
  }

  return /** @type {T} */ (element);
};
