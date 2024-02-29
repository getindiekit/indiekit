import { strict as assert } from "node:assert";
import { beforeEach, describe, it } from "node:test";
import { mockAgent } from "@indiekit-test/mock-agent";
import { testConfig } from "@indiekit-test/config";
import { Indiekit } from "../../index.js";
import { getCategories } from "../../lib/categories.js";

await mockAgent("indiekit");

describe("indiekit/lib/categories", async () => {
  let bootstrappedConfig;

  beforeEach(async () => {
    const config = await testConfig();
    const indiekit = await Indiekit.initialize({ config });
    bootstrappedConfig = await indiekit.bootstrap();
  });

  it("Returns array of available categories", async () => {
    bootstrappedConfig.publication.categories = ["Foo", "Bar"];

    const result = await getCategories(bootstrappedConfig);

    assert.deepEqual(result, ["Bar", "Foo"]);
  });

  it("Fetches array from remote JSON file", async () => {
    bootstrappedConfig.publication.categories =
      "https://website.example/categories.json";
    const result = await getCategories(bootstrappedConfig);

    assert.deepEqual(result, ["Bar", "Foo"]);
  });

  it("Returns empty array if remote JSON file not found", async () => {
    bootstrappedConfig.publication.categories =
      "https://website.example/404.json";
    const result = await getCategories(bootstrappedConfig);

    assert.deepEqual(result, []);
  });

  it("Returns empty array if remote JSON file not reachable", async () => {
    bootstrappedConfig.publication.categories =
      "https://foo.bar/categories.json";
    const result = await getCategories(bootstrappedConfig);

    assert.deepEqual(result, []);
  });

  it("Returns empty array if no publication configuration", async () => {
    const result = await getCategories(bootstrappedConfig);

    assert.deepEqual(result, []);
  });
});
