import { fetch } from "undici";

/**
 * Get cached response value
 *
 * @param {Function} cache Application cache (returns `false` if no database)
 * @param {string} url URL to fetch and cache (used as key)
 * @returns {object} Cached response value
 */
export const getCachedResponse = async (cache, url) => {
  let cachedResponse = cache && (await cache.get(url));

  if (!cachedResponse) {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    cachedResponse = await response.json();

    if (cache) {
      await cache.set(url, cachedResponse);
    }
  }

  return cachedResponse;
};
