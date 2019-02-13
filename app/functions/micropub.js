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
 * Return error message as a JSON object
 *
 * @param {Object} response HTTP response
 * @param {Strong} error Error identifier
 *
 */
exports.errorResponse = function (response, error) {
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

  response.status(code).json({
    error,
    error_description: description
  });
};
