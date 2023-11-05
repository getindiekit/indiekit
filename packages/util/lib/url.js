import posix from "node:path/posix";

/**
 * Get canonical URL
 * @param {string} string - URL or path
 * @param {string} [baseUrl] - Base URL
 * @returns {string} Canonical URL
 * @see {@link https://indieauth.spec.indieweb.org/#url-canonicalization}
 */
export const getCanonicalUrl = (string, baseUrl) => {
  string = String(string);

  try {
    return new URL(string, baseUrl).href;
  } catch {
    return posix.join(baseUrl, string);
  }
};

/**
 * Check if parsed URL string has given origin
 * @param {string} string - URL, i.e. https://website.example:80/path
 * @param {string} origin - Origin, i.e. https://website.example:80
 * @returns {boolean} String is a URL with same origin
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy}
 */
export const isSameOrigin = (string, origin) => {
  const url = new URL(string);
  const originUrl = new URL(origin);
  return url.origin === originUrl.origin;
};
