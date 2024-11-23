import { strict as assert } from "node:assert";
import { describe, it } from "node:test";
import { Indiekit } from "@indiekit/indiekit";
import JekyllPreset from "../index.js";

describe("preset-jekyll", async () => {
  const jekyll = new JekyllPreset();
  const indiekit = await Indiekit.initialize({
    config: {
      publication: {
        me: "https://website.example",
        postTypes: {
          puppy: {
            name: "Puppy posts",
          },
        },
      },
    },
  });
  await indiekit.installPlugins();
  const bootstrappedConfig = await indiekit.bootstrap();

  jekyll.init(bootstrappedConfig);

  it("Initiates plug-in", async () => {
    assert.equal(indiekit.publication.preset.info.name, "Jekyll");
  });

  it("Gets plug-in info", () => {
    assert.equal(jekyll.name, "Jekyll preset");
    assert.equal(jekyll.info.name, "Jekyll");
  });

  it("Gets publication post types", () => {
    assert.deepEqual(jekyll.postTypes.article.post, {
      path: "_posts/{yyyy}-{MM}-{dd}-{slug}.md",
      url: "{yyyy}/{MM}/{dd}/{slug}",
    });
  });

  it("Renders post template", () => {
    const result = jekyll.postTemplate({
      published: "2020-02-02",
      name: "Lunchtime",
    });

    assert.equal(result.includes("date: 2020-02-02"), true);
  });
});
