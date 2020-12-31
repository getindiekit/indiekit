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

  // If repost of Twitter URL with content, create a quote tweet
  // Else, if post has a non-empty title, show title with a link to post
  // Else, if post has plaintext content, use that
  // Else, if post has HTML content, convert to plain text and use that
  // Else, if post has content, use that
  if (properties['repost-of']) {
    status = `${properties.content} ${properties['repost-of']}`;
  } else if (properties.name && properties.name !== '') {
    status = `${properties.name} ${properties.url}`;
  } else if (properties.content && properties.content.text) {
    status = properties.content.text;
  } else if (properties.content && properties.content.html) {
    status = htmlToStatusText(properties.content.html);
  } else if (properties.content) {
    status = properties.content;
  }

  // Truncate status if longer than 280 characters
  if (status) {
    parameters.status = brevity.shorten(
      status,
      properties.url,
      false, // https://indieweb.org/permashortlink
      false, // https://indieweb.org/permashortcitation
      280
    );
  }

  // If post is in reply to a tweet, add respective parameter
  if (properties['in-reply-to']) {
    const inReplyTo = properties['in-reply-to'];
    const inReplyToHostname = new URL(inReplyTo).hostname;
    if (inReplyToHostname === 'twitter.com') {
      const statusId = getStatusIdFromUrl(inReplyTo);
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
export const htmlToStatusText = html => {
  // Get all the link references
  let hrefs = [...html.matchAll(/href="(https?:\/\/.+?)"/g)];

  // Remove any links to Twitter
  // HTML may contain Twitter usernames or hashtag links
  hrefs = hrefs.filter(href => {
    const hrefHost = new URL(href[1]).hostname;
    return hrefHost !== 'twitter.com';
  });

  // Get the last link mentioned, or return false
  const lastHref = hrefs.length > 0 ? hrefs[(hrefs.length - 1)][1] : false;

  // Convert HTML to plain text, removing any links
  const text = htmlToText(html, {
    tags: {
      a: {
        options: {
          ignoreHref: true
        }
      },
      img: {
        format: 'skip'
      }
    },
    wordwrap: false
  });

  // Append the last link if present
  const statusText = lastHref ? `${text} ${lastHref}` : text;

  return statusText;
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
