import path from "node:path";

/**
 * Get absolute URL or path
 *
 * @param {string} string - URL or path
 * @param {string} baseUrl - Base URL
 * @returns {URL} Absolute URL
 */
export const absoluteUrl = (string, baseUrl) => {
  string = String(string);

  try {
    return new URL(string, baseUrl).href;
  } catch {
    return path.posix.join(baseUrl, string);
  }
};
