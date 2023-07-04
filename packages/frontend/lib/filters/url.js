import path from "node:path";

/**
 * Get friendly URL
 * @param {string} string - URL or path
 * @returns {string} Friendly URL
 */
export const friendlyUrl = (string) => {
  string = String(string);

  try {
    const { host, pathname } = new URL(string);
    return host + pathname;
  } catch {
    return string;
  }
};

/**
 * Get transformed image URL
 * @param {string} string - Image URL (or path)
 * @param {object} application - Application configuration
 * @param {object} options - Transform options
 * @returns {string} Resized image URL
 */
export const imageUrl = (string, application, options = {}) => {
  // Don’t transform SVG images
  if (string.includes(".svg")) {
    return string;
  }

  let imagePath;
  try {
    new URL(string); // eslint-disable-line no-new
    imagePath = new URL(string).pathname;
  } catch {
    imagePath = string;
  }

  const imageResizePath = path.join(application.imageEndpoint, imagePath);
  const resizedURL = new URL(imageResizePath, application.url);
  resizedURL.searchParams.append("w", options.width || 240);
  resizedURL.searchParams.append("h", options.height || 240);
  resizedURL.searchParams.append("c", options.crop || true);

  return resizedURL.href;
};
