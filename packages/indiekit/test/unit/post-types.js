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
    const { publication } = await indiekit.bootstrap();
    const result = getPostTypes(publication);

    assert.deepEqual(result[0], {
      name: "Custom note post type",
      type: "note",
      post: {
        path: "src/content/notes/{slug}.md",
        url: "notes/{slug}/",
      },
      media: {
        path: "media/notes/{yyyy}/{MM}/{dd}/{filename}",
      },
    });
  });

  it("Returns custom post types", async () => {
    const config = await testConfig({ usePostTypes: true });
    const indiekit = await Indiekit.initialize({ config });
    const { publication } = await indiekit.bootstrap();
    const result = getPostTypes(publication);

    assert.equal(result[0].name, "Custom note post type");
  });

  it("Returns array if no preset or custom post types", async () => {
    const config = await testConfig({ usePostTypes: false });
    const indiekit = await Indiekit.initialize({ config });
    const { publication } = await indiekit.bootstrap();

    assert.deepEqual(getPostTypes(publication), []);
  });
});
