import { strict as assert } from "node:assert";
import { describe, it } from "node:test";

import { Indiekit } from "@indiekit/indiekit";

import HugoPresetPlugin from "../index.js";

describe("preset-hugo", async () => {
  const hugo = new HugoPresetPlugin();

  it("Gets plug-in info", () => {
    assert.equal(hugo.name, "Hugo preset");
    assert.equal(hugo.info.name, "Hugo");
  });

  it("Gets plug-in installation prompts", () => {
    assert.equal(
      hugo.prompts[0].message,
      "Which front matter format are you using?",
    );
  });

  it("Gets publication post types", () => {
    assert.deepEqual(hugo.postTypes.get("article").post, {
      path: "content/articles/{slug}.md",
      url: "articles/{slug}",
    });
  });

  it("Renders post template", () => {
    const result = hugo.postTemplate({
      published: "2020-02-02",
      name: "Lunchtime",
    });

    assert.equal(result.includes("date: 2020-02-02"), true);
  });
});
