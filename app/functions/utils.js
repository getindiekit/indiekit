/**
 * Common utility functions.
 *
 * @module functions/utils
 */

/**
 * Decodes form-encoded string
 *
 * @example decodeFormEncodedString('foo+bar') => 'foo bar'
 * @example decodeFormEncodedString('http%3A%2F%2Ffoo.bar') => 'http://foo.bar'
 * @param {String} string String to decode
 * @return {String} Decoded string
 */
const decodeFormEncodedString = string => {
  if (typeof string === 'string') {
    string = string.replace(/\+/g, '%20');
    string = decodeURIComponent(string);
  }

  return string;
};

/**
 * Removes empty keys from an object
 *
 * @param {Object} object Object with empty strings
 * @return {Object} Sanitized object
 */
const removeEmptyObjectKeys = object => {
  for (const key in object) {
    if (!object[key] || typeof object[key] !== 'object') {
      continue;
    }

    removeEmptyObjectKeys(object[key]);

    if (Object.keys(object[key]).length === 0) {
      delete object[key];
    }
  }

  return object;
};

/**
 * Removes / from beginning and end of strings, useful for constructing paths
 *
 * @example normalizePath('/foo/bar/') => 'foo/bar'
 * @param {Object} string String
 * @return {Object} Normalized object
 */
const normalizePath = string => {
  return string.replace(/^\/|\/$/g, '');
};

module.exports = {
  decodeFormEncodedString,
  removeEmptyObjectKeys,
  normalizePath
};
