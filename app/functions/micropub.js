const {DateTime} = require('luxon');
const slugify = require('slugify');

const utils = require(__basedir + '/app/functions/utils');

/**
 * Convert x-www-form-urlencoded body to Microformats 2 JSON object
 *
 * @param {String} body x-www-form-urlencoded body
 * @return {Object} Microformats 2 JSON object
 *
 */
exports.convertFormEncodedToMf2 = function (body) {
  const reservedProperties = Object.freeze([
    'access_token',
    'h',
    'action',
    'url'
  ]);

  const result = {
    type: body.h ? ['h-' + body.h] : ['h-entry'],
    properties: {},
    mp: {}
  };

  if (body.h) {
    delete body.h;
  }

  for (let key in body) {
    if (Object.hasOwnProperty.call(body, key)) {
      const isReservedProperty = reservedProperties.indexOf(key) !== -1;
      const isExtendedProperty = key.indexOf('mp-') === 0;

      let value = body[key];
      value = utils.decodeFormEncodedString(value);

      if (isReservedProperty) {
        result[key] = value;
      } else {
        let targetProperty;

        if (isExtendedProperty) {
          key = key.substr(3);
          targetProperty = result.mp;
        } else {
          targetProperty = result.properties;
        }

        targetProperty[key] = [].concat(value);
      }
    }
  }

  utils.removeEmptyObjectKeys(result);

  return result;
};

/**
 * Return slugified string
 *
 * @param {String} mf2 Microformats 2 JSON object
 * @param {String} separator Slug sepatator
 * @returns {String} Slugified string
 *
 */
exports.getSlug = function (mf2, separator) {
  let slug;
  const hasSlug = ((mf2 || {}).mp || {}).slug;
  const hasTitle = ((mf2 || {}).properties || {}).name;

  if (hasSlug) {
    slug = mf2.mp.slug[0];
  }

  if (hasTitle) {
    slug = slugify(mf2.properties.name[0], {
      replacement: separator,
      lower: true
    });
  }

  slug = Math.floor(Math.random() * 90000) + 10000;
  return [slug];
};

/**
 * Return ISO formatted date
 *
 * @param {String} mf2 Microformats 2 JSON object
 * @returns {String} ISO formatted date
 *
 */
exports.getDate = function (mf2) {
  try {
    const published = mf2.properties.published[0];
    return new Array(published.toISO());
  } catch (error) {
    return new Array(DateTime.local().toISO());
  }
};

/**
 * Return object containing error data
 *
 * @param {String} error Identifier
 * @returns {Object} Error object
 *
 */
exports.error = function (error) {
  let code;
  let description;

  switch (error) {
    case ('not_supported'):
      code = 404;
      description = 'Request is not currently supported';
      break;
    case ('forbidden'):
      code = 403;
      description = 'User does not have permission to perform request';
      break;
    case ('unauthorized'):
      code = 401;
      description = 'No access token provided in request';
      break;
    case ('insufficient_scope'):
      code = 401;
      description = 'Scope of access token does not meet requirements for request';
      break;
    default:
      code = 400;
      error = 'invalid_request';
      description = 'Request is missing required parameter, or there was a problem with value of one of the parameters provided';
  }

  return {
    code,
    json: {
      error,
      error_description: description
    }
  };
};
