import { randomString, slugify } from "@indiekit/util";
import { mf2tojf2, mf2tojf2referenced } from "@paulrobertlloyd/mf2tojf2";
import { markdownToHtml, htmlToMarkdown } from "./markdown.js";
import { reservedProperties } from "./reserved-properties.js";
import {
  decodeQueryParameter,
  excerptString,
  relativeMediaPath,
  toArray,
} from "./utils.js";

/**
 * Create JF2 object from form-encoded request
 * @param {object} body - Form-encoded request body
 * @returns {object} Micropub action
 */
export const formEncodedToJf2 = (body) => {
  const jf2 = {
    type: body.h || "entry",
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
 * @param {string} body - Form-encoded request body
 * @param {boolean} requestReferences - Request data for any referenced URLs
 * @returns {Promise<object>} Micropub action
 */
export const mf2ToJf2 = async (body, requestReferences) => {
  const mf2 = {
    items: [body],
  };

  if (requestReferences) {
    return mf2tojf2referenced(mf2);
  }

  return mf2tojf2(mf2);
};

/**
 * Normalise JF2 properties
 * @param {object} publication - Publication configuration
 * @param {object} properties - Source JF2 properties
 * @returns {object} Normalised JF2 properties
 */
export const normaliseProperties = (publication, properties) => {
  const { me, slugSeparator } = publication;

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

  if (properties["mp-syndicate-to"]) {
    properties["mp-syndicate-to"] = toArray(properties["mp-syndicate-to"]);
  }

  if (properties.syndication) {
    properties.syndication = toArray(properties.syndication);
  }

  return properties;
};

/**
 * Get audio property
 * @param {object} properties - JF2 properties
 * @param {object} me - Publication URL
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
 * Get content property.
 *
 * JF2 allows for the provision of both plaintext and HTML representations.
 * Use existing values, or add HTML representation if only plaintext provided.
 * @param {object} properties - JF2 properties
 * @returns {object} `content` property
 * @see {@link https://www.w3.org/TR/jf2/#html-content}
 */
export const getContentProperty = (properties) => {
  const { content } = properties;
  let { html, text } = content;

  // Return existing text and HTML representations, unamended
  if (html && text) {
    return { html, text };
  }

  // If HTML representation only, add text representation
  if (html && !text) {
    return { html, text: htmlToMarkdown(html) };
  }

  // If text representation only, add HTML representation
  if (!html && text) {
    return { html: markdownToHtml(text), text };
  }

  // If content is a string, add `html` and move plaintext to `text.
  if (typeof content === "string") {
    text = content;
    html = markdownToHtml(content);
  }

  return { html, text };
};

/**
 * Get location property, parsing a Geo URI if provided
 * @param {object|string} properties - JF2 properties
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
      type: "geo",
      latitude,
      longitude,
      ...(altitude ? { altitude } : {}),
    };
  }

  return location;
};

/**
 * Get photo property (adding text alternatives where provided)
 * @param {object} properties - JF2 properties
 * @param {object} me - Publication URL
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
 * @param {object} properties - JF2 properties
 * @param {object} me - Publication URL
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
 * Get slug
 * @param {object} properties - JF2 properties
 * @param {string} separator - Slug separator
 * @returns {string} Array containing slug value
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
    string = randomString(5);
  }

  return slugify(string, separator);
};

/**
 * Get mp-syndicate-to property
 * @param {object} properties - JF2 properties
 * @param {Array} syndicationTargets - Configured syndication targets
 * @returns {Array|undefined} Resolved syndication targets
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
