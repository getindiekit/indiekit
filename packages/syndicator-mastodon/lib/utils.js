import path from "node:path";
import { IndiekitError } from "@indiekit/error";
import brevity from "brevity";
import { htmlToText } from "html-to-text";

/**
 * Get status parameters from given JF2 properties
 * @param {object} properties - A JF2 properties object
 * @param {object} [options] - Options
 * @param {number} [options.characterLimit] - Character limit
 * @param {Array} [options.mediaIds] - Mastodon media IDs
 * @param {string} [options.serverUrl] - Server URL, i.e. https://mastodon.social
 * @returns {object} Status parameters
 */
export const createStatus = (properties, options = {}) => {
  const { characterLimit, mediaIds, serverUrl } = options;
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
    parameters.status = brevity.shorten(
      status,
      properties.url,
      false, // https://indieweb.org/permashortlink
      false, // https://indieweb.org/permashortcitation
      characterLimit
    );
  }

  // Add media IDs
  if (mediaIds) {
    parameters.media_ids = mediaIds;
  }

  // If post is in reply to a toot, add respective parameter
  if (properties["in-reply-to"]) {
    const inReplyTo = properties["in-reply-to"];
    const inReplyToHostname = new URL(inReplyTo).hostname;
    const serverHostname = new URL(serverUrl).hostname;

    if (inReplyToHostname === serverHostname) {
      // Reply to toot
      const statusId = getStatusIdFromUrl(inReplyTo);
      parameters.in_reply_to_status_id = statusId;
    } else {
      throw IndiekitError.badRequest("Not a reply to a URL at this target");
    }
  }

  return parameters;
};

/**
 * Get status ID from Mastodon status URL
 * @param {string} url Mastodon status URL
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
