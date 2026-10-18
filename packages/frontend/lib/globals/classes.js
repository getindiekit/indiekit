/**
 * Generate space-separated list of class names
 * @param {string} baseClass - Base class name
 * @param {object} [options] - Component options
 * @param {string} [options.classes] - Additional class names
 * @param {unknown} [options.errorMessage] - Error message, if any
 * @returns {string} Space-separated list of class names
 */
export const classes = (baseClass, options = {}) => {
  const classes = [baseClass];

  if (options.errorMessage) {
    classes.push(`${baseClass}--error`);
  }

  if (options.classes) {
    classes.push(options.classes);
  }

  return classes.join(" ");
};
