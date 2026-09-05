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

addEventListener("install", async (event) => {
  event.waitUntil(
    (async () => {
      await updateAssetCache();
      await cacheClients();
      skipWaiting();
    })(),
  );
});

addEventListener("activate", async (event) => {
  event.waitUntil(
    (async () => {
      await clearOldCaches();
      await clients.claim();
    })(),
  );
});

if (registration.navigationPreload) {
  addEventListener("activate", (event) => {
    event.waitUntil(registration.navigationPreload.enable());
  });
}

addEventListener("message", (event) => {
  if (event.data.command !== "trimCaches") {
    return;
  }

  trimCache(pagesCacheName, maxPages);
  trimCache(imageCacheName, maxImages);
});

addEventListener("fetch", (event) => {
  const request = event.request;

  // Ignore cross-origin and non-GET requests. Cross-origin images (avatars,
  // for example) are left to the browser: their opaque responses can’t be
  // inspected and each is padded to several megabytes when cached.
  const requestUrl = new URL(request.url);
  if (requestUrl.origin !== location.origin || request.method !== "GET") {
    return;
  }

  // Never cache authentication and session pages. Cached responses would
  // show a stale signed-in state, and their URLs carry one-time codes.
  if (/^\/(auth|session)(?:\/|$)/.test(requestUrl.pathname)) {
    event.respondWith(fetch(request));
    return;
  }

  // For HTML requests, try network, fall back to cache, else show offline page
  if (
    request.mode === "navigate" ||
    (request.headers.get("Accept") || "").includes("text/html")
  ) {
    event.respondWith(
      (async () => {
        const responseFromCache = await caches.match(request);
        const responseFromNetwork = (async () => {
          const preloadResponse = await Promise.resolve(event.preloadResponse);
          return preloadResponse || (await fetch(request));
        })();

        try {
          // Only give up on a slow network when there is a cached copy to
          // show instead; otherwise waiting beats showing the offline page
          const response = responseFromCache
            ? await Promise.race([
                responseFromNetwork,
                new Promise((resolve, reject) => {
                  setTimeout(
                    () => reject(new Error("Network timeout")),
                    timeout,
                  );
                }),
              ])
            : await responseFromNetwork;

          // NETWORK
          // Save a copy of page to pages cache
          const copy = response.clone();
          const pagesCache = await caches.open(pagesCacheName);
          await pagesCache.put(request, copy);

          return response;
        } catch (error) {
          console.error(error, request);

          // CACHE or OFFLINE PAGE
          return (
            responseFromCache ||
            (await caches.match("/offline")) ||
            new Response("Offline", {
              status: 503,
              headers: { "Content-Type": "text/plain" },
            })
          );
        }
      })(),
    );

    return;
  }

  // For non-HTML requests, look in cache first, fall back to network
  event.respondWith(
    (async () => {
      try {
        const responseFromCache = await caches.match(request);

        if (responseFromCache) {
          // CACHE
          return responseFromCache;
        }

        const responseFromFetch = await fetch(request);

        // NETWORK
        // If request is for an image, save a copy to images cache
        if (/\.(jpe?g|png|gif|svg|webp)/.test(request.url)) {
          const copy = responseFromFetch.clone();
          const imagesCache = await caches.open(imageCacheName);
          await imagesCache.put(request, copy);
        }

        return responseFromFetch;
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

        return new Response("Network error", {
          status: 503,
          headers: { "Content-Type": "text/plain" },
        });
      }
    })(),
  );
});
