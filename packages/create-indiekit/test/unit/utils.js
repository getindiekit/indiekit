import { strict as assert } from "node:assert";
import { describe, it, mock } from "node:test";
import {
  addPluginConfig,
  checkNodeVersion,
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
    mock.method(console, "info", () => {});
    mock.method(process, "exit", () => {});

    checkNodeVersion("12.15", 16);

    assert.equal(
      console.info.mock.calls[0].arguments[0],
      "Node.js v12.15 is not supported.",
    );
    assert.equal(
      console.info.mock.calls[1].arguments[0],
      "Please use Node.js v16 or higher.",
    );
    assert.equal(process.exit.mock.calls.length, 1);
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
