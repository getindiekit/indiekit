import { strict as assert } from "node:assert";
import { describe, it } from "node:test";
import { testConfig } from "@indiekit-test/config";
import { Indiekit } from "../../index.js";
import { getPostTypes } from "../../lib/post-types.js";

describe("indiekit/lib/post-types", () => {
  it("Merges values from custom and preset post types", async () => {
    const config = await testConfig({
      plugins: ["@indiekit/preset-jekyll"],
      usePostTypes: true,
    });
    const indiekit = await Indiekit.initialize({ config });
    await indiekit.installPlugins();
    const bootstrappedConfig = await indiekit.bootstrap();
    const { article: result } = getPostTypes(bootstrappedConfig);

    assert.equal(result.name, "Article");
    assert.equal(result.type, "article");
    assert.equal(result.h, "entry");
    assert.equal(Object.entries(result.fields).length, 8);
    assert.equal(result.properties.length, 8);
    assert.equal(result["required-properties"].length, 3);
    assert.deepEqual(result.post, {
      path: "_posts/{yyyy}-{MM}-{dd}-{slug}.md",
      url: "{yyyy}/{MM}/{dd}/{slug}",
    });
    assert.deepEqual(result.media, {
      path: "media/{yyyy}/{MM}/{dd}/{filename}",
    });
  });

  it("Returns custom post types", async () => {
    const config = await testConfig({ usePostTypes: true });
    const indiekit = await Indiekit.initialize({ config });
    const bootstrappedConfig = await indiekit.bootstrap();
    const { note: result } = getPostTypes(bootstrappedConfig);

    assert.equal(result.name, "Custom note post type");
  });

  it("Returns default if no preset or custom post types", async () => {
    const config = await testConfig({
      usePostTypes: false,
      usePreset: false,
    });
    const indiekit = await Indiekit.initialize({ config });
    const bootstrappedConfig = await indiekit.bootstrap();
    await indiekit.installPlugins();
    const result = getPostTypes(bootstrappedConfig);

    assert.equal(result.article.name, "Article");
    assert.equal(result.like.name, "Like");
  });
});
