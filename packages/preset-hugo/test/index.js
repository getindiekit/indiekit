import { strict as assert } from "node:assert";
import { describe, it } from "node:test";
import { Indiekit } from "@indiekit/indiekit";
import HugoPreset from "../index.js";

describe("preset-hugo", async () => {
  const hugo = new HugoPreset();
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
  const bootstrappedConfig = await indiekit.bootstrap();

  hugo.init(bootstrappedConfig);

  it("Initiates plug-in", async () => {
    assert.equal(indiekit.publication.preset.info.name, "Hugo");
  });

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
    assert.deepEqual(hugo.postTypes.article.post, {
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
