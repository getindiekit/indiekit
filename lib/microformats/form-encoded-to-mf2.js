const utils = require(process.env.PWD + '/lib/utils');

/**
 * Parses microformats in form-encoded POST request.
 * Adapted from https://github.com/voxpelli/node-micropub-express
 * by Pelle Wessman.
 *
 * @copyright (c) 2016, Pelle Wessman
 * @exports formEncodedToMf2
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

  let mf2 = {
    type: body.h ? ['h-' + body.h] : ['h-entry'],
    properties: {}
  };

  if (body.h) {
    delete body.h;
  }

  for (const key in body) {
    if (Object.prototype.hasOwnProperty.call(body, key)) {
      // Decode string values
      let value;
      if (typeof body[key] === 'string') {
        value = utils.decodeFormEncodedString(body[key]);
      } else {
        value = body[key];
      }

      // Assign values to correct properties in mf2 object
      const isPhotoProperty = (key === 'photo');
      const isPhotoAltProperty = (key === 'mp-photo-alt');
      const isExtendedProperty = key.startsWith('mp-');
      const isReservedProperty = reservedProperties.includes(key);

      if (isReservedProperty) {
        // Delete reserved properties
        delete mf2[key];
      } else if (isPhotoProperty) {
        // Convert `photo` values into mf2 objects
        // 'a' => [{value: 'a'}]
        // ['a', 'b'] => [{value: 'a'}, {value: 'b'}]
        mf2.properties[key] = [].concat(value).map(value => ({value}));
      } else if (isPhotoAltProperty) {
        // Convert `mp-photo-alt` values into mf2 objects
        // 'a' => [{alt: 'a'}]
        // ['a', 'b'] => [{alt: 'a'}, {alt: 'b'}]
        mf2[key] = [].concat(value).map(alt => ({alt}));
      } else if (isExtendedProperty) {
        // Convert `mp-*` extended values into arrays
        // 'a' => ['a']
        mf2[key] = [].concat(value);
      } else {
        // Convert property values into arrays
        // 'a' => ['a']
        mf2.properties[key] = [].concat(value);
      }
    }
  }

  // Merge mf2.properties.photo with mf2['mp-photo-alt']
  const {photo} = mf2.properties;
  const alt = mf2['mp-photo-alt'];
  if (photo && alt) {
    mf2.properties.photo = photo.map((photo, i) => {
      return {
        value: photo.value,
        alt: alt[i].alt
      };
    });

    delete mf2['mp-photo-alt'];
  }

  // Remove empty and null keys
  mf2 = utils.cleanObject(mf2);

  return mf2;
};
