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
 * @param {Record<string, string|string[]>} body - Form-encoded request body
 * @param {boolean} [canFetchReferences] - Fetch data for any referenced URLs
 * @returns {Promise<Jf2Properties>} JF2 properties
 */
export const formEncodedToJf2 = async (body, canFetchReferences) => {
  /**
   * @type {Jf2Properties}
   */
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

  if (canFetchReferences) {
    return fetchReferences(jf2);
  }

  return jf2;
};

/**
 * Convert mf2 to JF2
 * @param {Record<string, unknown>} body - mf2 item, i.e. a JSON request body
 * @param {boolean} [canFetchReferences] - Fetch data for any referenced URLs
 * @returns {Promise<Jf2Properties>} JF2 properties
 */
export const mf2ToJf2 = async (body, canFetchReferences) => {
  const mf2 = /** @type {Mf2} */ ({
    items: [body],
  });

  if (canFetchReferences) {
    return mf2tojf2referenced(mf2);
  }

  return mf2tojf2(mf2);
};

/**
 * Normalise JF2 properties
 * @param {IndiekitPublication} publication - Publication configuration
 * @param {Jf2Properties} properties - JF2 properties
 * @param {string} timeZone - Application time zone
 * @returns {Jf2Properties} Normalised JF2 properties
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

  if (properties.category) {
    properties.category = getCategoryProperty(properties);
    if (properties.category.length === 0) {
      delete properties.category;
    }
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
 * Get category property
 *
 * Categories arrive as typed: a client may send one with surrounding
 * whitespace, an empty value, or the same word in another case. Each of
 * those would otherwise become a distinct category on the site.
 * @param {Jf2Properties} properties - JF2 properties
 * @returns {Array<string>} `category` property, trimmed, without empties, and
 * with case-insensitive duplicates folded onto the first spelling given
 */
export const getCategoryProperty = (properties) => {
  const seen = new Set();
  /**
   * @type {string[]}
   */
  const category = [];

  for (const value of toArray(properties.category)) {
    const name = String(value).trim();
    const key = name.toLowerCase();

    if (name && !seen.has(key)) {
      seen.add(key);
      category.push(name);
    }
  }

  return category;
};

/**
 * Get audio property
 * @param {Jf2Properties} properties - JF2 properties
 * @param {string} me - Publication URL
 * @returns {Jf2MediaItem[]} `audio` property
 */
export const getAudioProperty = (properties, me) => {
  const audio = toArray(properties.audio);

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
 * @param {Jf2Properties} properties - JF2 properties
 * @param {IndiekitPublication["channels"]} channels - Publication channels
 * @returns {string[]} `mp-channel` property
 * @see {@link https://github.com/indieweb/micropub-extensions/issues/40}
 */
export const getChannelProperty = (properties, channels) => {
  const channelUids = Object.keys(channels);
  const mpChannel = properties["mp-channel"];
  const providedChannels = Array.isArray(mpChannel) ? mpChannel : [mpChannel];
  /**
   * @type {Set<string>}
   */
  const selectedChannels = new Set();

  // Only select channels that have been configured
  for (const uid of providedChannels) {
    if (channelUids.includes(uid)) {
      selectedChannels.add(uid);
    }
  }

  // If no channels provided, use default channel UID
  if (selectedChannels.size === 0) {
    const defaultChannel = channelUids[0];
    selectedChannels.add(defaultChannel);
  }

  return toArray([...selectedChannels]);
};

/**
 * Get content property.
 *
 * JF2 allows for the provision of both plaintext and HTML representations.
 * Use existing values, or add HTML representation if only plaintext provided.
 * @param {Jf2Properties} properties - JF2 properties
 * @returns {{ html?: string, text?: string }} `content` property
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
 * @param {Jf2Properties} properties - JF2 properties
 * @returns {Jf2Properties|string} `location` property
 */
export const getLocationProperty = (properties) => {
  let { location } = properties;

  if (typeof location === "string" && location.startsWith("geo:")) {
    const geoUriRegexp =
      /geo:(?<latitude>[\d+.?-]*),(?<longitude>[\d+.?-]*)(?:,(?<altitude>[\d+.?-]*))?/;
    const groups = location.match(geoUriRegexp)?.groups;

    // Leave an un-parseable Geo URI as given
    if (groups) {
      const { latitude, longitude, altitude } = groups;

      location = {
        type: "geo",
        latitude,
        longitude,
        ...(altitude && { altitude }),
      };
    }
  }

  return location;
};

/**
 * Get photo property (adding text alternatives where provided)
 * @param {Jf2Properties} properties - JF2 properties
 * @param {string} me - Publication URL
 * @returns {Jf2MediaItem[]} `photo` property
 */
export const getPhotoProperty = (properties, me) => {
  const photo = toArray(properties.photo);

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
 * @param {Jf2Properties} properties - JF2 properties
 * @param {string} me - Publication URL
 * @returns {Jf2MediaItem[]} `video` property
 */
export const getVideoProperty = (properties, me) => {
  const video = toArray(properties.video);

  return video.map((item) => ({
    url: relativeMediaPath(item.url || item, me),
  }));
};

/**
 * Get slug
 * @param {Jf2Properties} properties - JF2 properties
 * @param {string} separator - Slug separator
 * @returns {string} Array containing slug value
 */
export const getSlugProperty = (properties, separator) => {
  const suggested = properties["mp-slug"];
  const { name, published } = properties;

  /**
   * @type {string}
   */
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
 * @param {Jf2Properties} properties - JF2 properties
 * @param {Array<{info: {uid?: string}}>} [syndicationTargets] - Configured syndication targets
 * @returns {string[]|undefined} Resolved syndication targets
 */
export const getSyndicateToProperty = (properties, syndicationTargets) => {
  if (!syndicationTargets || syndicationTargets.length === 0) {
    return;
  }

  // Converting mf2 to JF2 leaves this property in one of three shapes: an
  // array for several targets, a string for one, and an empty *object* for
  // none. Calling `.includes` on it directly threw a TypeError and failed the
  // whole post for any client sending `"mp-syndicate-to": []`, which is what
  // an unticked syndication list produces.
  const syndicateTo = properties["mp-syndicate-to"];
  const requested = Array.isArray(syndicateTo)
    ? syndicateTo
    : typeof syndicateTo === "string"
      ? [syndicateTo]
      : [];

  /**
   * @type {string[]}
   */
  const property = [];

  for (const target of syndicationTargets) {
    let uid;
    try {
      ({ uid } = target.info);
    } catch {
      // A target whose `info` can’t be read can’t be syndicated to
      continue;
    }

    if (uid && requested.includes(uid)) {
      property.push(uid);
    }
  }

  if (property.length > 0) {
    return property;
  }
};

/**
 * @import { Mf2 } from "@paulrobertlloyd/mf2tojf2"
 */
