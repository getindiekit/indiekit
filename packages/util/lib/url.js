/**
 * Check if given string is a valid URL
 * @param {object} string - URL
 * @returns {boolean} String is a URL
 * @todo Replace with URL.canParse() when Indiekit supports Node v20+
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/URL/canParse_static}
 */
export const isUrl = (string) => {
  if (typeof string !== "string") {
    throw new TypeError("Expected a string");
  }

  try {
    new URL(decodeURIComponent(string)); // eslint-disable-line no-new
    return true;
  } catch {
    return false;
  }
};
