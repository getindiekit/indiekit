const {DateTime} = require('luxon');
const fileType = require('file-type');

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
  const {ext} = fileType(file.buffer);
  return {
    originalname: file.originalname,
    filedate: DateTime.local().toISO(),
    filename: `${basename}.${ext}`,
    fileext: ext
  };
};

/**
 * Derives media type and returns equivalent IndieWeb post type
 *
 * @memberof utils
 * @exports deriveMediaType
 * @example deriveMediaType('brighton-pier.jpg') => 'photo'
 * @param {Object} file Original file object
 * @return {String} Returns either 'photo', 'video' or audio
 */
const deriveMediaType = file => {
  const {mime} = fileType(file.buffer);

  if (mime.includes('audio/')) {
    return 'audio';
  }

  if (mime.includes('image/')) {
    return 'photo';
  }

  if (mime.includes('video/')) {
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
 * @param {String} str String to decode
 * @return {String} Decoded string
 */
const decodeFormEncodedString = str => {
  if (typeof str === 'string') {
    str = str.replace(/\+/g, '%20');
    return decodeURIComponent(str);
  }

  return false;
};

/**
 * Gets first n words from a string
 *
 * @memberof utils
 * @exports excerptString
 * @example excerptString('Foo bar baz', 2) => 'Foo bar'
 * @param {String} str String to excerpt
 * @param {Number} n Max number of words
 * @return {String} Excerpt
 */
const excerptString = (str, n) => {
  if (typeof str === 'string') {
    str = str.split(/\s+/).slice(0, n).join(' ');
    return str;
  }
};

/**
 * Checks if string is valid URL
 *
 * @memberof utils
 * @exports isValidUrl
 * @example isValidUrl('https://example.com') => true
 * @param {Object} str String
 * @return {Boolean} True or false
 */
const isValidUrl = str => {
  try {
    if (new URL(str)) {
      return true;
    }
  } catch (_) {
    return false;
  }
};

/**
 * Removes ‘/’ from beginning and end of string. Useful for constructing paths
 *
 * @memberof utils
 * @exports normalizePath
 * @example normalizePath('/foo/bar/') => 'foo/bar'
 * @param {String} str Path to normalize
 * @return {String} Normalized path
 */
const normalizePath = str => {
  return str.replace(/^\/|\/$/g, '');
};

/**
 * Removes protocol from beginning of URL
 *
 * @memberof utils
 * @exports normalizeUrl
 * @example normalizeUrl('http://foo.bar/baz') => 'foo.bar/baz'
 * @example normalizeUrl('https://foo.bar/baz') => 'foo.bar/baz'
 * @param {String} str URL to normalize
 * @return {String} Normalized URL
 */
const normalizeUrl = str => {
  const url = new URL(str).href;
  return url.replace(/(^\w+:|^)\/\//, '');
};

module.exports = {
  createRandomString,
  decodeFormEncodedString,
  deriveFileProperties,
  deriveMediaType,
  excerptString,
  isValidUrl,
  normalizePath,
  normalizeUrl
};
