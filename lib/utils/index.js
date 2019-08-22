const _ = require('lodash');
const {DateTime} = require('luxon');
const fileType = require('file-type');

/**
 * Remove falsey values if provided object is an array.
 *
 * @exports cleanArray
 * @param {Object} obj Object containing array to be cleaned
 * @return {Array|Object} Cleaned array, else original object
 */
const cleanArray = obj => _.isArray(obj) ? _.compact(obj) : obj;

/**
 * Recursively remove empty, null and falsy values from an object.
 * Adapted from Ori Drori’s answer on Stack Overflow
 * https://stackoverflow.com/a/54186837
 *
 * @exports cleanObject
 * @param {Object} obj Object to clean
 * @return {Object} Cleaned object
 */
const cleanObject = obj => _.transform(obj, (prop, value, key) => {
  const isObject = _.isObject(value);
  const val = isObject ? cleanArray(cleanObject(value)) : value;
  const keep = isObject ? !_.isEmpty(val) : Boolean(val);

  if (keep) {
    prop[key] = val;
  }
});

/**
 * Generate random alpha-numeric string, 5 characters long.
 *
 * @exports createRandomString
 * @example createRandomString() => 'b3dog'
 * @return {Object} Alpha-numeric string
 */
const createRandomString = () => {
  return (Number(new Date())).toString(36).slice(-5);
};

/**
 * Derive additional file name properties.
 *
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
 * Derive media type and returns equivalent IndieWeb post type.
 *
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

  return null;
};

/**
 * Decode form-encoded string.
 *
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
 * Get first n words from a string.
 *
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

  return null;
};

/**
 * Remove ‘/’ from beginning and end of string. Useful for constructing paths.
 *
 * @exports normalizePath
 * @example normalizePath('/foo/bar/') => 'foo/bar'
 * @param {String} str Path to normalize
 * @return {String} Normalized path
 */
const normalizePath = str => {
  return str.replace(/^\/|\/$/g, '');
};

module.exports = {
  cleanArray,
  cleanObject,
  createRandomString,
  decodeFormEncodedString,
  deriveFileProperties,
  deriveMediaType,
  excerptString,
  normalizePath
};
