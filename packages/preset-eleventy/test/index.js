import { strict as assert } from "node:assert";
import { describe, it } from "node:test";

import { Indiekit } from "@indiekit/indiekit";

import EleventyPreset from "../index.js";

describe("preset-eleventy", async () => {
  const eleventy = new EleventyPreset();
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
  await indiekit.updatePublicationConfig();

  eleventy.init(indiekit);

  it("Initiates plug-in", async () => {
    assert.equal(indiekit.publication.preset.info.name, "Eleventy");
  });

  it("Gets plug-in info", () => {
    assert.equal(eleventy.name, "Eleventy preset");
    assert.equal(eleventy.info.name, "Eleventy");
  });

  it("Gets publication post types", () => {
    assert.deepEqual(eleventy.postTypes.get("article").post, {
      path: "articles/{yyyy}-{MM}-{dd}-{slug}.md",
      url: "articles/{yyyy}/{MM}/{dd}/{slug}",
    });
  });

  it("Renders post template", () => {
    const result = eleventy.postTemplate({
      published: "2020-02-02",
      name: "Lunchtime",
    });

    assert.equal(result.includes("date: 2020-02-02"), true);
  });
});
