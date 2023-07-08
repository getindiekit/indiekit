/**
 * Delay a function
 * @param {Function} callback - Function to delay
 * @param {number} delay - Delay, in milliseconds
 * @returns {Function} Debounced function
 * @see {@link https://www.joshwcomeau.com/snippets/javascript/debounce/}
 */
export const debounce = (callback, delay) => {
  let timeoutId;

  return (...arguments_) => {
    window.clearTimeout(timeoutId);

    timeoutId = window.setTimeout(() => {
      callback(...arguments_);
    }, delay);
  };
};
