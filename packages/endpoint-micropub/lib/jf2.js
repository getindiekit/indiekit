import { mf2tojf2 } from "@paulrobertlloyd/mf2tojf2";
import { getDate } from "./date.js";
import { markdownToHtml, htmlToMarkdown } from "./markdown.js";
import { reservedProperties } from "./reserved-properties.js";
import {
  decodeQueryParameter,
  excerptString,
  relativeMediaPath,
  randomString,
  slugifyString,
  stripHtml,
} from "./utils.js";

/**
 * Create JF2 object from form-encoded request
 *
 * @param {string} body Form-encoded request body
 * @returns {string} Micropub action
 */
export const formEncodedToJf2 = (body) => {
  const jf2 = {
    type: body.h ? body.h : "entry",
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
      const isStringValue = typeof body[key] === "string";
      const value = isStringValue ? decodeQueryParameter(body[key]) : body[key];

      // Adds values to JF2 object
      jf2[key] = value;
    }
  }

  return jf2;
};

/**
 * Convert mf2 to JF2
 *
 * @param {string} body Form-encoded request body
 * @returns {string} Micropub action
 */
export const mf2ToJf2 = (body) => {
  const mf2 = {
    items: [body],
  };

  return mf2tojf2(mf2);
};

/**
 * Normalise JF2 properties
 *
 * @param {object} publication Publication configuration
 * @param {object} properties Source JF2 properties
 * @returns {object} Normalised JF2 properties
 */
export const normaliseProperties = (publication, properties) => {
  const { me, slugSeparator, syndicationTargets, timeZone } = publication;

  properties.published = getPublishedProperty(properties, timeZone);

  if (properties.name) {
    properties.name = properties.name.trim();
  }

  if (properties.content) {
    properties.content = getContentProperty(properties);
  }

  if (properties.location) {
    properties.location = getLocationProperty(properties);
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

  properties["mp-slug"] = getSlugProperty(properties, slugSeparator);

  // TODO: Smarter normalisation of mp-syndicate-to property when updating posts
  const syndicateTo = getSyndicateToProperty(properties, syndicationTargets);
  if (syndicateTo && !properties.syndication) {
    properties["mp-syndicate-to"] = syndicateTo;
  }

  return properties;
};

/**
 * Get audio property
 *
 * @param {object} properties JF2 properties
 * @param {object} me Publication URL
 * @returns {Array} `audio` property
 */
export const getAudioProperty = (properties, me) => {
  let { audio } = properties;
  audio = Array.isArray(audio) ? audio : [audio];

  return audio.map((item) => ({
    url: relativeMediaPath(item.url || item, me),
  }));
};

/**
 * Get content property (HTML, else object value, else property value)
 *
 * @param {object} properties JF2 properties
 * @returns {Array} `content` property
 */
export const getContentProperty = (properties) => {
  const { content } = properties;
  let { html, text } = content;

  // Strip any HTML from text property
  if (text) {
    text = stripHtml(text);
  }

  // Return existing text and HTML representations
  if (html && text) {
    return { html, text };
  }

  // If HTML representation only, add text representation
  if (html && !text) {
    text = htmlToMarkdown(html);
    return { html, text };
  }

  // Return property with text and HTML representations
  text = text || stripHtml(content);
  html = markdownToHtml(text);
  return { html, text };
};

/**
 * Get location property, parsing a Geo URI if provided
 *
 * @param {object|string} properties JF2 properties
 * @returns {object} `location` property
 */
export const getLocationProperty = (properties) => {
  let { location } = properties;

  if (typeof location === "string" && location.startsWith("geo:")) {
    const geoUriRegexp =
      /geo:(?<latitude>[-?\d+.]*),(?<longitude>[-?\d+.]*)(?:,(?<altitude>[-?\d+.]*))?/;
    const { latitude, longitude, altitude } =
      location.match(geoUriRegexp).groups;

    location = {
      properties: {
        latitude,
        longitude,
        ...(altitude ? { altitude } : {}),
      },
    };
  }

  return location;
};

/**
 * Get photo property (adding text alternatives where provided)
 *
 * @param {object} properties JF2 properties
 * @param {object} me Publication URL
 * @returns {Array} `photo` property
 */
export const getPhotoProperty = (properties, me) => {
  let { photo } = properties;
  photo = Array.isArray(photo) ? photo : [photo];

  let photoAlt = properties["mp-photo-alt"];
  if (photoAlt) {
    photoAlt = Array.isArray(photoAlt) ? photoAlt : [photoAlt];
  }

  const property = photo.map((item, index) => ({
    url: relativeMediaPath(item.url || item, me),
    ...(item.alt && { alt: item.alt.trim() }),
    ...(photoAlt && { alt: photoAlt[index].trim() }),
  }));
  delete properties["mp-photo-alt"];
  return property;
};

/**
 * Get video property
 *
 * @param {object} properties JF2 properties
 * @param {object} me Publication URL
 * @returns {Array} `video` property
 */
export const getVideoProperty = (properties, me) => {
  let { video } = properties;
  video = Array.isArray(video) ? video : [video];

  return video.map((item) => ({
    url: relativeMediaPath(item.url || item, me),
  }));
};

/**
 * Get published date (using current date if none given)
 *
 * @param {object} properties JF2 properties
 * @param {object} timeZone Publication time zone
 * @returns {Array} `published` property
 */
export const getPublishedProperty = (properties, timeZone) =>
  getDate(timeZone, properties.published);

/**
 * Get slug
 *
 * @param {object} properties JF2 properties
 * @param {string} separator Slug separator
 * @returns {Array} Array containing slug value
 */
export const getSlugProperty = (properties, separator) => {
  const suggested = properties["mp-slug"];
  const { name } = properties;

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

/**
 * Get mp-syndicate-to property
 *
 * @param {object} properties JF2 properties
 * @param {Array} syndicationTargets Configured syndication targets
 * @returns {Array} Resolved syndication targets
 */
export const getSyndicateToProperty = (properties, syndicationTargets) => {
  const property = [];

  if (!syndicationTargets || syndicationTargets.length === 0) {
    return;
  }

  for (const target of syndicationTargets) {
    const { uid } = target.info;
    const syndicateTo = properties && properties["mp-syndicate-to"];
    const clientChecked = syndicateTo && syndicateTo.includes(uid);
    const serverForced = target.options && target.options.forced;

    if (clientChecked || serverForced) {
      property.push(uid);
    }
  }

  if (property.length > 0) {
    return property;
  }
};
