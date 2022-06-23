/**
 * Canonicalise URL according to IndieAuth spec
 *
 * @param {string} url - The URL to canonicalise
 * @returns {string} The canonicalised URL
 * @see {@link https://indieauth.spec.indieweb.org/#url-canonicalization}
 */
export const getCanonicalUrl = (url) => new URL(url).href;
