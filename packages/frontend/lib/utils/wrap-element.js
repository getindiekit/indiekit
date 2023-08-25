/**
 * Wrap element with another
 * @param {HTMLElement} $element - Element to wrap
 * @param {HTMLElement} $wrapper - Element to wrap with
 */
export const wrapElement = ($element, $wrapper) => {
  if ($element?.parentNode) {
    $element.parentNode.insertBefore($wrapper, $element);
    $wrapper.append($element);
  }
};
