const {DateTime} = require('luxon');
const mimetypes = require('mime-types');

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
  const extension = mimetypes.extension(file.mimetype).replace(/jpeg/i, 'jpg');
  return {
    originalname: file.originalname,
    filedate: DateTime.local().toISO(),
    filename: `${basename}.${extension}`,
    fileext: extension
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
 * Returns error information
 *
 * @memberof utils
 * @module error
 * @param {String} id Identifier
 * @param {String} desc Description
 * @returns {Object} Error object
 */
const error = (id, desc) => {
  let code;

  switch (id) {
    case ('not_found'):
      code = 404;
      desc = desc || 'Resource not found';
      break;
    case ('forbidden'):
      code = 403;
      desc = desc || 'User does not have permission to perform request';
      break;
    case ('unauthorized'):
      code = 401;
      desc = desc || 'No access token provided in request';
      break;
    case ('insufficient_scope'):
      code = 401;
      desc = desc || 'Scope of access token does not meet requirements for request';
      break;
    case ('invalid_request'):
      code = 400;
      desc = desc || 'Request is missing required parameter, or there was a problem with value of one of the parameters provided';
      break;
    default:
      id = 'server_error';
      code = 500;
      desc = desc || 'Server error';
  }

  return {
    code,
    body: {
      error: id,
      error_description: desc // eslint-disable-line camelcase
    }
  };
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
 * Removes ‘/’ from beginning and end of string. Useful for constructing paths
 *
 * @memberof utils
 * @exports normalizePath
 * @example normalizePath('/foo/bar/') => 'foo/bar'
 * @param {Object} str String
 * @return {Object} Normalized object
 */
const normalizePath = str => {
  return str.replace(/^\/|\/$/g, '');
};

/**
 * Returns success information
 *
 * @memberof micropub
 * @module response
 * @param {String} id Identifier
 * @param {String} location Location of post
 * @returns {Object} Success object
 */
const success = (id, location) => {
  let code;
  let desc;

  switch (id) {
    case ('create'):
      code = 201;
      desc = `Post created at ${location}`;
      break;
    case ('create_pending'):
      code = 202;
      desc = `Post will be created at ${location}`;
      break;
    case ('update'):
      code = 200;
      desc = `Post updated at ${location}`;
      break;
    case ('update_created'):
      code = 201;
      desc = `Post updated and moved to ${location}`;
      break;
    case ('delete'):
      code = 200;
      desc = `Post deleted from ${location}`;
      break;
    case ('delete_undelete'):
      code = 201;
      desc = `Post undeleted from ${location}`;
      break;
    default:
      code = 200;
      desc = 'Success';
  }

  return {
    code,
    location,
    body: {
      success: id,
      success_description: desc
    }
  };
};

module.exports = {
  createRandomString,
  decodeFormEncodedString,
  deriveFileProperties,
  deriveMediaType,
  error,
  excerptString,
  normalizePath,
  success
};
