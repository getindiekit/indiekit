import { Buffer } from "node:buffer";

import { IndiekitError } from "@indiekit/error";

import { endpoint } from "./endpoint.js";

/**
 * Query Micropub media endpoint for file data
 * @param {string} uid - Item UID
 * @param {string} mediaEndpoint - Micropub media endpoint
 * @param {string} accessToken - Access token
 * @returns {Promise<object|boolean>} JF2 properties, or false if not found
 */
export const getFileProperties = async (uid, mediaEndpoint, accessToken) => {
  const mediaUrl = new URL(mediaEndpoint);
  mediaUrl.searchParams.append("q", "source");
  mediaUrl.searchParams.append("uid", uid);

  try {
    // `q=source&uid=` returns properties for a single file, already flat
    // JF2 (unlike the Micropub equivalent, the media endpoint has no mf2
    // to convert), so there's nothing to unwrap before returning it.
    return await endpoint.get(mediaUrl.href, accessToken);
  } catch (error) {
    // `endpoint.get` throws on any error response. A file that is simply
    // gone is the caller's own not-found page, not an error to show the
    // reader; anything else is a real failure and must keep travelling.
    if (error instanceof IndiekitError && error.status === 404) {
      return false;
    }

    throw error;
  }
};

/**
 * Get file name from a URL
 * @param {string} url - File URL
 * @returns {string} File name
 */
export const getFileName = (url) => {
  const { pathname } = new URL(url);
  return pathname.split("/").pop();
};

/**
 * Get file URL from ID
 * @param {string} id - ID
 * @returns {string} File URL
 */
export const getFileUrl = (id) => {
  const url = Buffer.from(id, "base64url").toString("utf8");
  return new URL(url).href;
};
