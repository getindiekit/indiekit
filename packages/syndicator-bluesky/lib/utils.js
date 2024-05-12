import { RichText } from "@atproto/api";
import brevity from "brevity";
import { htmlToText } from "html-to-text";

const AT_URI = /at:\/\/(?<did>did:[^/]+)\/(?<type>[^/]+)\/(?<rkey>[^/]+)/;

/**
 * Convert plain text to rich text
 * @param {import("@atproto/api").Agent} client - AT Protocol agent
 * @param {string} text - Text to convert
 * @returns {Promise<RichText>} Rich text
 */
export const createRichText = async (client, text) => {
  const rt = new RichText({ text });
  await rt.detectFacets(client);

  return rt;
};

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
 * Convert Bluesky URI to post URL
 * @param {string} profileUrl - Profile URL
 * @param {string} uri - Bluesky URI
 * @returns {string|undefined} Post URL
 */
export const uriToPostUrl = (profileUrl, uri) => {
  const match = uri.match(AT_URI);

  if (match) {
    let { did, rkey, type } = match.groups;
    type = type.split(".").at(-1);

    return `${profileUrl}/${did}/${type}/${rkey}`;
  }
};

/**
 * Get post test from given JF2 properties
 * @param {object} properties - JF2 properties
 * @param {boolean} [includePermalink] - Include permalink in post
 * @returns {string} Post text
 */
export const getPostText = (properties, includePermalink) => {
  let text;

  if (properties.name && properties.name !== "") {
    // Post has a non-empty title, show title with a link to post
    text = `${properties.name} ${properties.url}`;
  } else if (properties.content && properties.content.html) {
    text = htmlToStatusText(properties.content.html);
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
 * @returns {string} Text
 */
export const htmlToStatusText = (html) => {
  // Get all the link references
  let hrefs = [...html.matchAll(/href="(https?:\/\/.+?)"/g)];

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
