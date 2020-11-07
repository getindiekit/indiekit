import got from 'got';
import parser from 'microformats-parser';
import {reservedProperties} from './reserved-properties.js';
import {getDate} from './date.js';
import {
  decodeQueryParameter,
  excerptString,
  slugifyString,
  randomString
} from './utils.js';

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
  }

  // Return properties
  delete item.type;
  return item;
};

/**
 * Get Microformats2 object
 *
 * @param {object} publication Publication configuration
 * @param {object} mf2 Microformats2 object
 * @returns {object} Normalised Microformats2 object
 */
export const getMf2 = (publication, mf2) => {
  const {slugSeparator, syndicationTargets, timeZone} = publication;

  const syndidateTo = getSyndicateToProperty(mf2, syndicationTargets);
  if (syndidateTo) {
    mf2.properties['mp-syndicate-to'] = syndidateTo;
  }

  mf2.properties.published = getPublishedProperty(mf2, timeZone);
  mf2.properties.slug = getSlugProperty(mf2, slugSeparator);

  if (mf2.properties.content) {
    mf2.properties.content = getContentProperty(mf2);
  }

  if (mf2.properties.audio) {
    mf2.properties.audio = getAudioProperty(mf2);
  }

  if (mf2.properties.photo) {
    mf2.properties.photo = getPhotoProperty(mf2);
  }

  if (mf2.properties.video) {
    mf2.properties.video = getVideoProperty(mf2);
  }

  return mf2;
};

/**
 * Get audio property
 *
 * @param {object} mf2 Microformats2 object
 * @returns {Array} Microformats2 `audio` property
 */
export const getAudioProperty = mf2 => {
  const {audio} = mf2.properties;
  return audio.map(item => ({
    url: item.value || item
  }));
};

/**
 * Get content property (HTML, else object value, else property value)
 *
 * @param {object} mf2 Microformats2 object
 * @returns {Array} Microformats2 `content` property
 */
export const getContentProperty = mf2 => {
  const {content} = mf2.properties;
  const property = content[0].html || content[0].value || content[0];
  return new Array(property);
};

/**
 * Get photo property (adding text alternatives where provided)
 *
 * @param {object} mf2 Microformats2 object
 * @returns {Array} Microformats2 `photo` property
 */
export const getPhotoProperty = mf2 => {
  const {photo} = mf2.properties;
  const photoAlt = mf2.properties['mp-photo-alt'];
  const property = photo.map((item, index) => ({
    url: item.value || item,
    ...item.alt && {alt: item.alt},
    ...photoAlt && {alt: photoAlt[index]}
  }));
  delete mf2.properties['mp-photo-alt'];
  return property;
};

/**
 * Get video property
 *
 * @param {object} mf2 Microformats2 object
 * @returns {Array} Microformats2 `video` property
 */
export const getVideoProperty = mf2 => {
  const {video} = mf2.properties;
  return video.map(item => ({
    url: item.value || item
  }));
};

/**
 * Get published date (based on microformats2 data, else current date)
 *
 * @param {object} mf2 Microformats2 object
 * @param {object} timeZone Publication time zone
 * @returns {Array} Microformats2 `published` property
 */
export const getPublishedProperty = (mf2, timeZone) => {
  const {published} = mf2.properties;
  const dateString = published ? published[0] : false;
  const property = getDate(timeZone, dateString);
  return new Array(property);
};

/**
 * Get slug
 *
 * @param {object} mf2 Microformats2 object
 * @param {string} separator Slug separator
 * @returns {Array} Array containing slug value
 */
export const getSlugProperty = (mf2, separator) => {
  const suggested = mf2.properties['mp-slug'];
  const {name} = mf2.properties;

  let string;
  if (suggested && suggested[0]) {
    string = suggested[0];
  } else if (name && name[0]) {
    string = excerptString(name[0], 5);
  } else {
    string = randomString();
  }

  const slug = slugifyString(string, separator);
  return new Array(slug);
};

export const getSyndicateToProperty = (mf2, syndicationTargets) => {
  const syndication = [];

  if (!syndicationTargets) {
    return;
  }

  for (const target of syndicationTargets) {
    const syndicateTo = mf2.properties && mf2.properties['mp-syndicate-to'];
    const clientChecked = syndicateTo && syndicateTo.includes(target.uid);
    const serverForced = target.force;

    if (clientChecked || serverForced) {
      syndication.push(target.uid);
    }
  }

  if (syndication.length > 0) {
    return syndication;
  }
};

/**
 * Return microformats of a given URL
 *
 * @param {string} url URL path to post
 * @returns {Promise|object} Microformats2 object
 */
export const url2Mf2 = async url => {
  const {body} = await got(url);
  const mf2 = parser.mf2(body, {
    baseUrl: url
  });

  return mf2;
};
