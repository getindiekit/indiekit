import got from 'got';
import parser from 'microformats-parser';
import {decodeQueryParameter} from './utils.js';
import {reservedProperties} from './micropub.js';

/**
 * Create Microformats2 object from form-encoded request
 *
 * @param {string} body Form-encoded request body
 * @returns {string} Micropub action
 */
export const formEncodedToMf2 = body => {
  const type = body.h ? ['h-' + body.h] : ['h-entry'];

  const mf2 = {
    type,
    properties: {}
  };

  for (const key in body) {
    if (Object.prototype.hasOwnProperty.call(body, key)) {
      // Delete reserved properties
      const isReservedProperty = reservedProperties.includes(key);
      if (isReservedProperty) {
        delete body[key];
        continue;
      }

      // Decode string values
      const isStringValue = typeof body[key] === 'string';
      const value = isStringValue ? decodeQueryParameter(body[key]) : body[key];

      // Convert values to arrays, ie 'a' => ['a']
      mf2.properties[key] = [].concat(value);
    }
  }

  return mf2;
};

/**
 * Returns/selects microformat properties of a post.
 *
 * @param {object} mf2 Microformats2 object
 * @param {Array|string} requestedProperties mf2 properties to select
 * @returns {Promise|object} mf2 with requested properties
 */
export const mf2Properties = (mf2, requestedProperties) => {
  const mf2HasItems = mf2.items && mf2.items.length > 0;
  if (!mf2HasItems) {
    throw new Error('Source has no items');
  }

  const item = mf2.items[0];
  const {properties} = item;

  // Return requested properties
  if (requestedProperties) {
    const selectedProperties = {};

    if (!Array.isArray(requestedProperties)) {
      requestedProperties = new Array(requestedProperties);
    }

    requestedProperties.forEach(key => {
      if (properties[key]) {
        selectedProperties[key] = properties[key];
      }
    });

    item.properties = selectedProperties;
    return item;
  }

  // Return all properties
  return item;
};

/**
 * Normalise Microformats2 object
 *
 * @param {object} mf2 Microformats2 object
 * @returns {object} Normalised Microformats2 object
 */
export const normaliseMf2 = mf2 => {
  const {audio, photo, video} = mf2.properties;
  const photoAlt = mf2.properties['mp-photo-alt'];

  if (audio) {
    mf2.properties.audio = normaliseAudio(audio);
  }

  if (photo) {
    mf2.properties.photo = normalisePhoto(photo, photoAlt);
    delete mf2.properties['mp-photo-alt'];
  }

  if (video) {
    mf2.properties.video = normaliseVideo(video);
  }

  return mf2;
};

/**
 * Normalise audio property
 *
 * @param {Array} audio Microformats2 `audio` property
 * @returns {Array} Microformats2 `audio` property
 */
export const normaliseAudio = audio => {
  if (audio) {
    const isNormalisedProperty = typeof audio[0] !== 'string';
    return isNormalisedProperty ?
      audio :
      audio.map(value => ({value}));
  }
};

/**
 * Normalise photo property (adding text alternatives where provided)
 *
 * @param {Array} photo Microformats2 `photo` property
 * @param {Array} photoAlt Microformats2 `mp-photo-alt` property
 * @returns {Array} Microformats2 `photo` property
 */
export const normalisePhoto = (photo, photoAlt) => {
  if (photo) {
    const isNormalisedProperty = typeof photo[0] !== 'string';
    return isNormalisedProperty ?
      photo :
      photo.map((value, i) => ({
        ...value && {value},
        ...photoAlt && {alt: photoAlt[i]}
      }));
  }
};

/**
 * Normalise video property
 *
 * @param {Array} video Microformats2 `video` property
 * @returns {Array} Microformats2 `video` property
 */
export const normaliseVideo = video => {
  if (video) {
    const isNormalisedProperty = typeof video[0] !== 'string';
    return isNormalisedProperty ?
      video :
      video.map(value => ({value}));
  }
};

/**
 * Return microformats of a given URL
 *
 * @param {string} url URL path to post
 * @returns {Promise|object} Microformats2 object
 */
export const url2Mf2 = async url => {
  try {
    const response = await got(url);
    const mf2 = parser.mf2(response.body, {
      baseUrl: url
    });

    return mf2;
  } catch (error) {
    throw new Error(error.message);
  }
};
