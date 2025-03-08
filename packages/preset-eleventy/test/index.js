import { strict as assert } from "node:assert";
import { describe, it } from "node:test";

import EleventyPresetPlugin from "../index.js";

describe("preset-eleventy", async () => {
  const eleventy = new EleventyPresetPlugin();

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
