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

    return pathname === "/" ? host : host + pathname;
  } catch {
    return string;
  }
};

/**
 * Get transformed image URL
 * @param {string} string - Image URL (or path)
 * @param {object} application - Application configuration
 * @param {object} [kwargs] - Transform options
 * @param {number} [kwargs.width] - Width of transformed image
 * @param {number} [kwargs.height] - Height of transformed image
 * @param {string} [kwargs.fit] - Resize crop method for transformed image
 * @returns {string} Resized image URL
 */
export const imageUrl = (string, application, kwargs) => {
  // Don’t transform SVG images
  if (string.includes(".svg")) {
    return string;
  }

  // Resize dimensions
  let resize;
  if (kwargs?.width && kwargs?.height) {
    resize = `s_${kwargs.width}x${kwargs.height}`;
  } else if (kwargs?.width) {
    resize = `w_${kwargs.width}`;
  } else if (kwargs?.height) {
    resize = `h_${kwargs.height}`;
  }

  // Resize crop method
  const fit = kwargs?.fit ? `fit_${kwargs.fit}` : false;

  // Build modification path
  let modifierPath;
  if (resize && fit) {
    modifierPath = `${resize},${fit}`;
  } else if (resize) {
    modifierPath = resize;
  } else if (fit) {
    modifierPath = fit;
  } else {
    modifierPath = "_";
  }

  const imageResizePath = path.join(
    application.imageEndpoint,
    modifierPath,
    encodeURIComponent(string),
  );
  const resizedURL = new URL(imageResizePath, application.url);

  return resizedURL.href;
};
