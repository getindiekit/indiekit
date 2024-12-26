import brevity from "brevity";
import { htmlToText } from "html-to-text";

/**
 * Get post parts (UID and CID)
 * @param {string} url - Post URL
 * @returns {object} Parts
 */
export const getPostParts = (url) => {
  const pathParts = new URL(url).pathname.split("/");

  // Extract DID and post ID from the path
  const did = pathParts[2];
  const rkey = pathParts[4];

  return { did, rkey };
};

/**
 * Covert AT Protocol URI to post URL
 * @param {string} profileUrl - Profile URL
 * @param {string} uri - AT Proto URI
 * @returns {string} Post URL
 */
export const uriToPostUrl = (profileUrl, uri) => {
  const [, did, , rkey] = uri.split("/");
  return `${profileUrl}/${did}/post/${rkey}`;
};

/**
 * Get status parameters from given JF2 properties
 * @param {object} properties - JF2 properties
 * @param {object} [options] - Options
 * @param {boolean} [options.includePermalink] - Include permalink in status
 * @param {string} [options.serviceUrl] - Service URL
 * @returns {string} Status text
 */
export const getStatusText = (properties, options = {}) => {
  const { includePermalink, serviceUrl } = options;

  let text;
  if (properties.content && properties.content.html) {
    text = htmlToStatusText(properties.content.html, serviceUrl);
  }

  // Truncate status if longer than 300 characters
  text = brevity.shorten(
    text,
    properties.url,
    includePermalink // https://indieweb.org/permashortlink
      ? properties.url
      : false,
    false, // https://indieweb.org/permashortcitation
    300,
  );

  // Show permalink below status, not within brackets
  text = text.replace(`(${properties.url})`, `\n\n${properties.url}`);

  return text;
};

/**
 * Convert HTML to plain text, appending last link href if present
 * @param {string} html - HTML
 * @param {string} serviceUrl - Service URL, i.e. https://bsky.social
 * @returns {string} Text
 */
export const htmlToStatusText = (html, serviceUrl) => {
  // Get all the link references
  let hrefs = [...html.matchAll(/href="(https?:\/\/.+?)"/g)];

  // Remove any links to Mastodon server
  // HTML may contain Mastodon usernames or hashtag links
  hrefs = hrefs.filter((href) => {
    const hrefHostname = new URL(href[1]).hostname;
    const serverHostname = new URL(serviceUrl).hostname;
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
