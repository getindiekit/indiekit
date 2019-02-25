const utils = require(__basedir + '/lib/utils');

/**
 * Parses microformats in a form-encoded POST request.
 * Adapted from {@link https://github.com/voxpelli/node-micropub-express node-micropub-express}
 * by {@link https://kodfabrik.se Pelle Wessman}
 *
 * @copyright (c) 2016, Pelle Wessman
 * @memberof microformats
 * @module formEncodedToMf2
 * @param {String} body Form-encoded body
 * @return {Object} mf2 object
 */
module.exports = body => {
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
