import test from "ava";
import { setGlobalDispatcher } from "undici";
import { websiteAgent } from "@indiekit-test/mock-agent";
import { testConfig } from "@indiekit-test/config";
import { Indiekit } from "../../index.js";
import { Cache } from "../../lib/cache.js";

setGlobalDispatcher(websiteAgent());

test.beforeEach(async (t) => {
  const config = await testConfig();
  const indiekit = new Indiekit({ config });
  const { application } = await indiekit.bootstrap();

  t.context = {
    cacheCollection: application.cache,
    url: "https://website.example/categories.json",
    urlNotFound: "https://website.example/404.json",
  };
});

test("Returns data from remote file and saves to cache", async (t) => {
  const cache = new Cache(t.context.cacheCollection);

  const result = await cache.json("test1", t.context.url);

  t.is(result.source, t.context.url);
});

test("Throws error if remote file not found", async (t) => {
  const cache = new Cache(t.context.cacheCollection);

  await t.throwsAsync(cache.json("test2", t.context.urlNotFound), {
    message: `Unable to fetch ${t.context.urlNotFound}: Not Found`,
  });
});

test("Gets data from cache", async (t) => {
  t.context.cacheCollection.insertOne({
    key: "test3",
    url: t.context.url,
    data: ["Foo", "Bar"],
  });
  const cache = new Cache(t.context.cacheCollection);

  // Request item and add to cache
  await cache.json("test3", t.context.url);

  // Retrieve item from cache
  const result = await cache.json("test3", t.context.url);

  t.is(result.source, "cache");
});
