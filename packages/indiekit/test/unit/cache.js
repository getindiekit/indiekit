import { strict as assert } from "node:assert";
import { describe, it, mock } from "node:test";

import { mockAgent } from "@indiekit-test/mock-agent";
import { default as Keyv } from "keyv";

import { getCachedResponse } from "../../lib/cache.js";

await mockAgent("indiekit");

describe("indiekit/lib/cache", async () => {
  const cache = new Keyv({ store: new Map() });

  it("Returns data from remote and saves to cache", async () => {
    const url = "https://website.example/categories.json";
    const result = await getCachedResponse(cache, 0, url);

    assert.deepEqual(result, ["Foo", "Bar"]);
  });

  it("Returns undefined and logs error if remote not found", async () => {
    mock.method(console, "error", () => {});

    const url = "https://website.example/404.json";
    const result = await getCachedResponse(cache, 0, url);

    assert.equal(console.error.mock.calls[0].arguments[1], "Not Found");
    assert.equal(result, undefined);
  });

  it("Returns undefined and logs error if remote not reachable", async () => {
    mock.method(console, "error", () => {});

    const url = "https://foo.bar/categories.json";
    const result = await getCachedResponse(cache, 0, url);

    assert.equal(
      console.error.mock.calls[0].arguments[0] instanceof Error,
      true,
    );
    assert.equal(result, undefined);
  });

  it("Gets data from cache", async () => {
    const url = "https://website.example/tags.json";
    await cache.set(url, ["Cached foo", "Cached bar"]);
    const result = await getCachedResponse(cache, 0, url);

    assert.deepEqual(result, ["Cached foo", "Cached bar"]);
  });
});
