import path from "node:path";

import { IndiekitError } from "@indiekit/error";
import brevity from "brevity";
import { htmlToText } from "html-to-text";

/**
 * Get status parameters from given JF2 properties
 * @param {object} properties - JF2 properties
 * @param {object} [options] - Options
 * @param {number} [options.characterLimit] - Character limit
 * @param {boolean} [options.includeCategories] - Add categories as hashtags
 * @param {boolean} [options.includePermalink] - Include permalink in status
 * @param {Array} [options.mediaIds] - Mastodon media IDs
 * @param {string} [options.serverUrl] - Server URL
 * @returns {object} Status parameters
 */
export const createStatus = (properties, options = {}) => {
  const {
    characterLimit,
    includeCategories,
    includePermalink,
    mediaIds,
    serverUrl,
  } = options;
  const parameters = {};

  let status;
  let statusText;

  if (properties.content && properties.content.html) {
    statusText = htmlToStatusText(properties.content.html, serverUrl);
  }

  if (statusText && properties["repost-of"]) {
    // If repost of Mastodon URL with content, create a reblog
    status = `${statusText} ${properties["repost-of"]}`;
  } else if (properties.name && properties.name !== "") {
    // Else, if post has a non-empty title, show title with a link to post
    status = `${properties.name} ${properties.url}`;
  } else if (statusText) {
    // Else, post content (converted to plain text)
    status = statusText;
  }

  // Truncate status if longer than 500 characters
  if (status) {
    // Show hashtags at the end of a status, where Mastodon displays them as
    // links. Skip any already written into the post content.
    const hashtags = includeCategories
      ? createHashtags(properties.category).filter(
          (hashtag) =>
            !new RegExp(String.raw`${hashtag}(?![\p{L}\p{N}_])`, "iu").test(
              status,
            ),
        )
      : [];
    const suffix = hashtags.length > 0 ? `\n\n${hashtags.join(" ")}` : "";

    const statusText = brevity.shorten(
      status,
      properties.url,
      includePermalink // https://indieweb.org/permashortlink
        ? properties.url
        : false,
      false, // https://indieweb.org/permashortcitation
      // Leave room for the hashtags added below
      characterLimit ? characterLimit - suffix.length : characterLimit,
    );

    // Show permalink below status, not within brackets
    parameters.status =
      statusText.replace(`(${properties.url})`, `\n\n${properties.url}`) +
      suffix;
  }

  // Add media IDs
  if (mediaIds) {
    parameters.mediaIds = mediaIds;
  }

  // If post is in reply to a status, add respective parameter
  if (properties["in-reply-to"]) {
    const inReplyTo = properties["in-reply-to"];
    const inReplyToHostname = new URL(inReplyTo).hostname;
    const serverHostname = new URL(serverUrl).hostname;

    if (inReplyToHostname === serverHostname) {
      // Reply to status
      const statusId = getStatusIdFromUrl(inReplyTo);
      parameters.inReplyToId = statusId;
    } else {
      throw IndiekitError.badRequest("Not a reply to a URL at this target");
    }
  }

  // If post visibility set, use the same setting when sharing to Mastodon
  if (properties.visibility) {
    parameters.visibility = properties.visibility;
  }

  return parameters;
};

/**
 * Get hashtags for given categories
 *
 * Uses the last segment of a hierarchical category, and removes any characters
 * Mastodon doesn’t recognise as part of a hashtag, so that `holidays/family
 * trips` becomes `#familytrips`.
 * @param {Array|string} [category] - JF2 `category` property
 * @returns {Array} Hashtags
 */
export const createHashtags = (category) => {
  if (!category) {
    return [];
  }

  const categories = Array.isArray(category) ? category : [category];
  const hashtags = [];

  for (const item of categories) {
    if (typeof item !== "string") {
      continue;
    }

    const name = item
      .split("/")
      .at(-1)
      .replaceAll(/[^\p{L}\p{N}_]/gu, "");
    const hashtag = `#${name}`;

    if (name && !hashtags.includes(hashtag)) {
      hashtags.push(hashtag);
    }
  }

  return hashtags;
};

/**
 * Get status ID from Mastodon status URL
 * @param {string} url - Mastodon status URL
 * @returns {string} Status ID
 */
export const getStatusIdFromUrl = (url) => {
  const parsedUrl = new URL(url);
  const statusId = path.basename(parsedUrl.pathname);
  return statusId;
};

/**
 * Convert HTML to plain text, appending last link href if present
 * @param {string} html - HTML
 * @param {string} serverUrl - Server URL, i.e. https://mastodon.social
 * @returns {string} Text
 */
export const htmlToStatusText = (html, serverUrl) => {
  // Get all the link references
  let hrefs = [...html.matchAll(/href="(https?:\/\/.+?)"/g)];

  // Remove any links to Mastodon server
  // HTML may contain Mastodon usernames or hashtag links
  hrefs = hrefs.filter((href) => {
    const hrefHostname = new URL(href[1]).hostname;
    const serverHostname = new URL(serverUrl).hostname;
    return hrefHostname !== serverHostname;
  });

  // Get the last link mentioned, or return false
  const lastHref = hrefs.length > 0 ? hrefs.at(-1)[1] : false;

  // Convert HTML to plain text, removing any links
  const text = htmlToText(html, {
    selectors: [
      {
        selector: "a",
        options: {
          ignoreHref: true,
        },
      },
      {
        selector: "img",
        format: "skip",
      },
    ],
    wordwrap: false,
  });

  // Append the last link if present
  const statusText = lastHref ? `${text} ${lastHref}` : text;

  return statusText;
};
