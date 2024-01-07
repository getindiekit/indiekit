import { strict as assert } from "node:assert";
import { after, afterEach, describe, it } from "node:test";
import Keyv from "keyv";
import KeyvMongoDB from "keyv-mongodb";
import { testDatabase } from "@indiekit-test/database";
import { mockAgent } from "@indiekit-test/mock-agent";
import { getCachedResponse } from "../../lib/cache.js";

await mockAgent("indiekit");
const { client, database, mongoServer } = await testDatabase();
const cache = new Keyv({
  collectionName: "cache",
  store: new KeyvMongoDB({ db: database }),
});

describe("indiekit/lib/cache", () => {
  afterEach(() => {
    cache.clear();
  });

  after(() => {
    client.close();
    mongoServer.stop();
  });

  it("Returns data from remote file and saves to cache", async () => {
    const result = await getCachedResponse(
      cache,
      "https://website.example/categories.json",
    );

    assert.deepEqual(result, ["Foo", "Bar"]);
  });

  it("Throws error remote file not found", async () => {
    await assert.rejects(
      getCachedResponse(cache, "https://website.example/404.json"),
      {
        message: "Not Found",
      },
    );
  });

  it("Gets data from cache", async () => {
    const url = "https://website.example/tags.json";
    await cache.set(url, ["Cached foo", "Cached bar"]);
    const result = await getCachedResponse(cache, url);

    assert.deepEqual(result, ["Cached foo", "Cached bar"]);
  });
});
