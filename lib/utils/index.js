const path = require('path');
const _ = require('lodash');
const {DateTime} = require('luxon');
const FileType = require('file-type');

/**
 * Add properties to object
 *
 * @exports addProperties
 * @param {Object} obj Object to update
 * @param {Object} additions Properties to add
 * @return {Object} Updated object
 */
const addProperties = (obj, additions) => {
  for (const key in additions) {
    if (Object.prototype.hasOwnProperty.call(additions, key)) {
      const newValue = additions[key];
      const existingValue = obj[key];

      // If no existing value, add it
      if (!existingValue) {
        obj[key] = newValue;
        return obj;
      }

      // If existing value, add to it
      if (existingValue) {
        const updatedValue = [...existingValue];

        for (const value of newValue) {
          updatedValue.push(value);
        }

        obj = _.set(obj, key, updatedValue);
        return obj;
      }
    }
  }
};

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
 * Delete individual entries for properties of an object
 *
 * @exports deleteEntries
 * @param {Object} obj Object to update
 * @param {Object} deletions Property entries to delete
 * @return {Object} Updated object
 */
const deleteEntries = (obj, deletions) => {
  for (const key in deletions) {
    if (Object.prototype.hasOwnProperty.call(deletions, key)) {
      const valuesToDelete = deletions[key];

      if (!Array.isArray(valuesToDelete)) {
        throw new TypeError(`${key} should be an array`);
      }

      const values = obj[key];
      if (!valuesToDelete || !values) {
        return obj;
      }

      for (const value of valuesToDelete) {
        const index = values.indexOf(value);
        if (index > -1) {
          values.splice(index, 1);
        }

        if (values.length === 0) {
          delete obj[key]; // Delete property if no values remain
        } else {
          obj[key] = values;
        }
      }
    }
  }

  return obj;
};

/**
 * Delete properties of an object
 *
 * @exports deleteProperties
 * @param {Object} obj Object to update
 * @param {Array} deletions Properties to delete
 * @return {Object} Updated object
 */
const deleteProperties = (obj, deletions) => {
  for (const key of deletions) {
    delete obj[key];
  }

  return obj;
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
const deriveFileProperties = async file => {
  const basename = createRandomString();
  const {ext} = await FileType.fromBuffer(file.buffer);
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
const deriveMediaType = async file => {
  const {mime} = await FileType.fromBuffer(file.buffer);

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
 * Derive a permalink (by combining publication URL, that may include a path,
 * with the path to a post or file.
 *
 * @exports derivePermalink
 * @example derivePermalink('http://foo.bar/baz', '/qux/quux') =>
 *   'http://foo.bar/baz/qux/quux'
 * @param {Object} url URL
 * @param {Object} pathname permalink path
 * @return {String} Returns either 'photo', 'video' or audio
 */
const derivePermalink = (url, pathname) => {
  url = new URL(url);
  let permalink = path.join(url.pathname, pathname);
  permalink = new URL(permalink, url);

  return permalink.href;
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

/**
 * Replace entries of a property. If property doesn’t exist, create it.
 *
 * @exports replaceEntries
 * @param {Object} obj Object to update
 * @param {Object} replacements Properties to replace
 * @return {Object} Updated object
 */
const replaceEntries = (obj, replacements) => {
  for (const key in replacements) {
    if (Object.prototype.hasOwnProperty.call(replacements, key)) {
      const value = replacements[key];
      obj = _.set(obj, key, value);
    }
  }

  return obj;
};

module.exports = {
  addProperties,
  cleanArray,
  cleanObject,
  createRandomString,
  decodeFormEncodedString,
  deleteEntries,
  deleteProperties,
  deriveFileProperties,
  deriveMediaType,
  derivePermalink,
  excerptString,
  normalizePath,
  replaceEntries
};
