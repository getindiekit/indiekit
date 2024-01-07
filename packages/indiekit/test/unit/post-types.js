import { strict as assert } from "node:assert";
import { describe, it } from "node:test";
import { testConfig } from "@indiekit-test/config";
import { Indiekit } from "../../index.js";
import { getPostTypes } from "../../lib/post-types.js";

describe("indiekit/lib/post-types", () => {
  it("Merges values from custom and preset post types", async () => {
    const config = await testConfig({
      usePostTypes: true,
      usePreset: true,
    });
    const indiekit = await Indiekit.initialize({ config });
    const { publication } = await indiekit.bootstrap();
    const result = getPostTypes(publication);

    assert.equal(result[0].name, "Article");
    assert.equal(result[1].name, "Custom note post type");
  });

  it("Returns preset post types", async () => {
    const config = await testConfig({
      usePostTypes: false,
      usePreset: true,
    });
    const indiekit = await Indiekit.initialize({ config });
    const { publication } = await indiekit.bootstrap();
    const result = getPostTypes(publication);

    assert.equal(result[0].name, "Article");
    assert.equal(result[1].name, "Note");
  });

  it("Returns custom post types", async () => {
    const config = await testConfig({
      usePostTypes: true,
      usePreset: false,
    });
    const indiekit = await Indiekit.initialize({ config });
    const { publication } = await indiekit.bootstrap();
    const result = getPostTypes(publication);

    assert.equal(result[0].name, "Custom note post type");
  });

  it("Returns array if no preset or custom post types", async () => {
    const config = await testConfig({
      usePostTypes: false,
      usePreset: false,
    });
    const indiekit = await Indiekit.initialize({ config });
    const { publication } = await indiekit.bootstrap();

    assert.deepEqual(getPostTypes(publication), []);
  });
});
