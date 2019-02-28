/**
 * Common utility functions.
 *
 * @module utils
 */

/**
 * Capitalizes first letter of a string
 *
 * @example capitalizeFirstLetter('foo bar') => 'Foo bar'
 * @param {String} string String to capitalize
 * @return {String} Capitalized string
 */
const capitalizeFirstLetter = string => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

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
    return decodeURIComponent(string);
  }

  return false;
};

/**
 * Gets first n words from a string
 *
 * @example excerptString('Foo bar baz', 2) => 'Foo bar'
 * @param {String} string String to excerpt
 * @param {Number} n Max number of words
 * @return {String} Excerpt
 */
const excerptString = (string, n) => {
  if (typeof string === 'string') {
    string = string.split(/\s+/).slice(0, n).join(' ');
    return string;
  }
};

/**
 * Removes empty keys from an object
 *
 * @example removeEmptyObjectKeys({
 *   foo: 'bar',
 *   baz: {
 *     qux: {
 *       quux: ''
 *     }
 *   }
 * }) => '{foo: bar}'
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
 * Removes ‘/’ from beginning and end of string. Useful for constructing paths
 *
 * @example normalizePath('/foo/bar/') => 'foo/bar'
 * @param {Object} string String
 * @return {Object} Normalized object
 */
const normalizePath = string => {
  return string.replace(/^\/|\/$/g, '');
};

module.exports = {
  capitalizeFirstLetter,
  decodeFormEncodedString,
  excerptString,
  removeEmptyObjectKeys,
  normalizePath
};
