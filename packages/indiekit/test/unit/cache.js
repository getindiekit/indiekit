import { strict as assert } from "node:assert";
import { describe, it } from "node:test";
import Keyv from "keyv";
import { mockAgent } from "@indiekit-test/mock-agent";
import { getCachedResponse } from "../../lib/cache.js";

await mockAgent("indiekit");

describe("indiekit/lib/cache", async () => {
  const cache = new Keyv({ store: new Map() });

  it("Returns data from remote file and saves to cache", async () => {
    const url = "https://website.example/categories.json";
    const result = await getCachedResponse(cache, 0, url);

    assert.deepEqual(result, ["Foo", "Bar"]);
  });

  it("Throws error remote file not found", async () => {
    const url = "https://website.example/404.json";

    await assert.rejects(getCachedResponse(cache, 0, url), {
      message: "Not Found",
    });
  });

  it("Gets data from cache", async () => {
    const url = "https://website.example/tags.json";
    await cache.set(url, ["Cached foo", "Cached bar"]);
    const result = await getCachedResponse(cache, 0, url);

    assert.deepEqual(result, ["Cached foo", "Cached bar"]);
  });
});
