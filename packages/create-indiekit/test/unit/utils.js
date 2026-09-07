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
    assert.equal(isCompatibleNodeVersion("24.17", "24.17"), true);
    assert.equal(isCompatibleNodeVersion("24.16", "24.17"), false);
    assert.equal(isCompatibleNodeVersion("24.15", "24"), true);

    // Patch versions ignored
    assert.equal(isCompatibleNodeVersion("24.17.0", "24.17.9"), true);

    // Minor compared numerically, not lexically or as a decimal
    assert.equal(isCompatibleNodeVersion("24.9.0", "24.17"), false);
    assert.equal(isCompatibleNodeVersion("24.100.0", "24.9"), true);

    // Major wins over minor
    assert.equal(isCompatibleNodeVersion("26.4.0", "24.17"), true);
    assert.equal(isCompatibleNodeVersion("25.0.0", "24.17"), true);
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
