import { Buffer } from "node:buffer";
import { endpoint } from "./endpoint.js";

/**
 * Query Micropub media endpoint for file data
 *
 * @param {string} id - Post ID
 * @param {string} mediaEndpoint - Micropub media endpoint
 * @param {string} accessToken - Access token
 * @returns {object} JF2 properties
 */
export const getFileData = async (id, mediaEndpoint, accessToken) => {
  const url = Buffer.from(id, "base64").toString("utf8");

  const mediaUrl = new URL(mediaEndpoint);
  mediaUrl.searchParams.append("q", "source");
  mediaUrl.searchParams.append("url", url);

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
