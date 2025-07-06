import { excerpt, getDate, md5, slugify } from "@indiekit/util";
import {
  fetchReferences,
  mf2tojf2,
  mf2tojf2referenced,
} from "@paulrobertlloyd/mf2tojf2";

import { markdownToHtml, htmlToMarkdown } from "./markdown.js";
import { reservedProperties } from "./reserved-properties.js";
import { decodeQueryParameter, relativeMediaPath, toArray } from "./utils.js";

/**
 * Create JF2 object from form-encoded request
 * @param {object} body - Form-encoded request body
 * @param {boolean} [requestReferences] - Request data for any referenced URLs
 * @returns {Promise<object>} Micropub action
 */
export const formEncodedToJf2 = async (body, requestReferences) => {
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

      // Add decoded string value to JF2 object
      jf2[key] = decodeQueryParameter(body[key]);
    }
  }

  if (requestReferences) {
    return fetchReferences(jf2);
  }

  return jf2;
};

/**
 * Convert mf2 to JF2
 * @param {object} body - Form-encoded request body
 * @param {boolean} [requestReferences] - Request data for any referenced URLs
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
 * @param {object} properties - JF2 properties
 * @param {string} timeZone - Application time zone
 * @returns {object} Normalised JF2 properties
 */
export const normaliseProperties = (publication, properties, timeZone) => {
  const { channels, me, slugSeparator } = publication;

  properties.published = getDate(timeZone, properties.published);

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

  properties.slug = getSlugProperty(properties, slugSeparator);

  const publicationHasChannels = channels && Object.keys(channels).length > 0;
  if (publicationHasChannels) {
    properties.channel = getChannelProperty(properties, channels);
    delete properties["mp-channel"];
  }

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
 * Get channel property.
 *
 * If a publication has configured channels, but no channel has been selected,
 * the default channel is used.
 *
 * If `mp-channel` provides a UID that does not appear in the publication’s
 * channels, the default channel is used.
 *
 * The first item in a publication’s configured channels is considered the
 * default channel.
 * @param {object} properties - JF2 properties
 * @param {object} channels - Publication channels
 * @returns {Array} `mp-channel` property
 * @see {@link https://github.com/indieweb/micropub-extensions/issues/40}
 */
export const getChannelProperty = (properties, channels) => {
  channels = Object.keys(channels);
  const mpChannel = properties["mp-channel"];
  const providedChannels = Array.isArray(mpChannel) ? mpChannel : [mpChannel];
  const selectedChannels = new Set();

  // Only select channels that have been configured
  for (const uid of providedChannels) {
    if (channels.includes(uid)) {
      selectedChannels.add(uid);
    }
  }

  // If no channels provided, use default channel UID
  if (selectedChannels.size === 0) {
    const defaultChannel = channels[0];
    selectedChannels.add(defaultChannel);
  }

  return toArray([...selectedChannels]);
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
      /geo:(?<latitude>[\d+.?-]*),(?<longitude>[\d+.?-]*)(?:,(?<altitude>[\d+.?-]*))?/;
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
  const { name, published } = properties;

  let string;
  if (suggested) {
    string = suggested;
  } else if (name) {
    string = excerpt(name, 5);
  } else {
    string = md5(published).slice(0, 5);
  }

  return slugify(string, { separator });
};

/**
 * Get `mp-syndicate-to` property
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
    const syndicateTo = properties["mp-syndicate-to"];

    if (syndicateTo?.includes(uid)) {
      property.push(uid);
    }
  }

  if (property.length > 0) {
    return property;
  }
};
