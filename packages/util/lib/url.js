import posix from "node:path/posix";

/**
 * Get canonical URL
 * @param {string} string - URL or path
 * @param {string} [baseUrl] - Base URL or path
 * @returns {string} Canonical URL
 * @throws {TypeError} If `string` is not a URL and no `baseUrl` is given
 * @see {@link https://indieauth.spec.indieweb.org/#url-canonicalization}
 */
export const getCanonicalUrl = (string, baseUrl) => {
  string = String(string);

  try {
    return new URL(string, baseUrl).href;
  } catch (error) {
    if (!baseUrl) {
      throw error;
    }

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
