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
 * @memberof utils
 * @exports createRandomString
 * @example createRandomString() => 'b3dog'
 * @return {Object} Alpha-numeric string
 */
const createRandomString = () => {
  return (Number(new Date())).toString(36).slice(-5);
};

/**
 * Derives additional file name properties
 *
 * @memberof utils
 * @exports deriveFileProperties
 * @example deriveFileProperties('brighton-pier.jpg') => {
 *   originalname: 'brighton-pier.jpg',
 *   filedate: '2019-03-03T05:07:09+00:00',
 *   filename: 'ds48s',
 *   fileext: '.jpg'
 * }
 * @param {Object} file Original file object
 * @return {Object} File properties
 */
const deriveFileProperties = file => {
  const basename = createRandomString();
  const filedate = DateTime.local().toISO();
  const fileext = path.extname(file.originalname);
  const filename = `${basename}${fileext}`;
  return {
    originalname: file.originalname,
    filedate,
    filename,
    fileext
  };
};

/**
 * Derives media type and returns equivalent IndieWeb post type
 *
 * @memberof utils
 * @exports deriveMediaType
 * @example deriveMediaType('image/jpeg') => 'photo'
 * @param {Object} mimetype MIME type
 * @return {String} Returns either 'photo', 'video' or audio
 */
const deriveMediaType = mimetype => {
  if (mimetype.includes('audio/')) {
    return 'audio';
  }

  if (mimetype.includes('image/')) {
    return 'photo';
  }

  if (mimetype.includes('video/')) {
    return 'video';
  }
};

/**
 * Decodes form-encoded string
 *
 * @memberof utils
 * @exports decodeFormEncodedString
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
 * @memberof utils
 * @exports excerptString
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
 * @memberof utils
 * @exports normalizePath
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
  deriveMediaType,
  excerptString,
  normalizePath
};
