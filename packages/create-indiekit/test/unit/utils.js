import { strict as assert } from "node:assert";
import { describe, it } from "node:test";

import {
  addPluginConfig,
  isCompatibleNodeVersion,
  getPlugin,
} from "../../lib/utils.js";

describe("create-indiekit/lib/utils", () => {
  it("Adds plug-in to Indiekit configuration", async () => {
    const result = await addPluginConfig("@indiekit/preset-jekyll", {
      plugins: [],
    });

    assert.deepEqual(result, {
      plugins: ["@indiekit/preset-jekyll"],
    });
  });

  it("Checks if Node.js version meets minimum requirement", () => {
    assert.equal(isCompatibleNodeVersion("12.15", 16), false);
    assert.equal(isCompatibleNodeVersion("16.15", 12), true);
  });

  it("Gets question prompts specified by plug-in", async () => {
    const { name, prompts } = await getPlugin("@indiekit/preset-hugo");

    assert.equal(name, "Hugo preset");
    assert.equal(
      prompts[0].message,
      "Which front matter format are you using?",
    );
    assert.equal(prompts[0].type, "select");
  });
});
