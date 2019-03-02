const path = require('path');
const {DateTime} = require('luxon');

/**
 * Common utility functions.
 *
 * @module utils
 */

/**
 * Generates random alpha-numeric string, 5 characters long
 *
 * @return {Object} Alpha-numeric string
 */
const createRandomString = () => {
  return (Number(new Date())).toString(36).slice(-5);
};

/**
 * Derives additional file name properties
 *
 * @param {Object} file Original file object
 * @return {Object} File properties
 */
const deriveFileProperties = file => {
  const filedate = DateTime.local().toISO();
  const fileext = path.extname(file.originalname);
  const filename = `${createRandomString()}${fileext}`;
  return {
    originalname: file.originalname,
    filedate,
    filename,
    fileext
  };
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
  createRandomString,
  decodeFormEncodedString,
  deriveFileProperties,
  excerptString,
  normalizePath
};
