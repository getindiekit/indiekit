import {mf2tojf2} from '@paulrobertlloyd/mf2tojf2';
import {getDate} from './date.js';
import {markdownToHtml, htmlToMarkdown} from './markdown.js';
import {reservedProperties} from './reserved-properties.js';
import {
  decodeQueryParameter,
  excerptString,
  slugifyString,
  relativeMediaPath,
  randomString
} from './utils.js';

/**
 * Create JF2 object from form-encoded request
 *
 * @param {string} body Form-encoded request body
 * @returns {string} Micropub action
 */
export const formEncodedToJf2 = body => {
  const jf2 = {
    type: body.h ? body.h : 'entry'
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

      // Adds values to JF2 object
      jf2[key] = value;
    }
  }

  return jf2;
};

/**
 * Create JF2 object from microformats2 object
 *
 * @param {string} body Form-encoded request body
 * @returns {string} Micropub action
 */
export const mf2ToJf2 = body => {
  const mf2 = {
    items: [body]
  };

  return mf2tojf2(mf2);
};

/**
 * Normalise JF2
 *
 * @param {object} publication Publication configuration
 * @param {object} properties Source JF2 properties
 * @returns {object} Normalised JF2 properties
 */
export const normaliseJf2 = (publication, properties) => {
  const {me, slugSeparator, syndicationTargets, timeZone} = publication;

  properties.published = getPublishedProperty(properties, timeZone);

  if (properties.content) {
    properties.content = getContentProperty(properties);
  }

  if (properties.audio) {
    properties.audio = getAudioProperty(properties, me);
  }

  if (properties.photo) {
    properties.photo = getPhotoProperty(properties, me);
  }

  if (properties.video) {
    properties.video = getVideoProperty(properties, me);
  }

  properties['mp-slug'] = getSlugProperty(properties, slugSeparator);

  if (properties['mp-syndicate-to'] && syndicationTargets) {
    properties['mp-syndicate-to'] = getSyndicateToProperty(properties, syndicationTargets);
  }

  return properties;
};

/**
 * Get audio property
 *
 * @param {object} properties JF2 properties
 * @param {object} me Publication URL
 * @returns {Array} Microformats2 `audio` property
 */
export const getAudioProperty = (properties, me) => {
  return properties.audio.map(item => ({
    url: relativeMediaPath(item.value || item, me)
  }));
};

/**
 * Get content property (HTML, else object value, else property value)
 *
 * @param {object} properties JF2 properties
 * @returns {Array} Microformats2 `content` property
 */
export const getContentProperty = properties => {
  const {content} = properties;
  let {html, text} = content;

  // Return existing text and HTML representations
  if (html && text) {
    return content;
  }

  // If HTML representation only, add text representation
  if (html && !text) {
    text = htmlToMarkdown(html);
    return {html, text};
  }

  // Return property with text and HTML representations
  text = text || content;
  html = markdownToHtml(text);
  return {html, text};
};

/**
 * Get photo property (adding text alternatives where provided)
 *
 * @param {object} properties JF2 properties
 * @param {object} me Publication URL
 * @returns {Array} Microformats2 `photo` property
 */
export const getPhotoProperty = (properties, me) => {
  const {photo} = properties;
  const photoAlt = properties['mp-photo-alt'];
  const property = photo.map((item, index) => ({
    url: relativeMediaPath(item.value || item, me),
    ...item.alt && {alt: item.alt},
    ...photoAlt && {alt: photoAlt[index]}
  }));
  delete properties['mp-photo-alt'];
  return property;
};

/**
 * Get video property
 *
 * @param {object} properties JF2 properties
 * @param {object} me Publication URL
 * @returns {Array} Microformats2 `video` property
 */
export const getVideoProperty = (properties, me) => {
  return properties.video.map(item => ({
    url: relativeMediaPath(item.value || item, me)
  }));
};

/**
 * Get published date (based on microformats2 data, else current date)
 *
 * @param {object} properties JF2 properties
 * @param {object} timeZone Publication time zone
 * @returns {Array} Microformats2 `published` property
 */
export const getPublishedProperty = (properties, timeZone) => {
  return getDate(timeZone, properties.published);
};

/**
 * Get slug
 *
 * @param {object} properties JF2 properties
 * @param {string} separator Slug separator
 * @returns {Array} Array containing slug value
 */
export const getSlugProperty = (properties, separator) => {
  const suggested = properties['mp-slug'];
  const {name} = properties;

  let string;
  if (suggested) {
    string = suggested;
  } else if (name) {
    string = excerptString(name, 5);
  } else {
    string = randomString();
  }

  return slugifyString(string, separator);
};

export const getSyndicateToProperty = (properties, syndicationTargets) => {
  const proprerty = [];

  if (syndicationTargets.length === 0) {
    return;
  }

  for (const target of syndicationTargets) {
    const syndicateTo = properties && properties['mp-syndicate-to'];
    const clientChecked = syndicateTo && syndicateTo.includes(target.uid);
    const serverForced = target.options && target.options.forced;

    if (clientChecked || serverForced) {
      proprerty.push(target.uid);
    }
  }

  if (proprerty.length > 0) {
    return proprerty;
  }
};
