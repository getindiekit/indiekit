/**
 * Generate space-separated list of class names
 * @param {string} baseClass - Base class name
 * @param {object} [options] - Component options
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
