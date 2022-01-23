/* eslint-disable camelcase */
import path from 'node:path';
import brevity from 'brevity';
import {htmlToText} from 'html-to-text';

/**
 * Get status parameters from given JF2 properties
 *
 * @param {object} properties A JF2 properties object
 * @param {string} serverUrl Server URL, i.e. https://mastodon.social
 * @param {Array} mediaIds Mastodon media IDs
 * @returns {object} Status parameters
 */
export const createStatus = (properties, serverUrl, mediaIds) => {
  let parameters = {};

  let status;
  let statusText;

  if (properties.content && properties.content.html) {
    statusText = htmlToStatusText(properties.content.html, serverUrl);
  }

  if (statusText && properties['repost-of']) {
    // If repost of Mastodon URL with content, create a reblog
    status = `${statusText} ${properties['repost-of']}`;
  } else if (properties.name && properties.name !== '') {
    // Else, if post has a non-empty title, show title with a link to post
    status = `${properties.name} ${properties.url}`;
  } else if (statusText) {
    // Else, post content (converted to plain text)
    status = statusText;
  }

  // Truncate status if longer than 500 characters
  if (status) {
    parameters.status = brevity.shorten(
      status,
      properties.url,
      false, // https://indieweb.org/permashortlink
      false, // https://indieweb.org/permashortcitation
      500,
    );
  }

  // Add media IDs
  if (mediaIds) {
    parameters.media_ids = mediaIds;
  }

  // If post is in reply to a toot, add respective parameter
  if (properties['in-reply-to']) {
    const inReplyTo = properties['in-reply-to'];
    const inReplyToHostname = new URL(inReplyTo).hostname;
    const serverHostname = new URL(serverUrl).hostname;

    if (inReplyToHostname === serverHostname) {
      // Reply to toot
      const statusId = getStatusIdFromUrl(inReplyTo);
      parameters.in_reply_to_status_id = statusId;
    } else {
      // Reply isn’t relevant at this target
      parameters = null;
    }
  }

  return parameters;
};

/**
 * Get absolute URL
 *
 * @param {string} string URL or path
 * @param {string} me Publication URL
 * @returns {URL} Absolute URL
 */
export const getAbsoluteUrl = (string, me) => {
  try {
    return new URL(string).toString();
  } catch {
    const absoluteUrl = path.posix.join(me, string);
    return new URL(absoluteUrl).toString();
  }
};

/**
 * Get status ID from Mastodon status URL
 *
 * @param {string} url Mastodon status URL
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
 * @param {string} serverUrl Server URL, i.e. https://mastodon.social
 * @returns {string} Text
 */
export const htmlToStatusText = (html, serverUrl) => {
  // Get all the link references
  let hrefs = [...html.matchAll(/href="(https?:\/\/.+?)"/g)];

  // Remove any links to Mastodon server
  // HTML may contain Mastodon usernames or hashtag links
  hrefs = hrefs.filter(href => {
    const hrefHostname = new URL(href[1]).hostname;
    const serverHostname = new URL(serverUrl).hostname;
    return hrefHostname !== serverHostname;
  });

  // Get the last link mentioned, or return false
  const lastHref = hrefs.length > 0 ? hrefs[(hrefs.length - 1)][1] : false;

  // Convert HTML to plain text, removing any links
  const text = htmlToText(html, {
    tags: {
      a: {
        options: {
          ignoreHref: true,
        },
      },
      img: {
        format: 'skip',
      },
    },
    wordwrap: false,
  });

  // Append the last link if present
  const statusText = lastHref ? `${text} ${lastHref}` : text;

  return statusText;
};

/**
 * Test if string is a Mastodon status URL
 *
 * @param {string} string Text that may be a URL
 * @param {string} serverUrl Server URL, i.e. https://mastodon.social
 * @returns {boolean} Mastodon status URL?
 */
export const isTootUrl = (string, serverUrl) => {
  const parsedHostname = new URL(string).hostname;
  const serverHostname = new URL(serverUrl).hostname;
  return parsedHostname === serverHostname;
};
