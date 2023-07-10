import test from "ava";
import Keyv from "keyv";
import KeyvMongoDB from "keyv-mongodb";
import { MongoMemoryServer } from "mongodb-memory-server";
import { mockAgent } from "@indiekit-test/mock-agent";
import { getCachedResponse } from "../../lib/cache.js";

await mockAgent("indiekit");

test.beforeEach(async (t) => {
  const mongod = await MongoMemoryServer.create();
  const mongodbUrl = mongod.getUri();

  t.context = {
    cache: new Keyv({
      collectionName: "cache",
      store: new KeyvMongoDB({ url: mongodbUrl }),
    }),
    url: "https://website.example/categories.json",
    urlNotFound: "https://website.example/404.json",
  };
});

test.afterEach((t) => {
  t.context.cache.clear();
});

test("Returns data from remote file and saves to cache", async (t) => {
  const result = await getCachedResponse(
    t.context.cache,
    "https://website.example/categories.json"
  );

  t.deepEqual(result, ["Foo", "Bar"]);
});

test("Throws error remote file not found", async (t) => {
  await t.throwsAsync(
    getCachedResponse(t.context.cache, "https://website.example/404.json"),
    {
      message: "Not Found",
    }
  );
});

test("Gets data from cache", async (t) => {
  const url = "https://website.example/tags.json";
  await t.context.cache.set(url, ["Cached foo", "Cached bar"]);
  const result = await getCachedResponse(t.context.cache, url);

  t.deepEqual(result, ["Cached foo", "Cached bar"]);
});
