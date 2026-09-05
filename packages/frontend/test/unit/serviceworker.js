import { strict as assert } from "node:assert";
import { afterEach, before, describe, it, mock } from "node:test";

// Service worker globals
const handlers = {};
const stores = new Map();
const state = { fetch: undefined, cacheMatchCount: 0 };

const location = new URL("https://indiekit.test/");
const cacheKey = (request) =>
  typeof request === "string"
    ? new URL(request, location).href
    : new URL(request.url, location).href;

Object.assign(globalThis, {
  location,
  registration: {},
  skipWaiting: () => {},
  clients: {
    claim: async () => {},
    matchAll: async () => [],
  },
  addEventListener: (type, handler) => {
    handlers[type] ||= [];
    handlers[type].push(handler);
  },
  fetch: (...arguments_) => state.fetch(...arguments_),
  caches: {
    async open(name) {
      if (!stores.has(name)) {
        stores.set(name, new Map());
      }

      const store = stores.get(name);
      return {
        async addAll(urls) {
          for (const url of urls) {
            store.set(cacheKey(url), new Response(`cached ${url}`));
          }
        },
        async delete(request) {
          return store.delete(cacheKey(request));
        },
        async keys() {
          return [...store.keys()].map((url) => new Request(url));
        },
        async match(request) {
          return store.get(cacheKey(request))?.clone();
        },
        async put(request, response) {
          store.set(cacheKey(request), response);
        },
      };
    },
    async match(request) {
      state.cacheMatchCount++;
      const key = cacheKey(request);
      for (const store of stores.values()) {
        if (store.has(key)) {
          return store.get(key).clone();
        }
      }
    },
    async keys() {
      return [...stores.keys()];
    },
    async delete(name) {
      return stores.delete(name);
    },
  },
});

await import("../../lib/serviceworker.js");

/**
 * Dispatch a fetch event to the service worker
 * @param {string} url - Request URL
 * @param {object} [options] - Options
 * @param {string} [options.accept] - Accept header
 * @returns {Promise<Response>|undefined} Response passed to `respondWith`
 */
const dispatchFetch = (url, { accept = "text/html" } = {}) => {
  let result;
  const event = {
    request: new Request(new URL(url, location), { headers: { accept } }),
    preloadResponse: undefined,
    respondWith(response) {
      result = response;
    },
  };

  for (const handler of handlers.fetch) {
    handler(event);
  }

  return result;
};

/**
 * Await a response, failing if none arrives within a second of real time
 * @param {Promise<Response>} result - Response promise
 * @returns {Promise<Response>} Response
 */
const settle = (result) =>
  Promise.race([
    result,
    new Promise((resolve, reject) => {
      AbortSignal.timeout(1000).addEventListener("abort", () =>
        reject(new Error("No response")),
      );
    }),
  ]);

describe("frontend/lib/serviceworker", () => {
  before(async () => {
    mock.method(console, "error", () => {});
    const assetCache = await caches.open("assets-APP_VERSION");
    await assetCache.addAll(["/offline"]);
  });

  afterEach(() => {
    stores.get("pages")?.clear();
    stores.get("images")?.clear();
    state.cacheMatchCount = 0;
    mock.timers.reset();
  });

  it("Serves cached page when network is slow", async () => {
    const pagesCache = await caches.open("pages");
    await pagesCache.put(
      new Request(new URL("/posts", location)),
      new Response("cached page"),
    );
    state.fetch = () => new Promise(() => {});
    mock.timers.enable({ apis: ["setTimeout"] });

    const result = dispatchFetch("/posts");
    // Let the worker reach its timeout before advancing the clock
    await new Promise((resolve) => setImmediate(resolve));
    mock.timers.tick(5000);
    const response = await settle(result);

    assert.equal(await response.text(), "cached page");
  });

  it("Waits for network when page not cached", async () => {
    state.fetch = async () => new Response("network page");

    const response = await settle(dispatchFetch("/posts"));

    assert.equal(await response.text(), "network page");
  });

  it("Serves offline page when network fails and page not cached", async () => {
    state.fetch = async () => {
      throw new TypeError("Failed to fetch");
    };

    const response = await settle(dispatchFetch("/posts"));

    assert.equal(await response.text(), "cached /offline");
  });

  it("Ignores cross-origin requests", () => {
    state.fetch = async () => new Response("avatar");

    const result = dispatchFetch("https://other.example/avatar.jpg", {
      accept: "image/*",
    });

    assert.equal(result, undefined);
  });

  it("Never caches or serves auth and session pages from cache", async () => {
    state.fetch = async () => new Response("login page");

    const response = await settle(dispatchFetch("/session/login"));

    assert.equal(await response.text(), "login page");
    assert.equal(state.cacheMatchCount, 0);
    assert.equal(stores.get("pages")?.size ?? 0, 0);
  });

  it("Responds with an error when a non-HTML request fails", async () => {
    state.fetch = async () => {
      throw new TypeError("Failed to fetch");
    };

    const response = await settle(
      dispatchFetch("/assets/app.js", { accept: "*/*" }),
    );

    assert.equal(response.status, 503);
  });
});
