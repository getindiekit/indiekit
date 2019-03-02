const _ = require('lodash');

const utils = require(process.env.PWD + '/app/lib/utils');

/**
 * Parses microformats in form-encoded POST request.
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

  const mf2 = {
    type: body.h ? ['h-' + body.h] : ['h-entry'],
    properties: {}
  };

  if (body.h) {
    delete body.h;
  }

  for (const key in body) {
    if (Object.hasOwnProperty.call(body, key)) {
      const isExtendedProperty = key.indexOf('mp-') === 0;
      const isReservedProperty = reservedProperties.indexOf(key) !== -1;

      // Decode string values
      let value;
      if (typeof body[key] === 'string') {
        value = utils.decodeFormEncodedString(body[key]);
      } else {
        value = body[key];
      }

      // Assign values to correct properties in mf2 object
      if (isExtendedProperty) {
        mf2[key] = [].concat(value);
      } else if (isReservedProperty) {
        delete mf2[key];
      } else {
        const targetProperty = mf2.properties;
        targetProperty[key] = [].concat(value);
      }
    }
  }

  // Remove empty and null keys
  _.pickBy(mf2, _.identity);

  return mf2;
};
