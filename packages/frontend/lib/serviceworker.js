const assetCacheName = "assets-APP_VERSION";
const pagesCacheName = "pages";
const imageCacheName = "images";
const maxPages = 50; // Maximum number of pages to cache
const maxImages = 100; // Maximum number of images to cache
const timeout = 5000; // Number of milliseconds before timing out
const cacheList = new Set([assetCacheName, pagesCacheName, imageCacheName]);
const placeholderImage = `<svg xmlns="http://www.w3.org/2000/svg"><defs><path id="icon" fill="#AAA" d="M24 32a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm-6.9-11.9 4.1 4.1a17 17 0 0 0-9.7 5.3L8 26a22 22 0 0 1 9-6Zm22.5 5.4L36 29l-.8-.8L26 19a22 22 0 0 1 13.5 6.4ZM8.2 11.2l3.7 3.7a24.7 24.7 0 0 0-8.4 6.6l-3.6-3.6c2.4-2.7 5.2-5 8.3-6.7ZM24 7a32 32 0 0 1 23.4 10.2l-3.5 3.6a27 27 0 0 0-24.5-8.4l-4.2-4.2A32 32 0 0 1 24 7ZM2 5l3-3 41 41-3 3L2 5Z" opacity=".7"/>
</defs><rect fill="#000" width="100%" height="100%" opacity="0.075"/><use href="#icon" x="50%" y="50%" transform="translate(-24 -24)"/></svg>`;

/**
 * Update asset cache
 * @returns {Promise<Cache>} - Updated asset cache
 */
async function updateAssetCache() {
  try {
    const assetCache = await caches.open(assetCacheName);

    // These items won’t block the installation of the service worker
    assetCache.addAll(["/app.webmanifest"]);

    // These items must be cached for service worker to complete installation
    await assetCache.addAll(["APP_CSS_PATH", "APP_JS_PATH", "/offline"]);

    return assetCache;
  } catch (error) {
    console.error("Error updating asset cache", error);
  }
}

/**
 * Cache the page(s) that initiate the service worker
 * @returns {Promise<Cache>} - Updated page cache
 */
async function cacheClients() {
  const pages = [];
  try {
    const allClients = await clients.matchAll({ includeUncontrolled: true });

    for (const client of allClients) {
      pages.push(client.url);
    }

    const pagesCache = await caches.open(pagesCacheName);
    await pagesCache.addAll(pages);

    return pagesCache;
  } catch (error) {
    console.error("Error updating client cache", error);
  }
}

/**
 * Remove caches whose name is no longer valid
 */
async function clearOldCaches() {
  try {
    const keys = await caches.keys();

    await Promise.all(
      keys
        .filter((key) => !cacheList.has(key))
        .map((key) => caches.delete(key)),
    );
  } catch (error) {
    console.error("Error clearing old caches", error);
  }
}

/**
 * Trim cache
 * @param {string} cacheName - Name of cache
 * @param {number} maxItems - Maximum number of items to keep in cache
 */
async function trimCache(cacheName, maxItems) {
  try {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();

    if (keys.length > maxItems) {
      await cache.delete(keys[0]);
      await trimCache(cacheName, maxItems);
    }
  } catch (error) {
    console.error(`Error trimming ${cacheName} cache`, error);
  }
}

self.addEventListener("install", async (event) => {
  event.waitUntil(
    (async () => {
      await updateAssetCache();
      await cacheClients();
      self.skipWaiting();
    })(),
  );
});

self.addEventListener("activate", async (event) => {
  event.waitUntil(
    (async () => {
      await clearOldCaches();
      await clients.claim();
    })(),
  );
});

if (registration.navigationPreload) {
  self.addEventListener("activate", (event) => {
    event.waitUntil(registration.navigationPreload.enable());
  });
}

self.addEventListener("message", (event) => {
  if (event.data.command == "trimCaches") {
    trimCache(pagesCacheName, maxPages);
    trimCache(imageCacheName, maxImages);
  }
});

self.addEventListener("fetch", (event) => {
  const request = event.request;

  // Ignore non-GET requests
  if (request.method !== "GET") {
    return;
  }

  const retrieveFromCache = caches.match(request);

  // For HTML requests, try network, fall back to cache, else show offline page
  if (
    request.mode === "navigate" ||
    request.headers.get("Accept").includes("text/html")
  ) {
    event.respondWith(
      (async () => {
        // CHECK CACHE
        const timer = setTimeout(async () => {
          const responseFromCache = await retrieveFromCache;
          if (responseFromCache) {
            return responseFromCache;
          }
        }, timeout);

        try {
          const preloadResponse = await Promise.resolve(event.preloadResponse);
          const responseFromPreloadOrFetch =
            preloadResponse || (await fetch(request));

          // NETWORK
          // Save a copy of page to pages cache
          clearTimeout(timer);
          const copy = responseFromPreloadOrFetch.clone();
          const pagesCache = await caches.open(pagesCacheName);
          await pagesCache.put(request, copy);

          return responseFromPreloadOrFetch;
        } catch (error) {
          console.error(error, request);

          // CACHE or OFFLINE PAGE
          clearTimeout(timer);
          const responseFromCache = await retrieveFromCache;
          return responseFromCache || caches.match("/offline");
        }
      })(),
    );

    return;
  }

  // For non-HTML requests, look in cache first, fall back to network
  event.respondWith(
    (async () => {
      try {
        const responseFromCache = await retrieveFromCache;

        if (responseFromCache) {
          // CACHE
          return responseFromCache;
        } else {
          const responseFromFetch = await fetch(request);

          // NETWORK
          // If request is for an image, save a copy to images cache
          if (/\.(jpe?g|png|gif|svg|webp)/.test(request.url)) {
            const copy = responseFromFetch.clone();
            const imagesCache = await caches.open(imageCacheName);
            await imagesCache.put(request, copy);
          }

          return responseFromFetch;
        }
      } catch (error) {
        console.error(error);

        // OFFLINE IMAGE
        if (/\.(jpe?g|png|gif|svg|webp)/.test(request.url)) {
          return new Response(placeholderImage, {
            headers: {
              "Content-Type": "image/svg+xml",
              "Cache-Control": "no-store",
            },
          });
        }
      }
    })(),
  );
});
