/**
 * Generate space-separated list of class names
 *
 * @param {string} baseClass - Base class name
 * @param {string} [optionalClasses] - List of space-separated class names
 * @returns {string} Space-separated list of class names
 */
export const classes = (baseClass, optionalClasses) => {
  return optionalClasses
    ? [baseClass, ...optionalClasses.split(" ")].join(" ")
    : baseClass;
};
