import { Buffer } from "node:buffer";

import { endpoint } from "./endpoint.js";

/**
 * Query Micropub media endpoint for file data
 * @param {string} uid - Item UID
 * @param {string} mediaEndpoint - Micropub media endpoint
 * @param {string} accessToken - Access token
 * @returns {Promise<object>} JF2 properties
 */
export const getFileProperties = async (uid, mediaEndpoint, accessToken) => {
  const mediaUrl = new URL(mediaEndpoint);
  mediaUrl.searchParams.append("q", "source");

  const mediaResponse = await endpoint.get(mediaUrl.href, accessToken);

  if (mediaResponse?.items?.length > 0) {
    return mediaResponse.items.find((item) => item.uid === uid);
  }

  return false;
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
