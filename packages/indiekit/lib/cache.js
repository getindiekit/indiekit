/**
 * Get cached response value
 * @typedef {import("keyv")} Keyv
 * @param {Keyv} cache - Application cache (returns `false` if no database)
 * @param {number} ttl - Time to live
 * @param {string} url - URL to fetch and cache (used as key)
 * @returns {Promise<object>} Cached response value
 */
export const getCachedResponse = async (cache, ttl, url) => {
  let cachedResponse = cache && (await cache.get(url));

  if (!cachedResponse) {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    cachedResponse = await response.json();

    if (cache) {
      await cache.set(url, cachedResponse, ttl);
    }
  }

  return cachedResponse;
};
