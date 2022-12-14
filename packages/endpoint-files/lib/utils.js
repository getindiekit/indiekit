import { Buffer } from "node:buffer";
import { endpoint } from "./endpoint.js";

/**
 * Get file ID from URL
 *
 * @param {string} url - URL
 * @returns {string} File ID
 */
export const getFileId = (url) => {
  return Buffer.from(url).toString("base64url");
};

/**
 * Query Micropub media endpoint for file data
 *
 * @param {string} id - Post ID
 * @param {string} mediaEndpoint - Micropub media endpoint
 * @param {string} accessToken - Access token
 * @returns {object} JF2 properties
 */
export const getFileData = async (id, mediaEndpoint, accessToken) => {
  const mediaUrl = new URL(mediaEndpoint);
  mediaUrl.searchParams.append("q", "source");
  mediaUrl.searchParams.append("url", getFileUrl(id));

  const fileData = await endpoint.get(mediaUrl.href, accessToken);

  return fileData;
};

/**
 * Get file name from a URL
 *
 * @param {string} url - File URL
 * @returns {string} File name
 */
export const getFileName = (url) => {
  const { pathname } = new URL(url);
  return pathname.split("/").pop();
};

/**
 * Get file URL from ID
 *
 * @param {string} id - ID
 * @returns {string} File URL
 */
export const getFileUrl = (id) => {
  const url = Buffer.from(id, "base64url").toString("utf8");
  return new URL(url).href;
};
