/* eslint-disable camelcase */
import brevity from 'brevity';
import {htmlToText} from 'html-to-text';
import path from 'path';

/**
 * Get status parameters from given JF2 properties
 *
 * @param {object} properties A JF2 properties object
 * @param {Array} mediaIds Twitter media IDs
 * @returns {object} Status parameters
 */
export const createStatus = (properties, mediaIds = false) => {
  const parameters = {};

  let status;

  if (properties['post-type'] === 'article') {
    status = `${properties.name}\n\n${properties.url}`;
  } else if (properties.name) {
    status = properties.name;
  } else if (properties.content && properties.content.html) {
    status = htmlToStatus(properties.content.html);
  } else if (properties.content) {
    status = properties.content;
  }

  // If repost of Twitter URL with content, create a quote tweet
  if (properties['post-type'] === 'repost') {
    status = `${properties.content}\n\n${properties['repost-of']}`;
  }

  // Truncate status if longer than 280 characters
  parameters.status = brevity.shorten(
    status,
    properties.url,
    false, // https://indieweb.org/permashortlink
    false, // https://indieweb.org/permashortcitation
    280
  );

  // If post is in reply to a tweet, add respective parameter
  if (properties['in-reply-to']) {
    const replyTo = properties['in-reply-to'];
    if (replyTo.includes('twitter.com')) {
      const statusId = getStatusIdFromUrl(replyTo);
      parameters.in_reply_to_status_id = statusId;
    }
  }

  // Add location parameters
  if (properties.location) {
    parameters.lat = properties.location.properties.latitude;
    parameters.long = properties.location.properties.longitude;
  }

  // Add media IDs
  if (mediaIds) {
    parameters.media_ids = mediaIds.join(',');
  }

  return parameters;
};

/**
 * Get status ID from Twitter status URL
 *
 * @param {string} url Twitter status URL
 * @returns {string} Status ID
 */
export const getStatusIdFromUrl = url => {
  const parsedUrl = new URL(url);
  const statusId = path.basename(parsedUrl.pathname);
  return statusId;
};

/**
 * Convert HTML to plain text, appending last link href
 * if present
 *
 * @param {string} html HTML
 * @returns {string} Text
 */
export const htmlToStatus = html => {
  // Convert HTML to text
  const text = htmlToText(html, {
    tags: {
      a: {options: {ignoreHref: true}}
    }
  });

  // If HTML contains links, get the last one
  const hrefs = [...html.matchAll(/href="(https?:\/\/.+?)"/g)];
  const lastHref = hrefs.length > 0 ? hrefs[(hrefs.length - 1)][1] : false;

  return lastHref ? `${text}\n\n${lastHref}` : text;
};

/**
 * Test if string is a Twitter status URL
 *
 * @param {string} string URL
 * @returns {boolean} Twitter status URL?
 */
export const isTweetUrl = string => {
  const parsedUrl = new URL(string);
  return parsedUrl.hostname === 'twitter.com';
};
